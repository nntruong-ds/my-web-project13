// src/employee/manager/employeeInfo.service.js
const pool = require("../config/dbb");

async function getEmployeePersonalInfo(managerId, employeeCode) {
  try {
    const normalizedManagerId = managerId.toUpperCase();
    const normalizedEmployeeCode = employeeCode.toUpperCase();

    // 1. Lấy phòng ban của Trưởng Phòng
    const [managerRows] = await pool.query(
      `SELECT phong_ban_id
       FROM nhan_vien
       WHERE ma_nhan_vien = ?
       LIMIT 1`,
      [normalizedManagerId]
    );

    if (managerRows.length === 0 || !managerRows[0].phong_ban_id) {
      return null; // Trưởng phòng không có phòng ban
    }

    const departmentId = managerRows[0].phong_ban_id;

    // 2. Lấy thông tin nhân viên (phải cùng phòng ban)
    const [empRows] = await pool.query(
      `SELECT ma_nhan_vien AS ma, ho_ten AS ten, email, ngay_vao_lam, ngay_sinh
       FROM nhan_vien
       WHERE ma_nhan_vien = ?
         AND phong_ban_id = ?
         AND trang_thai = 'Đang làm'
       LIMIT 1`,
      [normalizedEmployeeCode, departmentId]
    );

    if (empRows.length === 0) {
      return { notFound: true }; // Không tìm thấy hoặc không cùng phòng
    }

    const emp = empRows[0];

    return {
      ma: emp.ma,
      ten: emp.ten,
      email: emp.email || "Chưa cập nhật",
      ngayVaoLam: emp.ngay_vao_lam
        ? new Date(emp.ngay_vao_lam).toLocaleDateString("vi-VN")
        : "Chưa cập nhật",
      ngaySinh: emp.ngay_sinh
        ? new Date(emp.ngay_sinh).toLocaleDateString("vi-VN")
        : "Chưa cập nhật",
    };
  } catch (err) {
    console.error("Lỗi lấy thông tin nhân viên:", err);
    return null;
  }
}

module.exports = { getEmployeePersonalInfo };
