// src/ceomanager/ceoOverviewReport.service.js
const pool = require("../config/dbb");

async function getCompanyOverviewReport(period = null) {
  try {
    // Xử lý period (tháng người dùng hỏi)
    let reportMonth = null;
    let reportYear = null;

    if (period) {
      if (typeof period === 'number') {
        // "tháng 10" → dùng tháng 10 năm hiện tại
        const now = new Date();
        reportYear = now.getFullYear();
        reportMonth = period;
      } else if (typeof period === 'string' && period.match(/^\d{4}-\d{2}$/)) {
        // "kỳ 2024-10" → dùng nguyên
        [reportYear, reportMonth] = period.split('-').map(Number);
      }
    }

    // Nếu không có period → dùng tháng hiện tại
    if (!reportMonth) {
      const now = new Date();
      reportYear = now.getFullYear();
      reportMonth = now.getMonth() + 1;
    }

    const reportMonthStr = `${reportYear}-${String(reportMonth).padStart(2, '0')}`; // YYYY-MM

    // 1. Tổng quan hiện tại (nhân viên đang làm việc cuối tháng báo cáo)
    const [currentRows] = await pool.query(
      `SELECT COUNT(*) AS totalEmployees
       FROM nhan_vien 
       WHERE trang_thai = 'Đang làm'`,
      []
    );

    const totalEmployees = currentRows[0]?.totalEmployees || 0;

    // 2. Số chi nhánh và phòng ban
    const [structureRows] = await pool.query(
      `SELECT 
         COUNT(DISTINCT chinhanh_id) AS totalBranches,
         COUNT(DISTINCT phong_ban_id) AS totalDepartments
       FROM nhan_vien 
       WHERE trang_thai = 'Đang làm'`
    );

    const structure = structureRows[0] || { totalBranches: 0, totalDepartments: 0 };

    // 3. Nhân viên mới (ngay_bat_dau trong tháng báo cáo)
    const [newEmployeesRows] = await pool.query(
      `SELECT COUNT(*) AS newEmployees
       FROM hop_dong hd
       JOIN nhan_vien nv ON hd.ma_nhan_vien = nv.ma_nhan_vien
       WHERE DATE_FORMAT(hd.ngay_bat_dau, '%Y-%m') = ?
         AND nv.trang_thai = 'Đang làm'`,
      [reportMonthStr]
    );

    const newEmployees = newEmployeesRows[0]?.newEmployees || 0;

    // 4. Nhân viên nghỉ (ngay_ket_thuc trong tháng báo cáo)
    const [leftEmployeesRows] = await pool.query(
      `SELECT COUNT(*) AS leftEmployees
       FROM hop_dong hd
       JOIN nhan_vien nv ON hd.ma_nhan_vien = nv.ma_nhan_vien
       WHERE DATE_FORMAT(hd.ngay_ket_thuc, '%Y-%m') = ?
         AND hd.trang_thai IN ('Hết hạn', 'Chấm dứt')`,
      [reportMonthStr]
    );

    const leftEmployees = leftEmployeesRows[0]?.leftEmployees || 0;

    // 5. Biến động净 (tăng = mới - nghỉ)
    const netChange = newEmployees - leftEmployees;

    // 6. Tỷ lệ nghỉ việc (churn rate) = số nghỉ / tổng đầu tháng (ước lượng)
    // Tổng đầu tháng ≈ tổng hiện tại + số nghỉ - số mới (gần đúng)
    const estimatedStartOfMonth = totalEmployees + leftEmployees - newEmployees;
    const churnRate = estimatedStartOfMonth > 0 
      ? (leftEmployees / estimatedStartOfMonth * 100).toFixed(2) 
      : 0;

    // 7. So sánh với tháng trước (nếu có)
    const prevMonth = new Date(reportYear, reportMonth - 1, 1);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthStr = prevMonth.toISOString().slice(0, 7);

    const [prevTotalRows] = await pool.query(
      `SELECT COUNT(*) AS prevTotal
       FROM nhan_vien 
       WHERE trang_thai = 'Đang làm'
         AND ngay_vao_lam <= ?`,
      [prevMonthStr + '-31']
    );

    const prevTotal = prevTotalRows[0]?.prevTotal || 0;
    const changeFromPrev = totalEmployees - prevTotal;
    const changePercentFromPrev = prevTotal > 0 ? (changeFromPrev / prevTotal * 100).toFixed(2) : 0;

    return {
      reportPeriod: reportMonthStr, // để handler hiển thị "tháng 10/2025"
      totalEmployees,
      totalBranches: structure.totalBranches,
      totalDepartments: structure.totalDepartments,
      newEmployees,
      leftEmployees,
      netChange,
      churnRate: Number(churnRate),
      changeFromPrev,
      changePercentFromPrev
    };

  } catch (err) {
    console.error("Lỗi báo cáo tổng quan công ty:", err);
    return null;
  }
}

module.exports = { getCompanyOverviewReport };