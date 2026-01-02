// src/employee/manager/employeeContract.service.js
const pool = require("../config/dbb");

async function getEmployeeContractInfo(managerId, employeeCode = null) {
  console.log("🔍 Trưởng Phòng ID:", managerId);
  console.log("🔍 Mã nhân viên:", employeeCode);

  try {
    const normalizedManagerId = managerId.toUpperCase();

    // 1. Lấy phòng ban của Trưởng Phòng
    const [managerRows] = await pool.query(
      `SELECT phong_ban_id
       FROM nhan_vien
       WHERE ma_nhan_vien = ?
       LIMIT 1`,
      [normalizedManagerId]
    );

    if (managerRows.length === 0 || !managerRows[0].phong_ban_id) {
      return null;
    }

    const departmentId = managerRows[0].phong_ban_id;

    let query, params;

    if (employeeCode) {
      const normalizedCode = employeeCode.toUpperCase();

      // Lấy hợp đồng của 1 nhân viên cụ thể trong phòng
      query = `
        SELECT nv.ma_nhan_vien AS ma, nv.ho_ten AS ten, hd.ngay_ket_thuc AS endDate
        FROM nhan_vien nv
        LEFT JOIN hop_dong hd ON nv.ma_nhan_vien = hd.ma_nhan_vien
        WHERE nv.ma_nhan_vien = ?
          AND nv.phong_ban_id = ?
          AND nv.trang_thai = 'Đang làm'
        ORDER BY hd.ngay_bat_dau DESC
        LIMIT 1`;
      params = [normalizedCode, departmentId];
    } else {
      // Lấy tất cả nhân viên trong phòng có hợp đồng sắp hết (ví dụ trong 60 ngày tới)
      const today = new Date();
      const limitDate = new Date(today);
      limitDate.setDate(today.getDate() + 60); // 60 ngày tới

      const limitDateStr = limitDate.toISOString().slice(0, 10);

      query = `
        SELECT nv.ma_nhan_vien AS ma, nv.ho_ten AS ten, hd.ngay_ket_thuc AS endDate
        FROM nhan_vien nv
        LEFT JOIN hop_dong hd ON nv.ma_nhan_vien = hd.ma_nhan_vien
        WHERE nv.phong_ban_id = ?
          AND nv.trang_thai = 'Đang làm'
          AND hd.ngay_ket_thuc IS NOT NULL
          AND hd.ngay_ket_thuc <= ?
        ORDER BY hd.ngay_ket_thuc ASC, nv.ho_ten`;
      params = [departmentId, limitDateStr];
    }

    const [rows] = await pool.query(query, params);

    if (rows.length === 0) {
      return employeeCode ? { notFound: true } : { noExpiring: true };
    }

    return rows.map((r) => ({
      ma: r.ma,
      ten: r.ten,
      endDate: r.endDate
        ? new Date(r.endDate).toLocaleDateString("vi-VN")
        : "Không thời hạn",
    }));
  } catch (err) {
    console.error("Lỗi lấy thông tin hợp đồng:", err);
    return null;
  }
}

module.exports = { getEmployeeContractInfo };
