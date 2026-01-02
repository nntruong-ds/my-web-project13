const pool = require("../config/dbb");

async function getSpecificDepartmentEmployees(
  userId,
  tenPhong = null,
  maPhong = null
) {
  console.log("🔍 GDCN Service called - userId:", userId);
  console.log("🔍 tenPhong:", tenPhong, "maPhong:", maPhong);

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

    console.log("🔍 User rows (chi nhánh):", userRows);

    if (userRows.length === 0 || !userRows[0].chinhanh_id) {
      console.log("❌ Không tìm thấy user hoặc GDCN chưa có chinhanh_id");
      return null;
    }

    const chiNhanhId = userRows[0].chinhanh_id;
    console.log("✅ Chi nhánh của GDCN:", chiNhanhId);

    let phongBanId = maPhong;
    let tenPhongHienThi = maPhong || "Phòng không xác định";

    // 2. Nếu có tên phòng → tìm mã phòng trong chi nhánh của GDCN
    if (tenPhong && !maPhong) {
      const likeTen = `%${tenPhong}%`;
      console.log(
        "🔍 Tìm phòng với LIKE:",
        likeTen,
        "trong chi nhánh:",
        chiNhanhId
      );

      const [pbRows] = await pool.query(
        `SELECT DISTINCT pb.mapb, pb.ten_phong
         FROM phong_ban pb
         INNER JOIN nhan_vien nv ON pb.mapb = nv.phong_ban_id
         WHERE LOWER(pb.ten_phong) LIKE LOWER(?)
           AND nv.chinhanh_id = ?
           AND nv.trang_thai = 'Đang làm'
         ORDER BY LENGTH(pb.ten_phong) ASC
         LIMIT 1`,
        [likeTen, chiNhanhId]
      );

      console.log("🔍 Kết quả tìm phòng trong chi nhánh:", pbRows);

      if (pbRows.length === 0) {
        console.log(
          "❌ Không tìm thấy phòng nào match tên trong chi nhánh của GDCN"
        );
        return { notFound: true, searchTerm: tenPhong };
      }

      phongBanId = pbRows[0].mapb;
      tenPhongHienThi = pbRows[0].ten_phong;
      console.log(
        "✅ Tìm thấy phòng đúng chi nhánh:",
        tenPhongHienThi,
        "mã:",
        phongBanId
      );
    } else if (maPhong) {
      // Kiểm tra mã phòng có tồn tại trong chi nhánh không
      const [checkRows] = await pool.query(
        `SELECT 1
         FROM nhan_vien
         WHERE phong_ban_id = ?
           AND chinhanh_id = ?
         LIMIT 1`,
        [maPhong, chiNhanhId]
      );

      if (checkRows.length === 0) {
        console.log("❌ Mã phòng không tồn tại trong chi nhánh của GDCN");
        return { notFound: true, searchTerm: maPhong };
      }

      // Lấy tên phòng để hiển thị
      const [pbRows] = await pool.query(
        `SELECT ten_phong FROM phong_ban WHERE mapb = ?`,
        [maPhong]
      );

      tenPhongHienThi = pbRows.length > 0 ? pbRows[0].ten_phong : maPhong;
      console.log("✅ Mã phòng hợp lệ, tên phòng:", tenPhongHienThi);
    }

    if (!phongBanId) {
      console.log("❌ Không có mã phòng để query nhân viên");
      return { needSpecify: true };
    }

    // 3. Lấy danh sách nhân viên phòng đó trong chi nhánh
    const [rows] = await pool.query(
      `SELECT
         nv.ma_nhan_vien AS ma,
         nv.ho_ten AS ten,
         nv.chuc_vu_id AS chucVu
       FROM nhan_vien nv
       WHERE nv.phong_ban_id = ?
         AND nv.chinhanh_id = ?
         AND nv.trang_thai = 'Đang làm'
       ORDER BY nv.chuc_vu_id DESC, nv.ho_ten`,
      [phongBanId, chiNhanhId]
    );

    console.log("🔍 Nhân viên tìm thấy:", rows.length, "người");
    console.log("🔍 Danh sách nhân viên:", rows);

    if (rows.length === 0) {
      console.log(
        "❌ Không có nhân viên nào trong phòng này (dù phòng tồn tại)"
      );
      return { notFound: true, phongBanId };
    }

    // Tìm Trưởng Phòng
    const truongPhong = rows.find((r) => r.chucVu === "TP");

    // Return result hoàn chỉnh
    return {
      tenPhong: tenPhongHienThi,
      phongBanId,
      truongPhong: truongPhong
        ? `${truongPhong.ten} (${truongPhong.ma})`
        : "Chưa có",
      total: rows.length,
      employees: rows.map((r) => ({
        ma: r.ma,
        ten: r.ten,
        chucVu: r.chucVu || "Nhân viên",
      })),
    };
  } catch (err) {
    console.error("💥 Lỗi service GDCN:", err);
    return null;
  }
}

module.exports = { getSpecificDepartmentEmployees };
