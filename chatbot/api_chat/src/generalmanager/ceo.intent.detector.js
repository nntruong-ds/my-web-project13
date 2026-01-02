function detectCeoIntent(message) {
  const msg = message.toLowerCase().trim();

  if (
    msg.includes("báo cáo tổng quan") ||
    msg.includes("tổng quan công ty") ||
    msg.includes("tình hình nhân sự") ||
    msg.includes("bao nhiêu nhân viên") ||
    msg.includes("biến động nhân sự") ||
    msg.includes("tỷ lệ nghỉ việc") ||
    msg.includes("churn rate")
  ) {
    console.log("✅ [CEO INTENT] Bắt được câu hỏi báo cáo tổng quan công ty");
    console.log("📩 Message gốc:", message);

    const match = msg.match(/tháng\s*([0-9]{1,2})|kỳ\s*([0-9]{4}-[0-9]{2})/i);
    const period = match
      ? match[1]
        ? parseInt(match[1], 10)
        : match[2]
      : null;

    console.log("🔍 Period trích được:", period);

    return { intent: "COMPANY_OVERVIEW_REPORT", entities: { period } };
  }
  // Bắt câu hỏi KPI & hiệu suất toàn công ty
  if (
    msg.includes("kpi") ||
    msg.includes("hiệu suất") ||
    msg.includes("top phòng") ||
    msg.includes("phòng nào kpi") ||
    msg.includes("kpi trung bình") ||
    msg.includes("so sánh kpi")
  ) {
    console.log("✅ Bắt được intent COMPANY_KPI_REPORT");

    const match = msg.match(/tháng\s*([0-9]{1,2})|kỳ\s*([0-9]{4}-[0-9]{2})/i);
    const period = match
      ? match[1]
        ? parseInt(match[1], 10)
        : match[2]
      : null;

    return { intent: "COMPANY_KPI_REPORT", entities: { period } };
  }
  // Bắt câu hỏi kỷ luật – đi muộn toàn công ty
  if (
    msg.includes("kỷ luật") ||
    msg.includes("đi muộn") ||
    msg.includes("tuân thủ") ||
    msg.includes("vi phạm") ||
    msg.includes("chấm công")
  ) {
    console.log("✅ Bắt được intent COMPANY_DISCIPLINE_REPORT");

    const match = msg.match(/tháng\s*([0-9]{1,2})/i);
    const period = match ? parseInt(match[1], 10) : null;

    return { intent: "COMPANY_DISCIPLINE_REPORT", entities: { period } };
  }
  // Bắt câu hỏi lương & chi phí nhân sự toàn công ty
  if (
    msg.includes("tổng lương") ||
    msg.includes("quỹ lương") ||
    msg.includes("chi phí nhân sự") ||
    msg.includes("lương công ty") ||
    msg.includes("phòng nào tốn lương") ||
    msg.includes("chi nhánh nào lương cao nhất")
  ) {
    console.log("✅ Bắt được intent COMPANY_SALARY_REPORT");

    const match = msg.match(/tháng\s*([0-9]{1,2})|kỳ\s*([0-9]{4}-[0-9]{2})/i);
    const period = match
      ? match[1]
        ? parseInt(match[1], 10)
        : match[2]
      : null;

    return { intent: "COMPANY_SALARY_REPORT", entities: { period } };
  }
  // Bắt câu hỏi phân tích, xu hướng, so sánh
  if (
    msg.includes("xu hướng") ||
    msg.includes("phân tích") ||
    msg.includes("so sánh") ||
    msg.includes("từ đầu năm") ||
    msg.includes("năm nay") ||
    msg.includes("cả năm")
  ) {
    console.log("✅ Bắt được intent COMPANY_YEARLY_ANALYSIS");
    return { intent: "COMPANY_YEARLY_ANALYSIS", entities: {} };
  }
  return { intent: "UNKNOWN", entities: {} };
}
module.exports = { detectCeoIntent };
