function detectBranchManagerIntent(message) {
  const msg = message.toLowerCase().trim();

  // Bắt câu hỏi về phòng ban cụ thể
  if (
    (msg.includes("phòng") &&
      (msg.includes("nhân viên") ||
        msg.includes("nhân sự") ||
        msg.includes("danh sách") ||
        msg.includes("có những ai") ||
        msg.includes("hiện có") ||
        msg.includes("xem"))) ||
    msg.match(/pb\d{4}/i)
  ) {
    // Trích tên phòng (lấy hết sau "phòng ")
    const nameMatch = msg.match(/phòng\s+(.+)/i);
    const tenPhong = nameMatch ? nameMatch[1].trim() : null;

    // Trích mã phòng
    const codeMatch = msg.match(/pb\d{4}/i);
    const maPhong = codeMatch ? codeMatch[0].toUpperCase() : null;

    return {
      intent: "SPECIFIC_DEPARTMENT_EMPLOYEES",
      entities: { tenPhong, maPhong },
    };
  }
  // Bắt câu hỏi danh sách toàn chi nhánh
  if (
    (msg.includes("danh sách") && msg.includes("chi nhánh")) ||
    msg.includes("tất cả nhân viên chi nhánh") ||
    msg.includes("nhân viên toàn chi nhánh") ||
    msg.includes("toàn chi nhánh") ||
    msg.includes("danh sách nhân viên chi nhánh") ||
    msg.includes("nhân sự chi nhánh") ||
    msg.includes("chi nhánh tôi")
  ) {
    console.log("✅ Bắt được intent BRANCH_ALL_EMPLOYEES");
    return { intent: "BRANCH_ALL_EMPLOYEES", entities: {} };
  }

  // Bắt thống kê đi muộn, nghỉ phép, KPI toàn chi nhánh (tổng hợp theo phòng)
  if (
    msg.includes("thống kê") &&
    msg.includes("chi nhánh") &&
    (msg.includes("đi muộn") ||
      msg.includes("nghỉ phép") ||
      msg.includes("kpi") ||
      msg.includes("hiệu suất"))
  ) {
    console.log("✅ Bắt được intent thống kê chi nhánh");

    // // Trích kỳ/tháng nếu có
    // const match = msg.match(/tháng\s*([0-9]{1,2})|kỳ\s*([0-9]{4}-[0-9]{2})/i);

    // let period = null;

    // if (match) {
    //   if (match[1]) {
    //     // Trường hợp "tháng 10" → lấy số tháng
    //     period = parseInt(match[1], 10); // → 10 (number)
    //   } else if (match[2]) {
    //     // Trường hợp "kỳ 2025-10" → chỉ lấy phần tháng
    //     const monthPart = match[2].split('-')[1];
    //     period = parseInt(monthPart, 10); // → 10 (number)
    //   }
    // }
    // Trích kỳ/tháng nếu có
    const match = msg.match(/tháng\s*([0-9]{1,2})|kỳ\s*([0-9]{4}-[0-9]{2})/i);

    let period = null;

    if (match) {
      if (match[1]) {
        // "tháng 10" hoặc "tháng 3" → chỉ lấy số tháng (number)
        period = parseInt(match[1], 10); // → 10, 3, 12...
      } else if (match[2]) {
        // "kỳ 2025-10" hoặc "kỳ 2024-12" → lấy nguyên kỳ (string)
        period = match[2]; // → "2025-10", "2024-12"
      }
    }
    if (msg.includes("đi muộn")) {
      return { intent: "BRANCH_LATE_STAT_SIMPLE", entities: { period } };
    } else if (msg.includes("nghỉ phép")) {
      return { intent: "BRANCH_LEAVE_STAT_SIMPLE", entities: { period } };
    } else if (msg.includes("kpi")) {
      return { intent: "BRANCH_KPI_STAT_SIMPLE", entities: { period } };
    }
  }
  // Bắt câu hỏi thông tin cá nhân, hợp đồng, lương chi nhánh
  if (
    msg.includes("chi nhánh") &&
    (msg.includes("thông tin cá nhân") ||
      msg.includes("thông tin nhân viên") ||
      msg.includes("hợp đồng") ||
      msg.includes("lương") ||
      msg.includes("danh sách nhân viên") ||
      msg.includes("nhân sự chi nhánh"))
  ) {
    console.log("✅ Bắt được intent BRANCH_EMPLOYEE_DETAILS");
    return { intent: "BRANCH_EMPLOYEE_DETAILS", entities: {} };
  }

  // Bắt câu hỏi thông tin chi tiết 1 nhân viên cụ thể
  if (
    msg.includes("thông tin") &&
    (msg.includes("nhân viên") || msg.includes("của") || msg.includes("NV")) &&
    msg.match(/NV\d{4}/i)
  ) {
    // Trích mã nhân viên nếu có
    const codeMatch = msg.match(/NV\d{4}/i);
    const employeeCode = codeMatch ? codeMatch[0].toUpperCase() : null;

    // // Trích tên nhân viên (nếu có)
    // const nameMatch = msg.match(/(?:nhân viên|của)\s+([a-zA-ZÀ-ỹ\s]+)/i);
    // const employeeName = nameMatch ? nameMatch[1].trim() : null;

    return {
      intent: "SPECIFIC_EMPLOYEE_DETAIL",
      entities: { employeeCode },
    };
  }
  if (
    msg.includes("báo cáo tổng hợp") ||
    msg.includes("tổng hợp chi nhánh") ||
    msg.includes("báo cáo chi nhánh") ||
    msg.includes("tổng quan chi nhánh") ||
    msg.includes("tổng lương chi nhánh") ||
    msg.includes("kpi chi nhánh") ||
    msg.includes("kỷ luật chi nhánh")
  ) {
    console.log("✅ Bắt được intent BRANCH_SUMMARY_REPORT");

    const match = msg.match(/(tháng\s*(\d{1,2}))|(kỳ\s*(\d{4}-\d{2}))/i);

    let period = null;

    if (match) {
      if (match[2]) {
        const month = parseInt(match[2], 10);
        if (month >= 1 && month <= 12) period = month;
      } else if (match[4]) {
        period = match[4];
      }
    }

    return {
      intent: "BRANCH_SUMMARY_REPORT",
      entities: { period },
    };
  }

  // Các intent khác (phòng cụ thể, danh sách toàn chi nhánh...) giữ nguyên
  return { intent: "UNKNOWN", entities: {} };
}
module.exports = { detectBranchManagerIntent };
