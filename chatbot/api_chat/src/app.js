// const express = require("express");
// const app = express();
// const chatRoutes = require("./routes/chat.route.js");

// // middleware để đọc JSON từ req.body
// app.use(express.json());

// // route test nhanh
// app.get("/", (req, res) => {
//   res.send("Server is running");
// });

// // gắn route chat
// app.use("/api", chatRoutes);

// // chạy server
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });
// app.js = cửa chính
// route = điều hướng
// controller = xử lý logic
// Mục tiêu bước này

// ✔️ Có API POST /api/chat
// ✔️ Nhận được message từ body
// ✔️ Kiểm tra message có tồn tại
// ✔️ Gọi gemini.service
// ✔️ Trả kết quả về client
//const express = require("express");
//const app = express();

//const chatRoutes = require("./routes/chat.route");
// const authRoutes = require("./routes/auth.route");

// app.use(express.json());

// app.use("/auth", authRoutes);
// app.use("/api", chatRoutes);

// module.exports = app;
const express = require("express");
const app = express();

const chatRoutes = require("./routes/chat.route.js");
const authRoutes = require("./routes/auth.route.js");

// middleware đọc JSON
app.use(express.json());

// routes
app.use("/api", chatRoutes);
//app.use("/auth", authRoutes);
app.use("/api", authRoutes);
module.exports = app;   // 🔥 BẮT BUỘC

// tesst
console.log("chatRoutes:", typeof chatRoutes);
console.log("authRoutes:", typeof authRoutes);
