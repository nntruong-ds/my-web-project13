require("dotenv").config(); // PHẢI là dòng đầu tiên
console.log(
  "GEMINI_API_KEY loaded:",
  process.env.GEMINI_API_KEY
    ? "Có key (dài " + process.env.GEMINI_API_KEY.length + " ký tự)"
    : "undefined"
);
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("GEMINI_API_KEY =", process.env.GEMINI_API_KEY);
console.log("ALL ENV KEYS:", Object.keys(process.env));
