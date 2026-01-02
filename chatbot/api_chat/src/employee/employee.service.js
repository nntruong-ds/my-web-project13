const pool = require("../config/dbb");
async function getLeaveRemaining(userId) {
  const [rows] = await pool.query(
    "SELECT COALESCE(MAX(so_ngay_da_nghi_phep), 0) AS used_days FROM cham_cong WHERE ma_nhan_vien = ?",
    [userId]
  );

  if (rows.length === 0) {
    throw new Error("Employee not found");
  }

  // Lấy số ngày đã dùng (đã dùng COALESCE nên luôn có giá trị)
  const usedDays = rows[0].used_days;

  // Tổng ngày phép được hưởng (hardcode tạm, sau này lấy từ bảng khác)
  const entitledDays = 20;

  // Tính còn lại
  const remainingDays = entitledDays - usedDays;

  return remainingDays < 0 ? 0 : remainingDays; // Không âm
}

module.exports = {
  getLeaveRemaining,
};
