const pool = require("../config/dbb");

async function getBranchLateStatSimple(userId, period = null) {
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
        SUM(emp.late_count) AS totalLate
      FROM (
          SELECT
              nv.ma_nhan_vien,
              nv.phong_ban_id,
              MAX(cc.so_lan_di_muon_ve_som) AS late_count
          FROM nhan_vien nv
          JOIN cham_cong cc
              ON nv.ma_nhan_vien = cc.ma_nhan_vien
          WHERE nv.chinhanh_id = ?
            AND nv.trang_thai = 'Đang làm'
            AND cc.thang = ?
          GROUP BY nv.ma_nhan_vien, nv.phong_ban_id
      ) emp
      JOIN phong_ban pb ON emp.phong_ban_id = pb.mapb
      GROUP BY pb.mapb, pb.ten_phong
      ORDER BY totalLate DESC;`,
      [chiNhanhId, period]
    );

    const totalLateAll = rows.reduce(
      (sum, r) => sum + Number(r.totalLate || 0),
      0
    );

    return {
      chiNhanhId,
      period,
      totalLateAll,
      totalDepartments: rows.length,
      departments: rows,
    };
  } catch (err) {
    console.error("Lỗi thống kê đi muộn chi nhánh:", err);
    return null;
  }
}

module.exports = { getBranchLateStatSimple };
