// salary.service.js
const pool = require("../config/dbb");

async function getSalaryInfo(userId, month = null) {
  // Nếu không truyền month → tự lấy tháng hiện tại
  if (!month) {
    const now = new Date();
    month = now.getMonth() + 1; // Tháng JS từ 0-11 → +1
  }

  // Query chỉ dùng tháng + ma_nhan_vien (không cần năm như yêu cầu của bạn)
  const [rows] = await pool.query(
    `SELECT
       thang AS month,
       luong_co_ban,
       phu_cap,
       thuong,
       luong_no_thang_truoc,
       tong_luong,
       bhyt,
       bhxh,
       phat
     FROM luong
     WHERE ma_nhan_vien = ?
       AND thang = ?
     LIMIT 1`,
    [userId, month]
  );

  if (rows.length === 0) {
    return null; // Không có dữ liệu tháng đó
  }

  const s = rows[0];

  // Tính thực lãnh (rất quan trọng!)
  //const thucNhan = (s.tong_luong || 0) - (s.bhyt || 0) - (s.bhxh || 0) - (s.phat || 0);

  return {
    month: s.month,
    luongCoBan: s.luong_co_ban || 0,
    phuCap: s.phu_cap || 0,
    thuong: s.thuong || 0,
    noThangTruoc: s.luong_no_thang_truoc || 0,
    tongGross: s.tong_luong || 0,
    bhyt: s.bhyt || 0,
    bhxh: s.bhxh || 0,
    phat: s.phat || 0,
    //thucNhan // thêm để handler dùng dễ
  };
}

module.exports = { getSalaryInfo };
