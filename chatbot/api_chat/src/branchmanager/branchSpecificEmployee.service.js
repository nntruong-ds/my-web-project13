const pool = require("../config/dbb");
async function getSpecificEmployeeDetail(
  userId,
  employeeCode,
  showSalary = false
) {
  try {
    const normalizedId = userId.toUpperCase();

    // Lấy chi nhánh GDCN
    const [userRows] = await pool.query(
      `SELECT chinhanh_id FROM nhan_vien WHERE ma_nhan_vien = ? LIMIT 1`,
      [normalizedId]
    );

    if (userRows.length === 0 || !userRows[0].chinhanh_id) return null;

    const chiNhanhId = userRows[0].chinhanh_id;

    // Lấy thông tin nhân viên theo mã + chi nhánh
    const [rows] = await pool.query(
      `SELECT
         nv.ma_nhan_vien AS ma,
         nv.ho_ten AS ten,
         nv.email AS email,
         nv.ngay_sinh AS ngaySinh,
         nv.ngay_vao_lam AS ngayVaoLam,
         nv.chuc_vu_id AS chucVu,
         pb.ten_phong AS tenPhong,
         hd_latest.ngay_ket_thuc AS hopDongKetThuc,
         luong_latest.tong_luong AS luongHienTai
       FROM nhan_vien nv
       LEFT JOIN phong_ban pb ON nv.phong_ban_id = pb.mapb
       LEFT JOIN (
         SELECT ma_nhan_vien, ngay_ket_thuc
         FROM hop_dong
         WHERE trang_thai = 'Còn hiệu lực'
         GROUP BY ma_nhan_vien
         HAVING MAX(ngay_bat_dau)
       ) hd_latest ON nv.ma_nhan_vien = hd_latest.ma_nhan_vien
       LEFT JOIN (
         SELECT ma_nhan_vien, tong_luong
         FROM luong l1
         WHERE (nam, thang) = (
           SELECT nam, thang
           FROM luong l2
           WHERE l2.ma_nhan_vien = l1.ma_nhan_vien
           ORDER BY nam DESC, thang DESC
           LIMIT 1
         )
       ) luong_latest ON nv.ma_nhan_vien = luong_latest.ma_nhan_vien
       WHERE nv.ma_nhan_vien = ?
         AND nv.chinhanh_id = ?
         AND nv.trang_thai = 'Đang làm'
       LIMIT 1`,
      [employeeCode, chiNhanhId]
    );

    if (rows.length === 0) {
      return { notFound: true };
    }

    const e = rows[0];

    const hopDongKetThuc = e.hopDongKetThuc
      ? new Date(e.hopDongKetThuc).toLocaleDateString("vi-VN")
      : "Không thời hạn";
    const daysLeft = e.hopDongKetThuc
      ? Math.floor(
          (new Date(e.hopDongKetThuc) - new Date()) / (1000 * 60 * 60 * 24)
        )
      : null;

    return {
      ma: e.ma,
      ten: e.ten,
      email: e.email || "Chưa cập nhật",
      ngaySinh: e.ngaySinh
        ? new Date(e.ngaySinh).toLocaleDateString("vi-VN")
        : "Chưa cập nhật",
      ngayVaoLam: e.ngayVaoLam
        ? new Date(e.ngayVaoLam).toLocaleDateString("vi-VN")
        : "Chưa cập nhật",
      chucVu: e.chucVu || "Nhân viên",
      tenPhong: e.tenPhong || "Chưa phân phòng",
      hopDongKetThuc,
      daysLeft,
      luongHienTai:
        showSalary && e.luongHienTai
          ? Number(e.luongHienTai).toLocaleString("vi-VN") + " VND"
          : showSalary
          ? "Chưa cập nhật"
          : "Không hiển thị",
    };
  } catch (err) {
    console.error("Lỗi lấy thông tin nhân viên cụ thể:", err);
    return null;
  }
}
module.exports = { getSpecificEmployeeDetail };
