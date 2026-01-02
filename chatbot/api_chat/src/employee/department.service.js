// sameDepartment.service.js hoặc thêm vào employee.service.js
const pool = require("../config/dbb");

async function getSameDepartmentEmployees(userId) {
  console.log("🔍 getSameDepartmentEmployees called với userId:", userId);

  const normalizedUserId = userId.toUpperCase();
  console.log("🔍 UserId chuẩn hóa (UPPER):", normalizedUserId);
  try {
    // Bước 1: Lấy phòng ban của user hiện tại
    const [userRows] = await pool.query(
      `SELECT phong_ban_id
       FROM nhan_vien
       WHERE ma_nhan_vien = ?
       LIMIT 1`,
      [normalizedUserId]
    );

    console.log("🔍 Kết quả query userRows:", userRows);
    console.log("🔍 Số bản ghi tìm thấy cho user:", userRows.length);
    if (userRows.length === 0) {
      console.log(
        "❌ Không tìm thấy nhân viên với ma_nhan_vien =",
        normalizedUserId
      );
      return null;
    }

    if (!userRows[0].phong_ban_id) {
      console.log("❌ Nhân viên tìm thấy nhưng phong_ban_id = NULL");
      return null;
    }
    const departmentId = userRows[0].phong_ban_id;
    console.log("✅ Phòng ban của user:", departmentId);

    // Bước 2: Lấy tất cả nhân viên cùng phòng ban (trừ chính mình)
    // 2. Lấy đồng nghiệp cùng phòng
    const [empRows] = await pool.query(
      `SELECT ma_nhan_vien AS ma, ho_ten AS ten
       FROM nhan_vien
       WHERE phong_ban_id = ?
         AND ma_nhan_vien != ?
       ORDER BY ho_ten`,
      [departmentId, normalizedUserId]
    );
    console.log("🔍 Đồng nghiệp tìm thấy:", empRows.length, "người");
    console.log("🔍 Danh sách đồng nghiệp:", empRows);

    return {
      departmentName: departmentId,
      employees: empRows.map((r) => ({ ma: r.ma, ten: r.ten })),
    };
  } catch (err) {
    console.error("Lỗi lấy danh sách cùng phòng ban:", err);
    return null;
  }
}

module.exports = { getSameDepartmentEmployees };
