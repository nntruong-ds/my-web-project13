function detectEmployeeIntent(message) {
  const msg = message.toLowerCase().trim();

  if (
    msg.includes("ngày phép") &&
    msg.includes("của tôi") &&
    msg.includes("còn lại")
  ) {
    return { intent: "LEAVE_SELF", entities: {} };
  }

  // if (msg.includes("lương tháng này") || (msg.includes("lương") && msg.includes("của tôi"))) {
  //   return { intent: "SALARY_SELF" };
  // }
  /// Xử lý tất cả các câu hỏi về lương (có/không chỉ tháng)
  if (
    msg.includes("lương") &&
    msg.includes("tháng") &&
    msg.includes("của tôi")
  ) {
    // Cố gắng trích xuất số tháng sau từ "tháng"
    const match = msg.match(/tháng\s*([0-9]{1,2})/i);
    const month = match ? parseInt(match[1], 10) : null;

    if (month && month >= 1 && month <= 12) {
      // Có chỉ rõ tháng → lương tháng cụ thể
      return { intent: "SALARY_SPECIFIC", entities: { month } };
    } else {
      // Không chỉ tháng → lương tháng hiện tại
      return { intent: "SALARY_CURRENT", entities: {} };
    }
  }

  if (
    msg.includes("đi muộn") &&
    msg.includes("về sớm") &&
    msg.includes("của tôi")
  ) {
    // Trích tháng nếu có
    const match = msg.match(/tháng\s*([0-9]{1,2})/i);
    const month = match ? parseInt(match[1], 10) : null;

    if (month && month >= 1 && month <= 12) {
      return { intent: "LATE_SELF_SPECIFIC", entities: { month } };
    } else {
      return { intent: "LATE_SELF_CURRENT", entities: {} };
    }
  }

  if (msg.includes("hết hạn hợp đồng")) {
    return { intent: "CONTRACT_END", entities: {} };
  }

  if (msg.includes("cùng phòng ban") || msg.includes("nhân viên cùng phòng")) {
    return { intent: "SAME_DEPARTMENT", entities: {} };
  }
  if (
    msg.includes("của anh") ||
    msg.includes("của chị") ||
    msg.includes("của em") ||
    msg.includes("của bạn") ||
    msg.includes("của sếp") ||
    msg.match(/NV\d{4}/i) || // bắt mã NVxxxx
    msg.match(/(anh|chị|em)[ ]?[A-Z][a-z]+/) // bắt "anh Minh", "chị Lan"
  ) {
    return { intent: "ASK_ABOUT_OTHERS", entities: {} };
  }

  return { intent: "UNKNOWN", entities: {} };
}

module.exports = { detectEmployeeIntent };
