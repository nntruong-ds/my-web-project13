
const jwt = require("jsonwebtoken");
const pool = require("../config/dbb");

exports.login = async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "username required" });
  }

  try {
    // 1️⃣ Query user từ DB
    const [rows] = await pool.execute(
      "SELECT TenDangNhap, VaiTro FROM users WHERE TenDangNhap = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    const user = rows[0];

    // 2️⃣ Tạo JWT (đóng dấu role)
    const token = jwt.sign(
      {
        id: user.TenDangNhap,
        //username: user.username,
        role: user.VaiTro
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Trả về thông tin, trong đó có vaitro quan trọng nhất
    res.json({
      //success: true,
      id: user.TenDangNhap,
      vaitro: user.VaiTro.trim(),  // <-- Đây là cái bạn cần check
      token: token
    });

  } catch (err) {
    console.error("LOGIN ERROR CHI TIẾT:", err); // ← Quan trọng nhất
    console.error("Error code:", err.code);     // ví dụ: ER_BAD_TABLE_ERROR
    console.error("Error message:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
