// src/ceomanager/companyKpiReport.service.js
const pool = require("../config/dbb");

async function getCompanyKpiReport(period = null) {
  try {
    let kpiPeriod = null;

    if (period) {
      if (typeof period === "number") {
        // "tháng 10" → tìm kỳ gần nhất có tháng 10
        const [matchRows] = await pool.query(
          `SELECT ky_danh_gia 
           FROM kpi_nhan_vien 
           WHERE ky_danh_gia LIKE ?
           ORDER BY ky_danh_gia DESC 
           LIMIT 1`,
          [`%-${String(period).padStart(2, "0")}`]
        );
        kpiPeriod = matchRows.length > 0 ? matchRows[0].ky_danh_gia : null;
      } else if (typeof period === "string") {
        kpiPeriod = period;
      }
    }

    // Nếu không có → lấy kỳ gần nhất
    if (!kpiPeriod) {
      const [latest] = await pool.query(
        `SELECT ky_danh_gia 
         FROM kpi_nhan_vien 
         ORDER BY ky_danh_gia DESC 
         LIMIT 1`
      );
      kpiPeriod = latest.length > 0 ? latest[0].ky_danh_gia : null;
    }

    if (!kpiPeriod) {
      return { noData: true, kpiPeriod: null };
    }

    const [rows] = await pool.query(
      `SELECT 
        pb.ten_phong AS tenPhong,
        cn.ten_chi_nhanh AS tenChiNhanh,
        AVG(k.ty_le_hoan_thanh) AS avgKpi
    FROM kpi_nhan_vien k
    JOIN nhan_vien nv ON k.ma_nhan_vien = nv.ma_nhan_vien
    LEFT JOIN phong_ban pb ON nv.phong_ban_id = pb.mapb
    LEFT JOIN chi_nhanh cn ON nv.chinhanh_id = cn.ma_chi_nhanh
    WHERE k.ky_danh_gia = ?
    GROUP BY nv.phong_ban_id, pb.ten_phong, cn.ten_chi_nhanh, cn.ma_chi_nhanh
    ORDER BY avgKpi DESC`,
      [kpiPeriod]
    );

    // Sau khi query rows thành công
    if (rows.length === 0) {
      return { noData: true, kpiPeriod };
    }

    // Tính KPI trung bình toàn công ty
    const avgCompany = rows.reduce((sum, r) => sum + r.avgKpi, 0) / rows.length;

    // Map departments với displayName để phân biệt chi nhánh
    const departments = rows.map((r) => ({
      displayName: `${r.tenPhong} (${r.tenChiNhanh || "Chưa phân"})`,
      tenPhong: r.tenPhong || "Chưa phân phòng",
      tenChiNhanh: r.tenChiNhanh || "Chưa phân",
      avgKpi: Number(r.avgKpi.toFixed(2)),
    }));

    const topDepartment = departments[0]; // cao nhất (vì ORDER BY DESC)
    const bottomDepartment = departments[departments.length - 1]; // thấp nhất

    return {
      kpiPeriod,
      avgCompany: Number(avgCompany.toFixed(2)),
      totalDepartments: departments.length,
      departments,
      topDepartment,
      bottomDepartment,
    };
  } catch (err) {
    console.error("Lỗi báo cáo KPI công ty:", err);
    return null;
  }
}

module.exports = { getCompanyKpiReport };
