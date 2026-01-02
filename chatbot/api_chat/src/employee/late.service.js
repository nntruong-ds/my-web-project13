const pool = require("../config/dbb");

async function getLateSelf(userId, month = null) {
  // Tự lấy tháng hiện tại nếu không truyền
  if (!month) {
    const now = new Date();
    month = now.getMonth() + 1;
  }

  const [rows] = await pool.query(
    `SELECT
       COALESCE(SUM(so_lan_di_muon_ve_som), 0) AS totalLateDays
     FROM cham_cong
     WHERE ma_nhan_vien = ?
       AND thang = ?`,
    [userId, month]
  );

  // rows luôn có 1 phần tử vì MAX() trả về 1 dòng
  const totalLateDays = rows[0]?.totalLateDays || 0;

  return {
    month,
    totalLateDays,
  };
}

module.exports = { getLateSelf };
