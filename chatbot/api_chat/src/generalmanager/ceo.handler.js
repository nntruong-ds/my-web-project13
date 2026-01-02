const {
  getCompanyOverviewReport,
} = require("../generalmanager/ceoOverviewReport.service");
const { getCompanyKpiReport } = require("./companyKpiReport.service");
const {
  getCompanyDisciplineReport,
} = require("./companyDisciplineReport.service");
const { getCompanySalaryReport } = require("./companySalaryReport.service");
const { getCompanyYearlyAnalysis } = require("./companyYearlyAnalysis.service");
const { askGemini } = require("../../services/gemini.service");
async function getHandlerCeo(intent, entities = {}, user) {
  if (intent === "COMPANY_OVERVIEW_REPORT") {
    console.log("🔍 Xử lý báo cáo tổng quan công ty cho CEO");
    const period = entities.period || null;
    const result = await getCompanyOverviewReport(period);

    if (!result) {
      return "Không thể lấy báo cáo tổng quan công ty lúc này. Vui lòng thử lại sau.";
    }

    // Tiêu đề báo cáo – hiển thị đúng tháng/kỳ
    let periodText = "tháng hiện tại";
    if (result.reportPeriod) {
      const [year, month] = result.reportPeriod.split("-");
      periodText = `tháng ${month}/${year}`;
    }

    // Biến động nhân sự
    let changeText = "không có dữ liệu";
    if (
      result.newEmployees !== undefined &&
      result.leftEmployees !== undefined
    ) {
      const net = result.netChange || 0;
      if (net > 0) {
        changeText = `tăng ròng **${net} người** (mới: ${result.newEmployees}, nghỉ: ${result.leftEmployees})`;
      } else if (net < 0) {
        changeText = `giảm ròng **${Math.abs(net)} người** (mới: ${
          result.newEmployees
        }, nghỉ: ${result.leftEmployees})`;
      } else {
        changeText = `không biến động (mới: ${result.newEmployees}, nghỉ: ${result.leftEmployees})`;
      }
    }

    // So với tháng trước
    let prevChangeText = "không có dữ liệu";
    if (result.changeFromPrev !== undefined) {
      const change = result.changeFromPrev || 0;
      const percent = result.changePercentFromPrev || 0;
      if (change > 0) {
        prevChangeText = `tăng **${change} người** (+${percent}%)`;
      } else if (change < 0) {
        prevChangeText = `giảm **${Math.abs(change)} người** (${percent}%)`;
      } else {
        prevChangeText = "không thay đổi";
      }
    }

    return `
📊 **BÁO CÁO TỔNG QUAN NHÂN SỰ CÔNG TY** (${periodText})

Tổng **${result.totalEmployees || 0} nhân viên**  
Phân bố tại **${result.totalBranches || 0} chi nhánh** và **${
      result.totalDepartments || 0
    } phòng ban**.

**Biến động nhân sự** (${periodText}):
- ${changeText}

**Tỷ lệ nghỉ việc** (churn rate): **${result.churnRate || 0}%**

**So với tháng trước**: ${prevChangeText}
    `.trim();
  }
  if (intent === "COMPANY_KPI_REPORT") {
    const period = entities.period || null;
    const result = await getCompanyKpiReport(period);

    if (!result) {
      return "Không thể lấy báo cáo KPI công ty lúc này. Vui lòng thử lại sau.";
    }

    if (result.noData) {
      return `Chưa có dữ liệu KPI cho kỳ ${result.kpiPeriod || "gần nhất"}.`;
    }

    const periodText = result.kpiPeriod
      ? `kỳ ${result.kpiPeriod}`
      : "kỳ gần nhất";

    let reply = `
📊 **BÁO CÁO KPI & HIỆU SUẤT CÔNG TY** (${periodText})

KPI trung bình toàn công ty: **${result.avgCompany}%**

Tổng **${result.totalDepartments} phòng ban** có dữ liệu KPI.

🏆 **Phòng ban KPI cao nhất**: **${result.topDepartment.displayName}** - ${result.topDepartment.avgKpi}%

📉 **Phòng ban KPI thấp nhất**: **${result.bottomDepartment.displayName}** - ${result.bottomDepartment.avgKpi}%

**Chi tiết theo phòng (chi nhánh)**:
`;

    result.departments.forEach((d) => {
      reply += `- **${d.displayName}**: ${d.avgKpi}%\n`;
    });

    return reply.trim();
  }
  if (intent === "COMPANY_DISCIPLINE_REPORT") {
    const period = entities.period || null;
    const result = await getCompanyDisciplineReport(period);

    if (!result) {
      return "Không thể lấy báo cáo kỷ luật công ty lúc này.";
    }

    if (result.noData) {
      return `Chưa có dữ liệu đi muộn cho tháng ${
        result.reportMonth.split("-")[1]
      }/${result.reportMonth.split("-")[0]}.`;
    }

    const monthText = result.reportMonth
      ? `tháng ${result.reportMonth.split("-")[1]}/${
          result.reportMonth.split("-")[0]
        }`
      : "tháng hiện tại";

    let reply = `
    ⚖️ **BÁO CÁO KỶ LUẬT – ĐI MUỘN TOÀN CÔNG TY** (${monthText})

    Tổng **${result.totalLateAll} lần** đi muộn/về sớm (toàn công ty).

    Phân tích trên **${result.totalDepartments} phòng ban**.

    ✅ **Phòng kỷ luật tốt nhất** (ít đi muộn nhất):
    **${result.bestDepartment.displayName}** - chỉ ${result.bestDepartment.totalLate} lần

    ❌ **Phòng kỷ luật kém nhất** (nhiều đi muộn nhất):
    **${result.worstDepartment.displayName}** - ${result.worstDepartment.totalLate} lần

    **Xu hướng so với tháng trước**: ${result.changeFromPrev}

    **Chi tiết theo phòng (chi nhánh)**:
    `;

    result.departments.forEach((d) => {
      reply += `- **${d.displayName}**: ${d.totalLate} lần\n`;
    });

    return reply.trim();
  }
  if (intent === "COMPANY_SALARY_REPORT") {
    const period = entities.period || null;
    const result = await getCompanySalaryReport(period);

    if (!result) {
      return "Không thể lấy báo cáo lương công ty lúc này.";
    }

    if (result.noData) {
      return `Chưa có dữ liệu lương cho tháng ${
        result.reportPeriod.split("-")[1]
      }/${result.reportPeriod.split("-")[0]}.`;
    }

    const periodText = result.reportPeriod
      ? `tháng ${result.reportPeriod.split("-")[1]}/${
          result.reportPeriod.split("-")[0]
        }`
      : "tháng hiện tại";

    const changeText =
      result.changeFromPrev > 0
        ? `tăng **${Math.abs(result.changeFromPrev).toLocaleString(
            "vi-VN"
          )} VND** (+${result.changePercentFromPrev}%)`
        : result.changeFromPrev < 0
        ? `giảm **${Math.abs(result.changeFromPrev).toLocaleString(
            "vi-VN"
          )} VND** (${result.changePercentFromPrev}%)`
        : "không thay đổi";

    let reply = `
💰 **BÁO CÁO LƯƠNG & CHI PHÍ NHÂN SỰ** (${periodText})

Tổng quỹ lương toàn công ty: **${result.totalSalaryAll.toLocaleString(
      "vi-VN"
    )} VND**

Phân bổ trên **${result.totalDepartments} phòng ban**.

🏆 **Phòng tốn lương nhất**: **${
      result.highestSalaryDepartment.displayName
    }** - ${result.highestSalaryDepartment.totalSalary.toLocaleString(
      "vi-VN"
    )} VND

📉 **Phòng tốn lương ít nhất**: **${
      result.lowestSalaryDepartment.displayName
    }** - ${result.lowestSalaryDepartment.totalSalary.toLocaleString(
      "vi-VN"
    )} VND

**So với tháng trước**: ${changeText}

**Chi tiết theo phòng (chi nhánh)**:
`;

    result.departments.forEach((d) => {
      reply += `- **${d.displayName}**: ${d.totalSalary.toLocaleString(
        "vi-VN"
      )} VND\n`;
    });

    return reply.trim();
  }
  if (intent === "COMPANY_COMPARISON_ANALYSIS") {
    const months = entities.months || 3;
    const result = await getCompanyAnalysis(months);

    if (!result) {
      return "Không thể phân tích so sánh lúc này.";
    }

    let reply = `
🔍 **PHÂN TÍCH & SO SÁNH XU HƯỚNG** (${result.months} tháng gần nhất)

**Xu hướng số lượng nhân viên**:
`;

    result.personnelTrend.forEach((t) => {
      reply += `- Tháng ${t.period}: **${t.count} người**\n`;
    });

    reply += `\n**Xu hướng KPI trung bình**:
`;

    result.kpiTrend.forEach((t) => {
      reply += `- Tháng ${t.period}: **${t.avgKpi}%**\n`;
    });

    if (result.bestBranch) {
      reply += `\n**Chi nhánh hiệu quả nhất** (KPI cao + kỷ luật tốt + chi phí hợp lý):\n**${result.bestBranch.tenChiNhanh}**\n`;
    }

    return reply.trim();
  }
  if (intent === "COMPANY_YEARLY_ANALYSIS") {
    const result = await getCompanyYearlyAnalysis();

    if (!result) {
      return "Không thể phân tích xu hướng năm nay lúc này. Vui lòng thử lại sau.";
    }

    // Tạo prompt chi tiết – BỎ PHẦN QUÝ (vì đã bỏ trong service)
    const dataPrompt = `
Dưới đây là dữ liệu nhân sự công ty từ đầu năm ${
      result.year
    } đến hiện tại (tháng ${result.currentMonth}):

**Số lượng nhân viên theo tháng**:
${result.personnelTrend
  .map((t) => `Tháng ${t.month}: ${t.count} người`)
  .join("\n")}

**KPI trung bình theo tháng**:
${result.kpiTrend.map((t) => `Tháng ${t.month}: ${t.avgKpi}%`).join("\n")}

**Tổng lần đi muộn theo tháng**:
${result.disciplineTrend
  .map((t) => `Tháng ${t.month}: ${t.totalLate} lần`)
  .join("\n")}

Hãy phân tích xu hướng năm nay:
- Nhân sự đang tăng hay giảm? Tốc độ thế nào?
- KPI có cải thiện không? Tháng nào nổi bật?
- Kỷ luật (đi muộn) có tốt lên không?
- Tháng nào hiệu quả nhất?
- Khuyến nghị cho Tổng Giám Đốc (tuyển dụng, đào tạo, kỷ luật, thưởng...)

Trả lời ngắn gọn, chuyên nghiệp, dùng gạch đầu dòng, có khuyến nghị hành động cụ thể.
`;

    // GỌI askGemini ĐÚNG CÚ PHÁP
    const geminiReply = await askGemini({
      message: dataPrompt,
      user: user, // truyền user để buildPrompt thêm role TGD
      context: {},
    });

    // Fallback nếu Gemini lỗi
    if (
      !geminiReply ||
      geminiReply.toLowerCase().includes("lỗi") ||
      geminiReply.toLowerCase().includes("không thể")
    ) {
      return "Xin lỗi, tôi không thể phân tích xu hướng bằng AI lúc này. Vui lòng thử lại sau.";
    }

    return geminiReply.trim();
  }
  // Nếu không match intent nào
  return null;
}
module.exports = { getHandlerCeo };
