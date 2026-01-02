const pool = require("../config/dbb");

async function getBranchKpiStatSimple(userId, period = null) {
  try {
    const normalizedId = userId.toUpperCase();

    const [userRows] = await pool.query(
      `SELECT chinhanh_id FROM nhan_vien WHERE ma_nhan_vien = ? LIMIT 1`,
      [normalizedId]
    );

    if (userRows.length === 0 || !userRows[0].chinhanh_id) return null;

    const chiNhanhId = userRows[0].chinhanh_id;

    if (!period) {
      const [latest] = await pool.query(
        `SELECT ky_danh_gia FROM kpi
         WHERE ma_nhan_vien IN (SELECT ma_nhan_vien FROM nhan_vien WHERE chinhanh_id = ?)
         ORDER BY ky_danh_gia DESC LIMIT 1`,
        [chiNhanhId]
      );
      period = latest.length > 0 ? latest[0].ky_danh_gia : null;
    }

    if (!period) return null;

    const [rows] = await pool.query(
      `SELECT
         pb.ten_phong AS tenPhong,
         AVG(k.ty_le_hoan_thanh) AS avgCompletion
       FROM phong_ban pb
       LEFT JOIN nhan_vien nv ON pb.mapb = nv.phong_ban_id
       LEFT JOIN kpi_nhan_vien k ON nv.ma_nhan_vien = k.ma_nhan_vien AND k.ky_danh_gia = ?
       WHERE nv.chinhanh_id = ?
         AND nv.trang_thai = 'Đang làm'
       GROUP BY pb.mapb, pb.ten_phong
       ORDER BY avgCompletion DESC`,
      [period, chiNhanhId]
    );

    const avgAll =
      rows.length > 0
        ? Math.round(
            rows.reduce((sum, r) => sum + r.avgCompletion, 0) / rows.length
          )
        : 0;

    return {
      chiNhanhId,
      period,
      avgAll,
      totalDepartments: rows.length,
      departments: rows.map((r) => ({
        tenPhong: r.tenPhong,
        avgCompletion: Math.round(r.avgCompletion || 0),
      })),
    };
  } catch (err) {
    console.error("Lỗi thống kê KPI chi nhánh:", err);
    return null;
  }
}

module.exports = { getBranchKpiStatSimple };
