// function buildPrompt({ user, message }) {
//   return `
// Bạn là chatbot HR nội bộ của công ty.

// THÔNG TIN NGƯỜI DÙNG:
// - Username: ${user.username}
// - Role: ${user.role}

// NHIỆM VỤ:
// - Trả lời ngắn gọn, lịch sự
// - Dùng tiếng Việt
// - Nếu không có dữ liệu thực tế thì nói rõ là chưa có dữ liệu

// CÂU HỎI CỦA NGƯỜI DÙNG:
// ${message}
// `;
// }

// module.exports = { buildPrompt };


function buildPrompt({ user, message }) {
  const username = user?.username || "người dùng";
  const role = user?.role || "EMPLOYEE";

  return `
Bạn là chatbot HR nội bộ của công ty.

THÔNG TIN NGƯỜI DÙNG:
- Username: ${username}
- Role: ${role}

NHIỆM VỤ:
- Trả lời ngắn gọn, lịch sự
- Dùng tiếng Việt
- Nếu không có dữ liệu thực tế thì nói rõ là chưa có dữ liệu
- Không bịa thông tin nội bộ

CÂU HỎI:
${message}
`;
}

module.exports = { buildPrompt };

// debug
console.log("Exported:", module.exports);
