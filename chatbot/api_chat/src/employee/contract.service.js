const pool = require("../config/dbb");

async function getContractEndDate(userId) {
  try {
    const [rows] = await pool.query(
      `SELECT ngay_ket_thuc AS endDate
       FROM hop_dong
       WHERE ma_nhan_vien = ?
       ORDER BY ngay_bat_dau DESC  -- lấy hợp đồng mới nhất
       LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      return null; // không có hợp đồng
    }

    if (rows[0].endDate === null) {
      return "unlimited"; // hợp đồng không thời hạn
    }

    return rows[0].endDate; // trả về ngày (string hoặc Date tùy DB config)
  } catch (err) {
    console.error("Lỗi lấy thông tin hợp đồng:", err);
    return null;
  }
}

module.exports = { getContractEndDate };
