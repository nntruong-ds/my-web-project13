// departmentEmployees.service.js
const pool = require("../config/dbb");

async function getDepartmentEmployees(managerId) {
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
      return null; // Trưởng phòng chưa có phòng ban
    }

    const departmentId = managerRows[0].phong_ban_id;

    // 2. Lấy tất cả nhân viên trong cùng phòng ban (bao gồm cả Trưởng Phòng)
    const [empRows] = await pool.query(
      `SELECT ma_nhan_vien AS ma, ho_ten AS ten, chuc_vu_id AS chucVu
       FROM nhan_vien
       WHERE phong_ban_id = ?
       ORDER BY chuc_vu_id DESC, ho_ten`, // Trưởng Phòng lên đầu
      [departmentId]
    );

    if (empRows.length === 0) {
      return { departmentId, employees: [] };
    }

    return {
      departmentId,
      total: empRows.length,
      employees: empRows.map((r) => ({
        ma: r.ma,
        ten: r.ten,
        chucVu: r.chucVu || "Nhân viên",
      })),
    };
  } catch (err) {
    console.error("Lỗi lấy danh sách nhân viên phòng ban:", err);
    return null;
  }
}

module.exports = { getDepartmentEmployees };
