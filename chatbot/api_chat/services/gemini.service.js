

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { buildPrompt } = require("../src/utils/prompt.builder");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash", // Tên này hiện tại (Dec 2025) là hợp lệ và stable
});

async function askGemini({ message, user, context }) {
  try {
    // 1️⃣ build prompt (hiện tại trả về string → Gemini chấp nhận được)
    const prompt = buildPrompt({
      user,
      message,
      // context  // nếu sau này dùng history chat thì thêm vào đây
    });

    // Debug tạm (có thể comment sau khi ổn)
    // console.log("Prompt gửi đi:", prompt);

    // 2️⃣ gửi Gemini
    const result = await model.generateContent(prompt);

    // 3️⃣ lấy response an toàn
    const response = result.response;

    // Kiểm tra nếu bị block (safety, harm, v.v.)
    if (response.promptFeedback?.blockReason) {
      console.warn("Prompt bị block:", response.promptFeedback.blockReason);
      return "Xin lỗi, câu hỏi này bị chặn vì lý do an toàn. Vui lòng thử lại với nội dung khác.";
    }

    // Lấy text an toàn (throw nếu không có)
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Gemini API error:", error.message);
    return `Lỗi chi tiết: ${error.message}`; // Trả về lỗi thật để bạn thấy
  }
}

module.exports = { askGemini };
