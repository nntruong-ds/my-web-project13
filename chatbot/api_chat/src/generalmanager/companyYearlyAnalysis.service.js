// src/ceomanager/companyYearlyAnalysis.service.js
const pool = require("../config/dbb");

async function getCompanyYearlyAnalysis() {
  try {
    const currentYear = 2024; // test tạm
    const currentMonth = new Date().getMonth() + 1;

    // Tạo danh sách các tháng từ 1 đến hiện tại trong năm
    const months = [];
    for (let m = 1; m <= currentMonth; m++) {
      months.push({
        month: m,
        year: currentYear,
        str: `${currentYear}-${String(m).padStart(2, "0")}`,
      });
    }

    // 1. Xu hướng số lượng nhân viên (cuối mỗi tháng)
    const personnelTrend = [];
    for (const m of months) {
      const [rows] = await pool.query(
        `SELECT COUNT(*) AS count
         FROM nhan_vien 
         WHERE trang_thai = 'Đang làm'
           AND ngay_vao_lam <= ?`,
        [`${m.str}-31`]
      );
      personnelTrend.push({
        month: m.month,
        count: rows[0]?.count || 0,
      });
    }

    // 2. Xu hướng KPI trung bình theo tháng (dùng cột thang, nam mới)
    const kpiTrend = [];
    for (const m of months) {
      const [rows] = await pool.query(
        `SELECT AVG(k.ty_le_hoan_thanh) AS avgKpi
         FROM kpi_nhan_vien k
         JOIN nhan_vien nv ON k.ma_nhan_vien = nv.ma_nhan_vien
         WHERE k.nam = ? AND k.thang = ?
           AND nv.trang_thai = 'Đang làm'`,
        [m.year, m.month]
      );
      kpiTrend.push({
        month: m.month,
        avgKpi: Number(rows[0]?.avgKpi || 0).toFixed(2),
      });
    }

    // 3. Xu hướng đi muộn theo tháng
    const disciplineTrend = [];
    for (const m of months) {
      const [rows] = await pool.query(
        `SELECT COALESCE(SUM(cc.so_lan_di_muon_ve_som), 0) AS totalLate
         FROM cham_cong cc
         JOIN nhan_vien nv ON cc.ma_nhan_vien = nv.ma_nhan_vien
         WHERE cc.thang = ?
           AND nv.trang_thai = 'Đang làm'`,
        [m.month]
      );
      disciplineTrend.push({
        month: m.month,
        totalLate: Number(rows[0]?.totalLate || 0),
      });
    }

    return {
      year: currentYear,
      currentMonth,
      personnelTrend,
      kpiTrend,
      disciplineTrend,
    };
  } catch (err) {
    console.error("Lỗi phân tích từ đầu năm:", err);
    return null;
  }
}

module.exports = { getCompanyYearlyAnalysis };
