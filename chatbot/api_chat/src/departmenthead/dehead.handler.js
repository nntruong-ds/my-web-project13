const { getDepartmentEmployees } = require("./dehead.service");
const { getEmployeePersonalInfo } = require("./employeeInfo.service");
const { getDepartmentLateStat } = require("./departmentLateStat.service");
const { getDepartmentLeaveStat } = require("./departmentLeaveStat.service");
const { getEmployeeContractInfo } = require("./employeeContract.service");
const { getDepartmentMilestones } = require("./departmentMilestone.service");
const { getDepartmentKpiStat } = require("./departmentKpi.service");

async function handleDepartmentHead(intent, entities = {}, user) {
    if (!user || !user.id) {
        throw new Error("User is missing in handleEmployee");
    }

    if (intent === "DEPARTMENT_EMPLOYEES_LIST") {
        console.log("🔥 handleDepartmentHead called:", intent);
        console.log("🔍 User ID:", user.id);
        try {
            const result = await getDepartmentEmployees(user.id);

            if (!result) {
            return "Không tìm thấy thông tin phòng ban của bạn. Vui lòng kiểm tra lại hoặc liên hệ HR.";
            }

            if (result.employees.length === 0) {
            return "Hiện tại phòng ban của bạn chưa có nhân viên nào (hoặc dữ liệu chưa cập nhật).";
            }

            const list = result.employees
            .map((e, i) => `${i + 1}. **${e.ten}** (${e.ma}) - ${e.chucVu}`)
            .join("\n");

            return `
        🏢 **Danh sách nhân viên phòng ban của bạn** (mã phòng: ${result.departmentId})

        ${list}

        **Tổng cộng: ${result.total} người** (bao gồm bạn).
            `.trim();

        } catch (err) {
            console.error("Lỗi xử lý DEPARTMENT_EMPLOYEES_LIST:", err);
            return "Không thể lấy danh sách nhân viên lúc này. Vui lòng thử lại sau.";
        }
    }
    if (intent === "EMPLOYEE_PERSONAL_INFO") {
        console.log("✅ Vào khối EMPLOYEE_PERSONAL_INFO");
        console.log("🔍 Trưởng Phòng ID:", user.id);
        console.log("🔍 Mã nhân viên hỏi:", entities.employeeCode);

        try {
            if (!entities.employeeCode) {
            return "Vui lòng chỉ rõ mã nhân viên, ví dụ: 'email NV0036'";
            }

            const info = await getEmployeePersonalInfo(user.id, entities.employeeCode);

            if (!info) {
            return "Không thể lấy thông tin nhân viên lúc này.";
            }

            if (info.notFound) {
            return `Không tìm thấy nhân viên **${entities.employeeCode}** trong phòng ban của bạn hoặc nhân viên không tồn tại.`;
            }

            return `
        👤 **Thông tin nhân viên ${info.ma}**

        Họ và tên: **${info.ten}**
        Email: ${info.email}
        Ngày vào làm: ${info.ngayVaoLam}
        Ngày sinh: ${info.ngaySinh}
            `.trim();

        } catch (err) {
            console.error("Lỗi EMPLOYEE_PERSONAL_INFO:", err);
            return "Không thể lấy thông tin lúc này.";
        }
    }
    if (intent === "DEPARTMENT_LATE_STAT_SPECIFIC" || intent === "DEPARTMENT_LATE_STAT_CURRENT") {
        console.log("✅ Vào khối thống kê đi muộn phòng ban");
        try {
            let requestedMonth = null;
            if (intent === "DEPARTMENT_LATE_STAT_SPECIFIC") {
            requestedMonth = entities.month;
            }

            const stat = await getDepartmentLateStat(user.id, requestedMonth);

            if (!stat) {
            return "Không tìm thấy thông tin phòng ban của bạn.";
            }

            const displayMonth = requestedMonth || "này";

            if (stat.totalWithViolation === 0) {
            return `🎉 Tuyệt vời! Tháng ${displayMonth}, toàn bộ **${stat.totalEmployees} nhân viên** trong phòng bạn đều chấm công đúng giờ. Không ai đi muộn/về sớm!`;
            }

            const list = stat.employees
            .filter(e => e.soLan > 0)
            .map((e, i) => `${i + 1}. **${e.ten}** (${e.ma}): ${e.soLan} lần`)
            .join("\n");

            return `
        ⏰ **Thống kê đi muộn/về sớm phòng bạn - tháng ${displayMonth}**

        Tổng nhân viên: **${stat.totalEmployees} người**
        Số người có vi phạm: **${stat.totalWithViolation} người**
        Người vi phạm nhiều nhất: **${stat.topLate} lần**

        Danh sách chi tiết:
        ${list}
            `.trim();

        } catch (err) {
            console.error("Lỗi thống kê đi muộn phòng:", err);
            return "Không thể lấy thống kê lúc này. Vui lòng thử lại sau.";
        }
    }
    if (intent === "DEPARTMENT_LEAVE_STAT_SPECIFIC" || intent === "DEPARTMENT_LEAVE_STAT_CURRENT") {
        try {
            let requestedMonth = null;
            if (intent === "DEPARTMENT_LEAVE_STAT_SPECIFIC") {
            requestedMonth = entities.month;
            }

            const stat = await getDepartmentLeaveStat(user.id, requestedMonth);

            if (!stat) {
            return "Không tìm thấy thông tin phòng ban của bạn.";
            }

            const displayMonth = requestedMonth || "này";

            let reply = `
        📅 **Thống kê nghỉ phép phòng bạn - tháng ${displayMonth}**

        Tổng nhân viên: **${stat.totalEmployees} người**
        Tổng ngày phép có lương đã dùng tháng này: **${stat.totalUsed} ngày**
        `;

            if (stat.totalUnpaidEmployees > 0) {
            reply += `Số người nghỉ không phép: **${stat.totalUnpaidEmployees} người**\n`;

            const listUnpaid = stat.employees
                .filter(e => e.unpaidDays > 0)
                .map((e, i) => `${i + 1}. **${e.ten}** (${e.ma}): ${e.unpaidDays} ngày`)
                .join("\n");

            reply += `\n**Danh sách nghỉ không phép:**\n${listUnpaid}`;
            }

            if (stat.totalUsed > 0) {
            const listUsed = stat.employees
                .filter(e => e.usedDays > 0)
                .map((e, i) => `${i + 1}. **${e.ten}** (${e.ma}): ${e.usedDays} ngày`)
                .join("\n");

            reply += `\n\n**Nhân viên đã nghỉ phép có lương tháng này:**\n${listUsed}`;
            }

            // Phần còn lại mỗi người (hiện tại)
            reply += `\n\n**Số ngày phép còn lại của nhân viên (tính đến hiện tại):**`;
            const listRemaining = stat.employees
            .map((e, i) => `${i + 1}. **${e.ten}** (${e.ma}): ${e.remainingDays} ngày`)
            .join("\n");

            reply += `\n${listRemaining}`;

            return reply.trim();

        } catch (err) {
            console.error("Lỗi thống kê nghỉ phép phòng:", err);
            return "Không thể lấy thống kê nghỉ phép lúc này.";
        }
    }
    if (intent === "EMPLOYEE_CONTRACT_INFO" || intent === "DEPARTMENT_CONTRACT_EXPIRING") {
        console.log("✅ Vào khối hợp đồng nhân viên");
        try {
            const employeeCode = entities.employeeCode || null;

            const contracts = await getEmployeeContractInfo(user.id, employeeCode);

            if (!contracts) {
            return "Không tìm thấy thông tin phòng ban của bạn.";
            }

            if (employeeCode && contracts.notFound) {
            return `Không tìm thấy nhân viên **${employeeCode}** trong phòng ban của bạn hoặc không có hợp đồng.`;
            }

            if (!employeeCode && contracts.noExpiring) {
            return "Hiện tại không có nhân viên nào trong phòng bạn sắp hết hạn hợp đồng (trong 60 ngày tới).";
            }

            if (employeeCode) {
            const c = contracts[0];
            return `
        📄 **Thông tin hợp đồng của ${c.ten} (${c.ma})**

        Hợp đồng hết hạn: **${c.endDate}**
            `.trim();
            } else {
            const list = contracts
                .map((c, i) => `${i + 1}. **${c.ten}** (${c.ma}): ${c.endDate}`)
                .join("\n");

            return `
        ⚠️ **Nhân viên trong phòng bạn sắp hết hạn hợp đồng (60 ngày tới):**

        ${list}

        Tổng cộng **${contracts.length} người**.
            `.trim();
            }

        } catch (err) {
            console.error("Lỗi xử lý hợp đồng:", err);
            return "Không thể lấy thông tin hợp đồng lúc này.";
        }
    }
    if (intent === "DEPARTMENT_BIRTHDAY_SPECIFIC" || intent === "DEPARTMENT_BIRTHDAY_CURRENT" || intent === "DEPARTMENT_LONGEST_SERVICE") {
        try {
            let requestedMonth = null;
            let type = "birthday";

            if (intent === "DEPARTMENT_LONGEST_SERVICE") {
            type = "service";
            } else if (intent === "DEPARTMENT_BIRTHDAY_SPECIFIC") {
            requestedMonth = entities.month;
            }

            const result = await getDepartmentMilestones(user.id, type, requestedMonth);

            if (!result) {
            return "Không tìm thấy thông tin phòng ban của bạn.";
            }

            if (result.total === 0) {
            if (type === "birthday") {
                const displayMonth = requestedMonth || "này";
                return `Tháng ${displayMonth}, không có nhân viên nào trong phòng bạn có sinh nhật.`;
            } else {
                return "Phòng bạn hiện chưa có nhân viên nào.";
            }
            }

            if (type === "birthday") {
            const displayMonth = requestedMonth || "này";
            const list = result.employees
                .map((e, i) => `${i + 1}. **${e.ten}** (${e.ma}): ${e.date}`)
                .join("\n");

            return `
        🎂 **Sinh nhật nhân viên phòng bạn - tháng ${displayMonth}**

        ${list}

        Tổng cộng **${result.total} người** có sinh nhật trong tháng.
            `.trim();
            } else {
            const list = result.employees
                .map((e, i) => `${i + 1}. **${e.ten}** (${e.ma}): ${e.date}`)
                .join("\n");

            return `
        👴 **Nhân viên vào làm lâu nhất trong phòng bạn**

        ${list}

        Tổng cộng **${result.total} người** lâu năm nhất.
            `.trim();
            }

        } catch (err) {
            return "Không thể lấy thông tin lúc này.";
        }
    }
    if (intent === "DEPARTMENT_KPI_STAT_SPECIFIC" || intent === "DEPARTMENT_KPI_STAT_CURRENT" || intent === "EMPLOYEE_KPI_DETAIL") {
        console.log("✅ Vào khối KPI phòng ban");
        try {
            let period = entities.period || null;
            const employeeCode = entities.employeeCode || null;

            const stat = await getDepartmentKpiStat(user.id, period, employeeCode);

            if (!stat) {
            return "Không tìm thấy thông tin phòng ban của bạn.";
            }

            if (employeeCode && stat.notFound) {
            return `Không tìm thấy KPI của nhân viên **${employeeCode}** trong kỳ này hoặc nhân viên không thuộc phòng bạn.`;
            }

            if (employeeCode) {
            const list = stat.kpis
                .map(k => `- **${k.tenKpi}**: ${k.thucTe}/${k.mucTieu} ${k.donVi} (${k.tyLe}% - ${k.trangThai})${k.ghiChu ? ' - ' + k.ghiChu : ''}`)
                .join("\n");

            return `
        📊 **KPI của ${employeeCode} - kỳ ${stat.period}**

        ${list}
            `.trim();
            } else {
            const displayPeriod = period || "gần nhất";

            if (stat.totalEmployees === 0) {
                return `Kỳ ${displayPeriod}, phòng bạn chưa có dữ liệu KPI.`;
            }

            const list = stat.employees
                .map((e, i) => `${i + 1}. **${e.ten}** (${e.ma}): ${e.avgCompletion}% trung bình (${e.achieved}/${e.total} chỉ tiêu đạt) - ${e.status}`)
                .join("\n");

            return `
        📊 **Thống kê KPI phòng bạn - kỳ ${displayPeriod}**

        Tổng nhân viên: **${stat.totalEmployees} người**
        Số người đạt toàn bộ chỉ tiêu: **${stat.totalAchieved} người**
        Người đạt cao nhất: **${stat.highestAvg}%**

        Danh sách chi tiết:
        ${list}
            `.trim();
            }

        } catch (err) {
            console.error("Lỗi thống kê KPI phòng:", err);
            return "Không thể lấy thống kê KPI lúc này.";
        }
    }
}
module.exports = { handleDepartmentHead };
