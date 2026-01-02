// src/config/dbb.js  (hoặc db.js)

const mysql = require('mysql2/promise'); // ← BẮT BUỘC dùng /promise

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',              // XAMPP mặc định để trống
  database: 'myweb',         // ← Đổi thành tên database thật của bạn (xem phpMyAdmin)
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool; // ← Export pool để dùng await pool.execute()