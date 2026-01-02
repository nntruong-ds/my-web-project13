const pool = require("../config/dbb");

async function getBranchAllEmployees(userId) {
  try {
    const normalizedId = userId.toUpperCase();

    // 1. Lấy chi nhánh của GDCN
    const [userRows] = await pool.query(
      `SELECT chinhanh_id
       FROM nhan_vien
       WHERE ma_nhan_vien = ?
       LIMIT 1`,
      [normalizedId]
    );

    if (userRows.length === 0 || !userRows[0].chinhanh_id) {
      return null;
    }

    const chiNhanhId = userRows[0].chinhanh_id;

    // 2. Lấy tất cả nhân viên trong chi nhánh, join với phòng ban
    const [rows] = await pool.query(
      `SELECT
         nv.ma_nhan_vien AS ma,
         nv.ho_ten AS ten,
         nv.chuc_vu_id AS chucVu,
         pb.mapb AS phongBanId,
         pb.ten_phong AS tenPhong,
         pb.truong_phong_id AS truongPhongMa
       FROM nhan_vien nv
       LEFT JOIN phong_ban pb ON nv.phong_ban_id = pb.mapb
       WHERE nv.chinhanh_id = ?
         AND nv.trang_thai = 'Đang làm'
       ORDER BY pb.ten_phong, nv.chuc_vu_id DESC, nv.ho_ten`,
      [chiNhanhId]
    );

    if (rows.length === 0) {
      return { total: 0, departments: [] };
    }

    // Group theo phòng ban
    const departmentsMap = {};
    rows.forEach((r) => {
      const key = r.phongBanId || "Chưa phân phòng";
      if (!departmentsMap[key]) {
        departmentsMap[key] = {
          phongBanId: r.phongBanId || "Chưa phân phòng",
          tenPhong: r.tenPhong || "Chưa phân phòng",
          truongPhong: null,
          employees: [],
        };
      }

      departmentsMap[key].employees.push({
        ma: r.ma,
        ten: r.ten,
        chucVu: r.chucVu || "Nhân viên",
      });

      // Gán Trưởng Phòng (từ bảng phong_ban hoặc tìm TP trong list)
      if (r.chucVu === "TP" && !departmentsMap[key].truongPhong) {
        departmentsMap[key].truongPhong = `${r.ten} (${r.ma})`;
      }
    });

    const departments = Object.values(departmentsMap);

    return {
      chiNhanhId,
      totalEmployees: rows.length,
      totalDepartments: departments.length,
      departments,
    };
  } catch (err) {
    console.error("Lỗi lấy danh sách chi nhánh:", err);
    return null;
  }
}

module.exports = { getBranchAllEmployees };
