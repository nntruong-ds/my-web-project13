// src/branchmanager/branchEmployeeDetails.service.js
const pool = require("../config/dbb");

async function getBranchEmployeeDetails(userId, showSalary = false) {
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

    // 2. Lấy thông tin nhân viên chi nhánh
    const [rows] = await pool.query(
      `SELECT
        nv.ma_nhan_vien AS ma,
        nv.ho_ten AS ten,
        nv.email AS email,
        nv.ngay_sinh AS ngaySinh,
        nv.ngay_vao_lam AS ngayVaoLam,
        nv.chuc_vu_id AS chucVu,
        pb.ten_phong AS tenPhong,
        hd.ngay_ket_thuc AS hopDongKetThuc
    FROM nhan_vien nv
    LEFT JOIN phong_ban pb ON nv.phong_ban_id = pb.mapb
    LEFT JOIN hop_dong hd ON nv.ma_nhan_vien = hd.ma_nhan_vien
        AND hd.ma_hop_dong = (
        SELECT ma_hop_dong
        FROM hop_dong hd2
        WHERE hd2.ma_nhan_vien = nv.ma_nhan_vien
            AND hd2.trang_thai = 'Còn hiệu lực'
        ORDER BY hd2.ngay_bat_dau DESC
        LIMIT 1
        )
    WHERE nv.chinhanh_id = ?
        AND nv.trang_thai = 'Đang làm'
    ORDER BY pb.ten_phong, nv.chuc_vu_id DESC, nv.ho_ten`,
      [chiNhanhId]
    );

    if (rows.length === 0) {
      return { total: 0, employees: [] };
    }

    const employees = rows.map((r) => ({
      ma: r.ma,
      ten: r.ten,
      email: r.email,
      ngaySinh: r.ngaySinh
        ? new Date(r.ngaySinh).toLocaleDateString("vi-VN")
        : "Chưa cập nhật",
      ngayVaoLam: r.ngayVaoLam
        ? new Date(r.ngayVaoLam).toLocaleDateString("vi-VN")
        : "Chưa cập nhật",
      chucVu: r.chucVu || "Nhân viên",
      tenPhong: r.tenPhong || "Chưa phân phòng",
      hopDongKetThuc: r.hopDongKetThuc
        ? new Date(r.hopDongKetThuc).toLocaleDateString("vi-VN")
        : "Không thời hạn",
      luongCoBan:
        showSalary && r.luongCoBan
          ? Number(r.luongCoBan).toLocaleString("vi-VN") + " VND"
          : showSalary
          ? "Chưa cập nhật"
          : "Không hiển thị",
    }));

    // // Tính thêm thống kê
    // const sapHetHan = employees.filter(e => {
    //   if (e.hopDongKetThuc === "Không thời hạn") return false;
    //   const ketThuc = new Date(e.hopDongKetThuc.split("/").reverse().join("-"));
    //   const today = new Date();
    //   const daysLeft = (ketThuc - today) / (1000 * 60 * 60 * 24);
    //   return daysLeft <= 60 && daysLeft > 0;
    // });
    // Tính nhân viên sắp hết hạn hợp đồng (60 ngày tới) – LOẠI BỎ LẶP
    const sapHetHanRaw = employees.filter((e) => {
      if (e.hopDongKetThuc === "Không thời hạn") return false;
      const [day, month, year] = e.hopDongKetThuc.split("/");
      const ketThuc = new Date(`${year}-${month}-${day}`);
      const today = new Date();
      const daysLeft = Math.floor((ketThuc - today) / (1000 * 60 * 60 * 24));
      return daysLeft <= 60 && daysLeft > 0;
    });

    // LOẠI BỎ NHÂN VIÊN LẶP (dựa trên mã nhân viên)
    const uniqueSapHetHan = Array.from(
      new Map(sapHetHanRaw.map((e) => [e.ma, e])).values()
    );
    const luongCaoNhat = showSalary
      ? employees.reduce(
          (max, e) => {
            const luong = parseInt(e.luongCoBan.replace(/[^0-9]/g, "")) || 0;
            return luong > max.luong
              ? { ten: e.ten, luong: e.luongCoBan }
              : max;
          },
          { luong: 0 }
        )
      : null;

    return {
      chiNhanhId,
      totalEmployees: rows.length,
      sapHetHanCount: uniqueSapHetHan.length, // ← SỬA ĐÚNG
      sapHetHan: uniqueSapHetHan,
      luongCaoNhat,
      showSalary,
      employees,
    };
  } catch (err) {
    console.error("Lỗi lấy thông tin nhân viên chi nhánh:", err);
    return null;
  }
}

module.exports = { getBranchEmployeeDetails };
