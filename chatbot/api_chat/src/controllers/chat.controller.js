const { askGemini } = require("../../services/gemini.service");
const { detectCommonIntent } = require("../common/common.intent.detector");
const { handleCommon } = require("../common/common.handler");
const { handleEmployee } = require("../employee/employee.handler");
const { detectEmployeeIntent } = require("../employee/employee.intent.detector");
const { handleDepartmentHead } = require("../departmenthead/dehead.handler");
const { detectDepartmentHeadIntent } = require("../departmenthead/dehead.intent.detector");
const { handleBranchManager } = require("../branchmanager/branch.handler");
const { detectBranchManagerIntent } = require("../branchmanager/branch.intent.detector");
const { detectCeoIntent } = require("../generalmanager/ceo.intent.detector");
const { getHandlerCeo } = require("../generalmanager/ceo.handler");

exports.chat = async (req, res) => {
  try {
    console.log("🔍 Raw req.user:", req.user);
    const user = req.user;
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({ error: "Message is required and must be a string" });
    }
    console.log("✅ User authenticated:", user.id, user.role);
    // 1️⃣ CÂU HỎI CHUNG → AI CŨNG ĐƯỢC
    const commonIntent = detectCommonIntent(message);
    if (commonIntent) {
      const reply = handleCommon(commonIntent.intent);
      if (reply) return res.json({ reply });
    }

    console.log("🔍 Role từ token (với dấu ngoặc): '" + user.role + "'");
    console.log("🔍 Độ dài role:", user.role.length); // Nếu > 8 → có space thừa

    if (user && user.role && user.role.trim() === "nhanvien") {
      const { intent, entities = {} } = detectEmployeeIntent(message);

      // SỬA DÒNG NÀY: dùng "intent" thay vì "employeeIntent.intent"
      console.log("🟢 Employee Intent Detected:", intent);

      const reply = await handleEmployee(intent, entities, req.user);

      if (reply) {
        console.log("🟢 Employee rule-based reply:", reply);
        return res.json({ reply });
      }
    }

    // TRUONG PHONG
    if (user && user.role && user.role.trim() === "truongphong") {
      const { intent, entities = {} } = detectDepartmentHeadIntent(message);
      console.log("🟢 Department Head Intent Detected:", intent);
      const reply = await handleDepartmentHead(intent, entities, req.user);
      if (reply) {
        console.log("🟢 Department Head rule-based reply:", reply);
        return res.json({ reply });
      }
    }
    // GIAM DOC CHI NHANH
    if (user && user.role && user.role.trim() === "giamdoc_cn") {
      console.log(typeof detectBranchManagerIntent);
      console.log(detectBranchManagerIntent);

      const { intent, entities = {} } = detectBranchManagerIntent(message);
      console.log("🟢 Branch Manager Intent Detected:", intent);
      const reply = await handleBranchManager(intent, entities, req.user);
      if (reply) {
        console.log("🟢 Branch Manager rule-based reply:", reply);
        return res.json({ reply });
      }
    }

    // CEO
    if (user && user.role && user.role.trim() === "tonggiamdoc") {
      const { intent, entities = {} } = detectCeoIntent(message);
      console.log("🟢 CEO Intent Detected:", intent);
      const reply = await getHandlerCeo(intent, entities, req.user);
      if (reply) {
        console.log("🟢 CEO rule-based reply:", reply);
        return res.json({ reply });
      }
    }

    // 3️⃣ KHÔNG MATCH HOẶC CÂU HỎI CHUNG → GỌI GEMINI
    const reply = await askGemini({
      message,
      user,
      context: {}, // có thể thêm context chính sách nếu cần
    });

    res.json({ reply });
  } catch (err) {
    // Ghi log chi tiết hơn
    console.error("🚨 CHAT ERROR:");
    console.error("Message:", err.message); // In thông báo lỗi
    console.error("Stack Trace:", err.stack); // 🌟 In ra stack trace (dòng code gây lỗi)

    // Ghi log toàn bộ đối tượng (cũng thường bao gồm message và stack)
    // console.error("Full Error Object:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
