const {
  getSpecificDepartmentEmployees,
} = require("./specificDepartment.service");
const { getBranchAllEmployees } = require("./branchAllEmployees.service");
const { getBranchLateStatSimple } = require("./branchLateStat.service");
const { getBranchLeaveStatSimple } = require("./branchLeaveStat.service");
const { getBranchKpiStatSimple } = require("./branchKpiStat.service");
const { getBranchEmployeeDetails } = require("./branchEmployeeDetails.service");
const {
  getSpecificEmployeeDetail,
} = require("./branchSpecificEmployee.service");
const { getBranchSummaryReport } = require("./branchSummaryReport.service");

async function handleBranchManager(intent, entities = {}, user) {
  if (intent === "SPECIFIC_DEPARTMENT_EMPLOYEES") {
    try {
      const tenPhong = entities.tenPhong || null;
      const maPhong = entities.maPhong || null;

      const result = await getSpecificDepartmentEmployees(
        user.id,
        tenPhong,
        maPhong
      );

      if (!result) {
        return "Không tìm thấy thông tin chi nhánh của bạn.";
      }

      if (result.needSpecify) {
        return "Vui lòng chỉ rõ tên hoặc mã phòng ban, ví dụ: 'phòng Kỹ thuật' hoặc 'PB0104'";
      }

      if (result.notFound) {
        const search = tenPhong || maPhong;
        return `Không tìm thấy phòng ban "${search}" trong chi nhánh của bạn.`;
      }

      const list = result.employees
        .map((e, i) => `${i + 1}. **${e.ten}** (${e.ma}) - ${e.chucVu}`)
        .join("\n");

      return `
🏢 **Danh sách nhân viên phòng ${result.tenPhong}** (mã: ${result.phongBanId})

Trưởng phòng: **${result.truongPhong}**

${list}

Tổng cộng **${result.total} người**.
      `.trim();
    } catch (err) {
      return "Không thể lấy thông tin phòng ban lúc này.";
    }
  }
  if (intent === "BRANCH_ALL_EMPLOYEES") {
    console.log("✅ Vào khối danh sách toàn chi nhánh");
    try {
      const result = await getBranchAllEmployees(user.id);

      if (!result) {
        return "Không tìm thấy thông tin chi nhánh của bạn.";
      }

      if (result.totalEmployees === 0) {
        return "Chi nhánh của bạn hiện chưa có nhân viên nào.";
      }

      let reply = `
  🏢 **Danh sách tất cả nhân viên chi nhánh của bạn** (mã chi nhánh: ${result.chiNhanhId})

  Tổng cộng **${result.totalEmployees} nhân viên** thuộc **${result.totalDepartments} phòng ban**.

  `;

      result.departments.forEach((dept, i) => {
        const truongPhongText = dept.truongPhong
          ? ` - Trưởng phòng: **${dept.truongPhong}**`
          : " - Chưa có Trưởng phòng";
        reply += `\n**${i + 1}. ${dept.tenPhong}** (mã: ${
          dept.phongBanId
        })${truongPhongText}\n`;

        dept.employees.forEach((e) => {
          reply += `- **${e.ten}** (${e.ma}) - ${e.chucVu}\n`;
        });
      });

      return reply.trim();
    } catch (err) {
      console.error("Lỗi danh sách chi nhánh:", err);
      return "Không thể lấy danh sách chi nhánh lúc này.";
    }
  }

  // Trong handleBranchManager
  if (intent === "BRANCH_LATE_STAT_SIMPLE") {
    const result = await getBranchLateStatSimple(user.id, entities.period);
    if (!result) return "Không thể lấy thống kê đi muộn chi nhánh lúc này.";

    const list = result.departments
      .map((d) => `- **${d.tenPhong}**: ${d.totalLate} lần`)
      .join("\n");

    return `
  ⏰ **Thống kê đi muộn/về sớm toàn chi nhánh** (tháng ${result.period})

  Tổng số lần: **${result.totalLateAll} lần** ( ${result.totalDepartments} phòng ban)

  ${list}
    `.trim();
  }
  if (intent === "BRANCH_LEAVE_STAT_SIMPLE") {
    const result = await getBranchLeaveStatSimple(user.id, entities.period);
    if (!result) return "Không thể lấy thống kê nghỉ phép chi nhánh lúc này.";

    const list = result.departments
      .map(
        (d) =>
          `- **${d.tenPhong}**: ${d.usedDays} ngày phép, ${d.unpaidDays} ngày không phép`
      )
      .join("\n");

    return `
  📅 **Thống kê nghỉ phép toàn chi nhánh** (tháng ${result.period})

  Tổng ngày phép có lương: **${result.totalUsed} ngày**
  Tổng ngày nghỉ không phép: **${result.totalUnpaid} ngày**

  ${list}
    `.trim();
  }
  if (intent === "BRANCH_KPI_STAT_SIMPLE") {
    const result = await getBranchKpiStatSimple(user.id, entities.period);
    if (!result) return "Không thể lấy thống kê KPI chi nhánh lúc này.";

    const list = result.departments
      .map((d) => `- **${d.tenPhong}**: ${d.avgCompletion}%`)
      .join("\n");
    return `
  📊 **Thống kê KPI toàn chi nhánh** (kỳ ${result.period})

  KPI trung bình chi nhánh: **${result.avgAll}%**
  ${list}
    `.trim();
  }
  if (intent === "BRANCH_EMPLOYEE_DETAILS") {
    // Cho phép xem lương (có thể set flag ở DB hoặc hardcode false để an toàn)
    const showSalary = false; // hoặc true nếu công ty cho phép

    const result = await getBranchEmployeeDetails(user.id, showSalary);

    if (!result) {
      return "Không tìm thấy thông tin chi nhánh của bạn.";
    }

    if (result.totalEmployees === 0) {
      return "Chi nhánh của bạn hiện chưa có nhân viên nào.";
    }

    let reply = `
👥 **Thông tin nhân viên toàn chi nhánh của bạn**

Tổng cộng **${result.totalEmployees} nhân viên**.

`;

    if (result.sapHetHanCount > 0) {
      reply += `\n⚠️ **${result.sapHetHanCount} người sắp hết hạn hợp đồng (60 ngày tới):**\n`;
      result.sapHetHan.forEach((e) => {
        reply += `- **${e.ten}** (${e.ma}): hết ${e.hopDongKetThuc}\n`;
      });
      reply += "\n";
    }

    if (showSalary && result.luongCaoNhat && result.luongCaoNhat.luong > 0) {
      reply += `💰 **Lương cao nhất chi nhánh:** ${result.luongCaoNhat.ten} - ${result.luongCaoNhat.luong}\n\n`;
    }

    reply += "**Danh sách chi tiết:**\n";

    result.employees.forEach((e) => {
      reply += `\n**${e.ten}** (${e.ma})\n`;
      reply += `- Phòng: ${e.tenPhong}\n`;
      reply += `- Chức vụ: ${e.chucVu}\n`;
      reply += `- Ngày sinh: ${e.ngaySinh}\n`;
      reply += `- Ngày vào làm: ${e.ngayVaoLam}\n`;
      reply += `- Hợp đồng hết hạn: ${e.hopDongKetThuc}\n`;
      if (showSalary) reply += `- Lương cơ bản: ${e.luongCoBan}\n`;
    });

    return reply.trim();
  }
  if (intent === "SPECIFIC_EMPLOYEE_DETAIL") {
    if (!entities.employeeCode) {
      return "Vui lòng chỉ rõ mã nhân viên, ví dụ: 'Thông tin NV0020'";
    }

    const showSalary = true; // hoặc true nếu cho phép

    const result = await getSpecificEmployeeDetail(
      user.id,
      entities.employeeCode,
      showSalary
    );

    if (!result) {
      return "Không thể lấy thông tin nhân viên lúc này.";
    }

    if (result.notFound) {
      return `Không tìm thấy nhân viên **${entities.employeeCode}** trong chi nhánh của bạn hoặc nhân viên không đang làm việc.`;
    }

    let reply = `
👤 **Thông tin chi tiết nhân viên**

**${result.ten}** (${result.ma})

- Phòng ban: ${result.tenPhong}
- Chức vụ: ${result.chucVu}
- Ngày sinh: ${result.ngaySinh}
- Ngày vào làm: ${result.ngayVaoLam}
- Email: ${result.email}

**Hợp đồng**
- Hết hạn: ${result.hopDongKetThuc}
`;

    if (showSalary) {
      reply += `\n**Lương thang gan nhat**
- Tổng thực nhận: ${result.luongHienTai}`;
    }

    return reply.trim();
  }
  if (intent === "BRANCH_SUMMARY_REPORT") {
    const showSalary = true; // hoặc false nếu không cho phép hiển thị lương

    // LẤY PERIOD TỪ ENTITIES (quan trọng!)
    const period = entities.period || null;

    const result = await getBranchSummaryReport(user.id, period, showSalary);

    if (!result) {
      return "Không thể lấy báo cáo tổng hợp chi nhánh lúc này. Vui lòng thử lại sau.";
    }

    // Tiêu đề báo cáo – hiển thị tháng/kỳ người dùng hỏi
    let title = "BÁO CÁO TỔNG HỢP CHI NHÁNH";
    if (period) {
      if (typeof period === "number") {
        title += ` (tháng ${period})`;
      } else {
        title += ` (kỳ ${period})`;
      }
    } else {
      title += " (tháng hiện tại)";
    }

    let reply = `
📊 **${title}**

Tổng **${result.overview.totalEmployees} nhân viên** thuộc **${result.overview.totalDepartments} phòng ban**.
`;

    // Top KPI – hiển thị đúng kỳ dùng cho KPI
    if (result.topKpi && result.topKpi.length > 0) {
      const kpiTitle = result.kpiPeriod
        ? `kỳ ${result.kpiPeriod}`
        : "kỳ gần nhất";
      reply += `\n🏆 **Top 3 nhân viên KPI cao nhất** (${kpiTitle})\n`;
      result.topKpi.forEach((p, i) => {
        reply += `${i + 1}. **${p.ten}** (${p.ma}) - Phòng ${
          p.tenPhong || "Chưa phân phòng"
        } - ${p.tyLe}%\n`;
      });
      reply += "\n";
    } else {
      reply += `\nℹ️ Chưa có dữ liệu KPI cho kỳ này.\n\n`;
    }

    // Kỷ luật tốt nhất – hiển thị đúng tháng dùng cho kỷ luật
    if (result.bestDiscipline) {
      const disciplineMonth = result.reportMonth
        ? `tháng ${result.reportMonth}`
        : "tháng hiện tại";
      reply += `✅ **Phòng kỷ luật tốt nhất** (ít đi muộn nhất ${disciplineMonth}):\n**${result.bestDiscipline.tenPhong}** - chỉ ${result.bestDiscipline.totalLate} lần\n\n`;
    } else {
      const disciplineMonth = result.reportMonth
        ? `tháng ${result.reportMonth}`
        : "tháng hiện tại";
      reply += `ℹ️ Chưa có dữ liệu đi muộn ${disciplineMonth}.\n\n`;
    }

    // Tổng lương
    if (showSalary && result.totalSalaryAll > 0) {
      reply += `💰 **Tổng lương chi nhánh** (dữ liệu lương mới nhất):\n${result.totalSalaryAll.toLocaleString(
        "vi-VN"
      )} VND\n\n`;
      reply += `**Chi tiết theo phòng**:\n`;
      result.salaryByDepartment.forEach((d) => {
        reply += `- **${d.tenPhong}**: ${Number(d.totalSalary).toLocaleString(
          "vi-VN"
        )} VND\n`;
      });
    } else if (showSalary) {
      reply += `ℹ️ Chưa có dữ liệu lương hoặc không có nhân viên nào được chấm lương.\n`;
    }

    return reply.trim();
  }
  return null;
}

module.exports = { handleBranchManager };
