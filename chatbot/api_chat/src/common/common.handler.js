// const { policies } = require("../data/policies.data");
// const { formatHolidays } = require("../data/holidays.data");
// //const { detectCommonIntent } = require("./common.intent.detector");
// function handleCommon(intent) {
//     //const intentInfo = detectCommonIntent(message);
//     if (intent === "POLICY") {
//       if (topic === "OT") {
//         return res.json({ reply: policies.OT });
//       }
//       if (topic === "LEAVE") {
//         return res.json({ reply: policies.LEAVE }); // ← Phải có policies.LEAVE
//       }
//       // Nếu có thêm topic khác sau này, thêm ở đây
//     }
//     if (intent === "HOLIDAY") {
//       return res.json({
//         reply: `📅 DANH SÁCH NGÀY NGHỈ LỄ NĂM 2025:\n${formatHolidays()}`
//       });
//     }
// }

// module.exports = { handleCommon };
// src/common/common.handler.js

const { policies } = require("../data/policies.data");
const { formatHolidays } = require("../data/holidays.data");

// Hàm handleCommon chỉ nhận intent (và optional sub-topic nếu cần)
// Phải CHỈ trả về string hoặc null, KHÔNG dùng res, req gì cả!
function handleCommon(intent, subTopic = null) {
  // 1️⃣ Xử lý chính sách công ty (OT, nghỉ phép...)
  if (intent === "POLICY") {
    if (subTopic === "OT") {
      return policies.OT.trim(); // Trả về chuỗi chính sách OT
    }
    if (subTopic === "LEAVE") {
      return policies.LEAVE.trim(); // Trả về chuỗi chính sách nghỉ phép
    }
    // Nếu hỏi "chính sách" chung mà không chỉ rõ OT hay LEAVE
    return `
📋 CHÍNH SÁCH CÔNG TY

• Làm thêm giờ (OT): Hỏi "OT" hoặc "làm thêm" để xem chi tiết
• Nghỉ phép năm: Hỏi "nghỉ phép" hoặc "phép năm" để xem chi tiết
• Các chính sách khác sẽ được bổ sung sau
    `.trim();
  }

  // 2️⃣ Xử lý ngày lễ
  if (intent === "HOLIDAY") {
    return `📅 DANH SÁCH NGÀY NGHỈ LỄ:\n${formatHolidays()}`.trim();
  }

  // 3️⃣ Nếu không match intent nào → trả null để fallback Gemini
  return null;
}

module.exports = { handleCommon };