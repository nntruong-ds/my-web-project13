// src/ceomanager/companyDisciplineReport.service.js
const pool = require("../config/dbb");

async function getCompanyDisciplineReport(period = null) {
  try {
    // Xử lý period
    let reportMonth = null;
    let reportYear = null;

    if (period) {
      if (typeof period === "number") {
        reportYear = new Date().getFullYear();
        reportMonth = period;
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

    const [rows] = await pool.query(
      `SELECT 
     pb.ten_phong AS tenPhong,
     cn.ten_chi_nhanh AS tenChiNhanh,
     COALESCE(SUM(emp.late_count), 0) AS totalLate
   FROM (
     SELECT 
       nv.phong_ban_id,
       nv.chinhanh_id,
       SUM(cc.so_lan_di_muon_ve_som) AS late_count
     FROM nhan_vien nv
     LEFT JOIN cham_cong cc ON nv.ma_nhan_vien = cc.ma_nhan_vien AND cc.thang = ?
     WHERE nv.trang_thai = 'Đang làm'
     GROUP BY nv.ma_nhan_vien, nv.phong_ban_id, nv.chinhanh_id
   ) emp
   LEFT JOIN phong_ban pb ON emp.phong_ban_id = pb.mapb
   LEFT JOIN chi_nhanh cn ON emp.chinhanh_id = cn.ma_chi_nhanh
   GROUP BY pb.mapb, pb.ten_phong, cn.ten_chi_nhanh
   ORDER BY totalLate DESC`,
      [reportMonth] // ← QUAN TRỌNG: truyền reportMonth vào đây
    );

    if (rows.length === 0) {
      return { noData: true, reportMonth: reportMonthStr };
    }

    const totalLateAll = rows.reduce((sum, r) => sum + Number(r.totalLate), 0);

    // Map để hiển thị phòng + chi nhánh
    const departments = rows.map((r) => ({
      displayName: `${r.tenPhong} (${r.tenChiNhanh || "Chưa phân"})`,
      totalLate: Number(r.totalLate),
    }));

    const worstDepartment = departments[0]; // nhiều nhất
    const bestDepartment = departments[departments.length - 1]; // ít nhất

    // Xu hướng so với tháng trước
    const prevMonth = new Date(reportYear, reportMonth - 1, 1);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthNum = prevMonth.getMonth() + 1;

    const [prevRows] = await pool.query(
      `SELECT COALESCE(SUM(emp.late_count), 0) AS totalPrev
       FROM (
         SELECT SUM(cc.so_lan_di_muon_ve_som) AS late_count
         FROM nhan_vien nv
         LEFT JOIN cham_cong cc ON nv.ma_nhan_vien = cc.ma_nhan_vien AND cc.thang = ?
         WHERE nv.trang_thai = 'Đang làm'
         GROUP BY nv.ma_nhan_vien
       ) emp`,
      [prevMonthNum]
    );

    const totalPrev = prevRows[0]?.totalPrev || 0;
    const change = totalLateAll - totalPrev;
    const changeText =
      change > 0
        ? `tăng ${change} lần`
        : change < 0
        ? `giảm ${Math.abs(change)} lần`
        : "không thay đổi";

    return {
      reportMonth: reportMonthStr,
      totalLateAll,
      totalDepartments: departments.length,
      departments,
      bestDepartment,
      worstDepartment,
      changeFromPrev: changeText,
    };
  } catch (err) {
    console.error("Lỗi báo cáo kỷ luật công ty:", err);
    return null;
  }
}

module.exports = { getCompanyDisciplineReport };
