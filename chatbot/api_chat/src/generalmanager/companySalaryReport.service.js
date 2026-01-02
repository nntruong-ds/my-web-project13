// src/ceomanager/companySalaryReport.service.js
const pool = require("../config/dbb");

async function getCompanySalaryReport(period = null) {
  try {
    // Xử lý period
    let reportMonth = null;
    let reportYear = null;

    if (period) {
      if (typeof period === "number") {
        reportYear = new Date().getFullYear();
        reportMonth = period;
      } else if (typeof period === "string" && period.match(/^\d{4}-\d{2}$/)) {
        [reportYear, reportMonth] = period.split("-").map(Number);
      }
    }

    if (!reportMonth) {
      const now = new Date();
      reportYear = now.getFullYear();
      reportMonth = now.getMonth() + 1;
    }

    const reportMonthStr = `${reportYear}-${String(reportMonth).padStart(
      2,
      "0"
    )}`;

    // Lấy lương thực nhận (tong_luong) tháng báo cáo theo phòng + chi nhánh
    const [rows] = await pool.query(
      `SELECT 
         pb.ten_phong AS tenPhong,
         cn.ten_chi_nhanh AS tenChiNhanh,
         COALESCE(SUM(luong_latest.tong_luong), 0) AS totalSalary
       FROM nhan_vien nv
       LEFT JOIN phong_ban pb ON nv.phong_ban_id = pb.mapb
       LEFT JOIN chi_nhanh cn ON nv.chinhanh_id = cn.ma_chi_nhanh
       LEFT JOIN (
         SELECT ma_nhan_vien, tong_luong
         FROM luong l1
         WHERE (nam, thang) = (
           SELECT nam, thang
           FROM luong l2
           WHERE l2.ma_nhan_vien = l1.ma_nhan_vien
           ORDER BY nam DESC, thang DESC
           LIMIT 1
         )
       ) luong_latest ON nv.ma_nhan_vien = luong_latest.ma_nhan_vien
       WHERE nv.trang_thai = 'Đang làm'
       GROUP BY pb.mapb, pb.ten_phong, cn.ten_chi_nhanh
       ORDER BY totalSalary DESC`,
      []
    );

    if (rows.length === 0) {
      return { noData: true, reportPeriod: reportMonthStr };
    }

    const totalSalaryAll = rows.reduce(
      (sum, r) => sum + Number(r.totalSalary),
      0
    );

    const departments = rows.map((r) => ({
      displayName: `${r.tenPhong} (${r.tenChiNhanh || "Chưa phân"})`,
      totalSalary: Number(r.totalSalary),
    }));

    const highestSalaryDepartment = departments[0]; // tốn lương nhất
    const lowestSalaryDepartment = departments[departments.length - 1]; // ít nhất

    // So sánh với tháng trước
    const prevMonth = new Date(reportYear, reportMonth - 1, 1);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthNum = prevMonth.getMonth() + 1;

    const [prevRows] = await pool.query(
      `SELECT COALESCE(SUM(luong_latest.tong_luong), 0) AS totalPrev
       FROM nhan_vien nv
       LEFT JOIN (
         SELECT ma_nhan_vien, tong_luong
         FROM luong l1
         WHERE (nam, thang) = (
           SELECT nam, thang
           FROM luong l2
           WHERE l2.ma_nhan_vien = l1.ma_nhan_vien
           ORDER BY nam DESC, thang DESC
           LIMIT 1
         )
       ) luong_latest ON nv.ma_nhan_vien = luong_latest.ma_nhan_vien
       WHERE nv.trang_thai = 'Đang làm'`,
      []
    );

    const totalPrev = prevRows[0]?.totalPrev || 0;
    const change = totalSalaryAll - totalPrev;
    const changePercent =
      totalPrev > 0 ? ((change / totalPrev) * 100).toFixed(2) : 0;

    return {
      reportPeriod: reportMonthStr,
      totalSalaryAll,
      totalDepartments: departments.length,
      departments,
      highestSalaryDepartment,
      lowestSalaryDepartment,
      changeFromPrev: change,
      changePercentFromPrev: changePercent,
    };
  } catch (err) {
    console.error("Lỗi báo cáo lương công ty:", err);
    return null;
  }
}

module.exports = { getCompanySalaryReport };
