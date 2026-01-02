const pool = require("../config/dbb");

async function getBranchLeaveStatSimple(userId, period = null) {
  try {
    const normalizedId = userId.toUpperCase();

    const [userRows] = await pool.query(
      `SELECT chinhanh_id FROM nhan_vien WHERE ma_nhan_vien = ? LIMIT 1`,
      [normalizedId]
    );

    if (userRows.length === 0 || !userRows[0].chinhanh_id) return null;

    const chiNhanhId = userRows[0].chinhanh_id;

    if (!period) {
      const now = new Date();
      period = now.getMonth() + 1;
    }

    const [rows] = await pool.query(
      `SELECT
         pb.ten_phong AS tenPhong,
         COALESCE(MAX(cc.so_ngay_da_nghi_phep) - MIN(cc.so_ngay_da_nghi_phep), 0) AS usedDays,
         COALESCE(SUM(CASE WHEN cc.trang_thai = 'Nghỉ không phép' THEN 1 ELSE 0 END), 0) AS unpaidDays
       FROM phong_ban pb
       LEFT JOIN nhan_vien nv ON pb.mapb = nv.phong_ban_id
       LEFT JOIN cham_cong cc ON nv.ma_nhan_vien = cc.ma_nhan_vien AND cc.thang = ?
       WHERE nv.chinhanh_id = ?
         AND nv.trang_thai = 'Đang làm'
       GROUP BY pb.mapb, pb.ten_phong
       ORDER BY usedDays DESC`,
      [period, chiNhanhId]
    );
    const totalUsed = rows.reduce((sum, r) => sum + Number(r.usedDays || 0), 0);
    const totalUnpaid = rows.reduce(
      (sum, r) => sum + Number(r.unpaidDays || 0),
      0
    );

    return {
      chiNhanhId,
      period,
      totalUsed,
      totalUnpaid,
      totalDepartments: rows.length,
      departments: rows,
    };
  } catch (err) {
    console.error("Lỗi thống kê nghỉ phép chi nhánh:", err);
    return null;
  }
}

module.exports = { getBranchLeaveStatSimple };
