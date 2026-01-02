const { getLeaveRemaining } = require("./employee.service");
const { getSalaryInfo } = require("./salary.service");
const { getLateSelf } = require("./late.service");
const { getContractEndDate } = require("./contract.service");
const { getSameDepartmentEmployees } = require("./department.service");

async function handleEmployee(intent, entities = {}, user) {
  if (!user || !user.id) {
    throw new Error("User is missing in handleEmployee");
  }

  console.log("🔥 handleEmployee called:", intent, user.id);

  // 1. Xử lý nghỉ phép
  if (intent === "LEAVE_SELF") {
    try {
      const days = await getLeaveRemaining(user.id);
      return `📝 Bạn còn **${days} ngày nghỉ phép năm** chưa sử dụng.`;
    } catch (err) {
      console.error("Lỗi lấy ngày phép:", err);
      return "Không thể lấy thông tin nghỉ phép lúc này. Vui lòng thử lại sau.";
    }
  }
  // 2. Xử lý lương (cả 2 intent: cụ thể tháng hoặc tháng hiện tại)
  if (intent === "SALARY_SPECIFIC" || intent === "SALARY_CURRENT") {
    console.log("🔍 Đang xử lý lương, intent:", intent);
    console.log("🔍 Entities nhận được:", entities);
    try {
      let requestedMonth = null;

      if (intent === "SALARY_SPECIFIC") {
        if (!entities.month || entities.month < 1 || entities.month > 12) {
          return "Tháng không hợp lệ. Vui lòng thử lại, ví dụ: 'lương tháng 10'";
        }
        requestedMonth = entities.month;
      }
      // Nếu là SALARY_CURRENT → requestedMonth = null → service tự lấy tháng hiện tại

      const salary = await getSalaryInfo(user.id, requestedMonth);

      if (!salary) {
        const displayMonth = requestedMonth || "này";
        return `Chưa có bảng lương tháng ${displayMonth} của bạn ạ.`;
      }
      // Trả lời bảng lương đẹp
      return `
💰 **Bảng lương tháng ${salary.month}**

Lương cơ bản: **${salary.luongCoBan.toLocaleString("vi-VN")} đ**
Phụ cấp: ${salary.phuCap.toLocaleString("vi-VN")} đ
Thưởng: ${salary.thuong.toLocaleString("vi-VN")} đ
Nợ tháng trước: ${salary.noThangTruoc.toLocaleString("vi-VN")} đ

Khấu trừ:
• BH y tế: ${salary.bhyt.toLocaleString("vi-VN")} đ
• BH xã hội: ${salary.bhxh.toLocaleString("vi-VN")} đ
• Phạt: ${salary.phat.toLocaleString("vi-VN")} đ

🟢 **Tổng thu nhập (gross)**: ${salary.tongGross.toLocaleString("vi-VN")} đ**
      `.trim();
    } catch (err) {
      console.error("Lỗi lấy bảng lương:", err);
      return "Không thể lấy bảng lương lúc này. Vui lòng thử lại sau.";
    }
  }
  //3. Xử lý đi muộn

  // 3. Xử lý đi muộn / về sớm
  if (intent === "LATE_SELF_SPECIFIC" || intent === "LATE_SELF_CURRENT") {
    try {
      let requestedMonth = null;

      if (intent === "LATE_SELF_SPECIFIC") {
        if (!entities.month || entities.month < 1 || entities.month > 12) {
          return "Tháng không hợp lệ. Vui lòng thử lại, ví dụ: 'đi muộn tháng 10'";
        }
        requestedMonth = entities.month;
      }
      // LATE_SELF_CURRENT → requestedMonth = null → service tự lấy tháng hiện tại

      const lateInfo = await getLateSelf(user.id, requestedMonth);

      // Vì service luôn trả về object (không null), nên không cần kiểm tra null nữa
      const displayMonth = requestedMonth || "này";
      const totalTimes = lateInfo.totalLateDays || 0; // an toàn

      if (totalTimes === 0) {
        return `⏰ Tháng ${displayMonth}, bạn chưa đi muộn hoặc về sớm lần nào. Giữ vững nhé! 👍`;
      }

      return `⏰ Tháng ${displayMonth}, bạn đã đi muộn hoặc về sớm **${totalTimes} lần**.`;
    } catch (err) {
      console.error("Lỗi lấy thông tin đi muộn/về sớm:", err);
      return "Không thể lấy thông tin đi muộn/về sớm lúc này. Vui lòng thử lại sau.";
    }
  }
  //4. Xử lý hết hạn hợp đồng
  if (intent === "CONTRACT_END") {
    try {
      const end_date = await getContractEndDate(user.id);
      return `📝 Hợp đồng của bạn sẽ hết hạn vào ngày **${end_date}**.`;
    } catch (err) {
      console.error("Lỗi lấy ngày hết hạn hợp đồng:", err);
      return "Không thể lấy thông tin hợp đồng. Vui lòng thử lại sau.";
    }
  }
  //5 . Xử lý cùng phòng ban
  if (intent === "SAME_DEPARTMENT") {
    try {
      const result = await getSameDepartmentEmployees(user.id);

      if (!result) {
        return "Không thể lấy thông tin phòng ban của bạn lúc này.";
      }

      if (result.employees.length === 0) {
        return `Bạn là người duy nhất trong phòng ban **${result.department}** hiện tại ạ.`;
      }

      // Tạo danh sách đẹp
      const list = result.employees
        .map((emp, index) => `${index + 1}. ${emp.ten} (${emp.ma})`)
        .join("\n");

      return `
  🏢 **Phòng ban của bạn: ${result.department}**

  Các đồng nghiệp cùng phòng:
  ${list}

  Tổng cộng **${result.employees.length} người** (không tính bạn).
      `.trim();
    } catch (err) {
      console.error("Lỗi xử lý SAME_DEPARTMENT:", err);
      return "Không thể lấy danh sách đồng nghiệp lúc này. Vui lòng thử lại sau.";
    }
  }
  if (intent === "ASK_ABOUT_OTHERS") {
    return "Xin lỗi nhé, vì lý do bảo mật thông tin cá nhân, mình chỉ được phép trả lời thông tin của chính bạn thôi. Bạn hỏi về lương, ngày phép, đi muộn... của bản thân thì mình hỗ trợ ngay ạ! 😊";
  }
  return null;
}
module.exports = { handleEmployee };
