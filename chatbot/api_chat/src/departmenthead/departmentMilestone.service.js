// src/employee/manager/departmentMilestone.service.js
const pool = require("../config/dbb");

async function getDepartmentMilestones(
  managerId,
  type = "birthday",
  month = null
) {
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
      return null;
    }

    const departmentId = managerRows[0].phong_ban_id;

    let query, params;

    if (type === "birthday") {
      // Tự lấy tháng hiện tại nếu không truyền
      if (!month) {
        const now = new Date();
        month = now.getMonth() + 1;
      }

      query = `
        SELECT ma_nhan_vien AS ma, ho_ten AS ten, ngay_sinh AS date
        FROM nhan_vien
        WHERE phong_ban_id = ?
          AND trang_thai = 'Đang làm'
          AND MONTH(ngay_sinh) = ?
        ORDER BY DAY(ngay_sinh), ho_ten`;
      params = [departmentId, month];
    } else {
      // Ngày vào làm lâu nhất (sớm nhất)
      query = `
        SELECT ma_nhan_vien AS ma, ho_ten AS ten, ngay_vao_lam AS date
        FROM nhan_vien
        WHERE phong_ban_id = ?
          AND trang_thai = 'Đang làm'
        ORDER BY ngay_vao_lam ASC
        LIMIT 10`; // top 10 lâu năm nhất
      params = [departmentId];
    }

    const [rows] = await pool.query(query, params);

    if (rows.length === 0) {
      return { type, month, total: 0, employees: [] };
    }

    const employees = rows.map((r) => ({
      ma: r.ma,
      ten: r.ten,
      date: r.date
        ? new Date(r.date).toLocaleDateString("vi-VN")
        : "Chưa cập nhật",
    }));

    return {
      type,
      month,
      total: rows.length,
      employees,
    };
  } catch (err) {
    console.error("Lỗi lấy thống kê sinh nhật/ngày vào làm:", err);
    return null;
  }
}

module.exports = { getDepartmentMilestones };
