function detectDepartmentHeadIntent(message) {
  const msg = message.toLowerCase().trim();
  // Bắt câu hỏi danh sách nhân viên phòng ban (dành cho Trưởng Phòng)
  if (
    msg.includes("danh sách nhân viên") ||
    msg.includes("nhân viên phòng tôi") ||
    msg.includes("nhân viên dưới quyền") ||
    msg.includes("phòng tôi có những ai") ||
    msg.includes("phòng tôi hiện có") ||
    msg.includes("nhân viên trong phòng") ||
    msg.includes("danh sách phòng tôi") ||
    msg.includes("người trong phòng tôi")
  ) {
    return { intent: "DEPARTMENT_EMPLOYEES_LIST", entities: {} };
  }

  // Bắt câu hỏi thông tin cá nhân nhân viên dưới quyền
  if (
    msg.match(/NV\d{4}/i) &&
    (msg.includes("email") ||
      msg.includes("thông tin") ||
      msg.includes("sinh nhật") ||
      msg.includes("ngày sinh") ||
      msg.includes("ngày vào làm") ||
      msg.includes("vào làm ngày nào"))
  ) {
    const match = msg.match(/NV\d{4}/i);
    const employeeCode = match ? match[0].toUpperCase() : null;

    return { intent: "EMPLOYEE_PERSONAL_INFO", entities: { employeeCode } };
  }
  // Bắt câu hỏi thống kê đi muộn/về sớm phòng ban
  // Bắt thống kê đi muộn/về sớm phòng ban
  if (
    msg.includes("thống kê đi muộn") ||
    msg.includes("đi muộn phòng tôi") ||
    msg.includes("thống kê chấm công") ||
    msg.includes("đi muộn nhiều nhất") ||
    msg.includes("mấy người đi muộn") ||
    msg.includes("ai đi muộn") ||
    msg.includes("danh sách đi muộn") ||
    (msg.includes("về sớm") && msg.includes("phòng tôi"))
  ) {
    const match = msg.match(/tháng\s*([0-9]{1,2})/i);
    const month = match ? parseInt(match[1], 10) : null;

    if (month && month >= 1 && month <= 12) {
      return { intent: "DEPARTMENT_LATE_STAT_SPECIFIC", entities: { month } };
    } else {
      return { intent: "DEPARTMENT_LATE_STAT_CURRENT", entities: {} };
    }
  }
  // Bắt thống kê nghỉ phép phòng ban
  // Bắt thống kê nghỉ phép phòng ban - linh hoạt hơn
  // Bắt thống kê nghỉ phép phòng ban - linh hoạt, bắt rộng
  if (
    msg.includes("nghỉ phép") ||
    msg.includes("ngày phép") ||
    msg.includes("phép năm") ||
    msg.includes("nghỉ không phép") ||
    msg.includes("tổng ngày phép") ||
    msg.includes("ai nghỉ phép") ||
    msg.includes("còn bao nhiêu ngày phép")
  ) {
    // Kích hoạt intent này cho Trưởng Phòng (ngầm hiểu là hỏi cho phòng mình)
    // Không bắt buộc phải có "phòng tôi" để linh hoạt hơn
    const match = msg.match(/tháng\s*([0-9]{1,2})/i);
    const month = match ? parseInt(match[1], 10) : null;

    if (month && month >= 1 && month <= 12) {
      return { intent: "DEPARTMENT_LEAVE_STAT_SPECIFIC", entities: { month } };
    } else {
      return { intent: "DEPARTMENT_LEAVE_STAT_CURRENT", entities: {} };
    }
  }
  // Bắt câu hỏi hợp đồng nhân viên dưới quyền
  if (
    msg.includes("hợp đồng") ||
    msg.includes("hết hạn hợp đồng") ||
    msg.includes("hợp đồng hết hạn") ||
    msg.includes("sắp hết hạn hợp đồng") ||
    msg.includes("hợp đồng hết hạn khi nào")
  ) {
    // Nếu có mã NV cụ thể
    const matchCode = msg.match(/NV\d{4}/i);
    if (matchCode) {
      const employeeCode = matchCode[0].toUpperCase();
      return { intent: "EMPLOYEE_CONTRACT_INFO", entities: { employeeCode } };
    }

    // Nếu hỏi chung cho phòng
    return { intent: "DEPARTMENT_CONTRACT_EXPIRING", entities: {} };
  }
  // Bắt câu hỏi sinh nhật & ngày vào làm phòng ban
  if (
    msg.includes("sinh nhật tháng") ||
    msg.includes("vào làm lâu nhất") ||
    msg.includes("vào làm sớm nhất") ||
    (msg.includes("ngày vào làm") && msg.includes("phòng tôi"))
  ) {
    // Kiểm tra có tháng không (cho sinh nhật)
    const match = msg.match(/tháng\s*([0-9]{1,2})/i);
    const month = match ? parseInt(match[1], 10) : null;

    if (msg.includes("vào làm")) {
      return { intent: "DEPARTMENT_LONGEST_SERVICE", entities: {} };
    } else {
      if (month && month >= 1 && month <= 12) {
        return { intent: "DEPARTMENT_BIRTHDAY_SPECIFIC", entities: { month } };
      } else {
        return { intent: "DEPARTMENT_BIRTHDAY_CURRENT", entities: {} };
      }
    }
  }
  // Bắt câu hỏi KPI phòng ban
  if (
    msg.includes("kpi") ||
    msg.includes("đánh giá") ||
    msg.includes("chỉ tiêu") ||
    msg.includes("hoàn thành kpi") ||
    msg.includes("kpi phòng tôi") ||
    msg.includes("thống kê kpi") ||
    msg.includes("kpi nhân viên")
  ) {
    // Trích kỳ đánh giá nếu có (dạng 2024-10 hoặc tháng 10)
    let period = null;
    const matchYearMonth = msg.match(/([0-9]{4}-[0-9]{2})/);
    const matchMonth = msg.match(/tháng\s*([0-9]{1,2})/i);
    if (matchYearMonth) {
      period = matchYearMonth[1];
    } else if (matchMonth) {
      const currentYear = new Date().getFullYear();
      period = `${currentYear}-${String(matchMonth[1]).padStart(2, "0")}`;
    }

    // Nếu có mã NV cụ thể
    const employeeMatch = msg.match(/NV\d{4}/i);
    if (employeeMatch) {
      const employeeCode = employeeMatch[0].toUpperCase();
      return {
        intent: "EMPLOYEE_KPI_DETAIL",
        entities: { employeeCode, period },
      };
    }

    if (period) {
      return { intent: "DEPARTMENT_KPI_STAT_SPECIFIC", entities: { period } };
    } else {
      return { intent: "DEPARTMENT_KPI_STAT_CURRENT", entities: {} };
    }
  }
  return { intent: "UNKNOWN", entities: {} };
}
module.exports = { detectDepartmentHeadIntent };
