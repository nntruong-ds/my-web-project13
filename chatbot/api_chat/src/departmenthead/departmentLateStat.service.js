// src/employee/manager/departmentLateStat.service.js
const pool = require("../config/dbb");

async function getDepartmentLateStat(managerId, month = null) {
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

    // Tự lấy tháng hiện tại nếu không truyền
    if (!month) {
      const now = new Date();
      month = now.getMonth() + 1;
    }

    // 2. Thống kê đi muộn/về sớm theo từng nhân viên trong phòng
    const [rows] = await pool.query(
      `SELECT
         nv.ma_nhan_vien AS ma,
         nv.ho_ten AS ten,
         COALESCE(SUM(cc.so_lan_di_muon_ve_som), 0) AS soLanViPham
       FROM nhan_vien nv
       LEFT JOIN cham_cong cc ON nv.ma_nhan_vien = cc.ma_nhan_vien AND cc.thang = ?
       WHERE nv.phong_ban_id = ?
         AND nv.trang_thai = 'Đang làm'
       GROUP BY nv.ma_nhan_vien, nv.ho_ten
       ORDER BY soLanViPham DESC, nv.ho_ten`,
      [month, departmentId]
    );

    if (rows.length === 0) {
      return { month, totalEmployees: 0, employees: [] };
    }

    const totalWithViolation = rows.filter((r) => r.soLanViPham > 0).length;
    const topLate = rows[0]?.soLanViPham || 0;

    return {
      month,
      departmentId,
      totalEmployees: rows.length,
      totalWithViolation,
      topLate,
      employees: rows.map((r) => ({
        ma: r.ma,
        ten: r.ten,
        soLan: r.soLanViPham,
      })),
    };
  } catch (err) {
    console.error("Lỗi thống kê đi muộn phòng ban:", err);
    return null;
  }
}

module.exports = { getDepartmentLateStat };
