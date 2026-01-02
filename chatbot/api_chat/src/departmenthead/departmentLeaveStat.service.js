// src/employee/manager/departmentLeaveStat.service.js
const pool = require("../config/dbb");

async function getDepartmentLeaveStat(managerId, month = null) {
  try {
    const normalizedId = managerId.toUpperCase();

    // 1. Lấy phòng ban của Trưởng Phòng
    const [managerRows] = await pool.query(
      `SELECT phong_ban_id
       FROM nhan_vien
       WHERE ma_nhan_vien = ?
       LIMIT 1`,
      [normalizedId]
    );

    if (managerRows.length === 0 || !managerRows[0].phong_ban_id) {
      console.log(
        "❌ Không tìm thấy phòng ban cho Trưởng Phòng:",
        normalizedId
      );
      return null;
    }

    const departmentId = managerRows[0].phong_ban_id;
    console.log("🔍 Phòng ban của Trưởng Phòng:", departmentId);

    // Tự lấy tháng hiện tại nếu không truyền
    if (!month) {
      const now = new Date();
      month = now.getMonth() + 1; // December 2025 → month = 12
    }
    console.log("🔍 Tháng được yêu cầu:", month);

    // 2. Lấy dữ liệu chấm công tháng đó cho từng nhân viên trong phòng
    const [rows] = await pool.query(
      `SELECT
        nv.ma_nhan_vien AS ma,
        nv.ho_ten AS ten,
        COALESCE(MAX(cc.so_ngay_da_nghi_phep), 0) AS maxUsed,
        COALESCE(MIN(cc.so_ngay_da_nghi_phep), 0) AS minUsed,
        COALESCE(SUM(CASE WHEN cc.trang_thai = 'Nghỉ không phép' THEN 1 ELSE 0 END), 0) AS unpaidDays
      FROM nhan_vien nv
      LEFT JOIN cham_cong cc ON nv.ma_nhan_vien = cc.ma_nhan_vien AND cc.thang = ?
      WHERE nv.phong_ban_id = ?
        AND nv.trang_thai = 'Đang làm'
      GROUP BY nv.ma_nhan_vien, nv.ho_ten
      ORDER BY (COALESCE(MAX(cc.so_ngay_da_nghi_phep), 0) - COALESCE(MIN(cc.so_ngay_da_nghi_phep), 0)) DESC,
                unpaidDays DESC, nv.ho_ten`,
      [month, departmentId]
    );
    console.log("🔍 Dữ liệu từ query:", rows); // Debug dữ liệu trả về

    if (rows.length === 0) {
      console.log(
        "⚠️ Không có nhân viên nào trong phòng hoặc không có dữ liệu tháng:",
        month
      );
      return { month, totalEmployees: 0, employees: [] };
    }

    const entitledDays = 20; // tổng ngày phép năm (có thể lấy từ bảng khác)

    const employees = rows.map((r) => ({
      ma: r.ma,
      ten: r.ten,
      usedDays: r.maxUsed - r.minUsed,
      unpaidDays: r.unpaidDays,
      remainingDays: entitledDays - r.maxUsed,
    }));

    const totalUsed = employees.reduce((sum, e) => sum + e.usedDays, 0);
    const totalUnpaidEmployees = employees.filter(
      (e) => e.unpaidDays > 0
    ).length;

    return {
      month,
      totalEmployees: rows.length,
      totalUsed,
      totalUnpaidEmployees,
      employees,
    };
  } catch (err) {
    console.error("Lỗi thống kê nghỉ phép phòng:", err);
    return null;
  }
}

module.exports = { getDepartmentLeaveStat };
