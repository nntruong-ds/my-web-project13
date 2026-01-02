function detectCommonIntent(message) {
  const text = message.toLowerCase().trim();

  // 1. Ưu tiên các cụm từ cụ thể hơn trước (LEAVE trước HOLIDAY)
  if (
    text.includes("chính sách nghỉ phép năm") ||
    text.includes("phép thường niên")
  ) {
    return { intent: "POLICY", topic: "LEAVE" };
  }

  // 2. OT - ưu tiên cụm "làm thêm" trước, rồi mới đến "ot" riêng lẻ
  if (text.includes("làm thêm") || text.includes("ot")) {
    return { intent: "POLICY", topic: "OT" };
  }

  // 3. HOLIDAY - chỉ khi có "nghỉ lễ" hoặc "lễ" nhưng không liên quan đến phép
  // Tránh khớp nhầm khi có "phép" + "lễ"
  if (
    text.includes("nghỉ lễ") ||
    (text.includes("lễ") && !text.includes("phép"))
  ) {
    return { intent: "HOLIDAY" };
  }

  return { intent: "GENERAL" };
  //return null;
}

module.exports = { detectCommonIntent };
