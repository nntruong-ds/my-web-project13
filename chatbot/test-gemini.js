require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

(async () => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash" // ✅ MODEL HIỆN HÀNH
  });

  const result = await model.generateContent(
    "Xin chào, bạn là ai?"
  );

  console.log(result.response.text());
})();
