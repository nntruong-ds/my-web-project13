-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost
-- Thời gian đã tạo: Th10 09, 2025 lúc 08:27 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `myweb`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bao_hiem_xa_hoi`
--

CREATE TABLE `bao_hiem_xa_hoi` (
  `ma_nhan_vien` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_so_bhxh` varchar(50) NOT NULL,
  `ngay_bat_dau` date DEFAULT NULL,
  `trang_thai` enum('hoat_dong','tam_ngung') DEFAULT 'hoat_dong'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bao_hiem_y_te`
--

CREATE TABLE `bao_hiem_y_te` (
  `ma_nhan_vien` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_the_bhyt` varchar(50) NOT NULL,
  `ngay_cap` date DEFAULT NULL,
  `ngay_het_han` date DEFAULT NULL,
  `trang_thai` enum('hoat_dong','het_han') DEFAULT 'hoat_dong'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `cham_cong`
--

CREATE TABLE `cham_cong` (
  `ma_nhan_vien` varchar(20) NOT NULL,
  `ngay` date DEFAULT NULL,
  `gio_vao` time DEFAULT NULL,
  `gio_ra` time DEFAULT NULL,
  `so_gio_lam` decimal(4,2) DEFAULT NULL,
  `trang_thai` enum('Đi làm','Nghỉ phép','Nghỉ không phép','Làm thêm') DEFAULT 'Đi làm',
  `ghi_chu` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chi_nhanh`
--

CREATE TABLE `chi_nhanh` (
  `ma_chi_nhanh` int(11) NOT NULL,
  `ten_chi_nhanh` varchar(100) NOT NULL,
  `dia_chi` varchar(255) DEFAULT NULL,
  `so_dien_thoai` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `ID_gdoc` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_thanh_lap` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `chi_nhanh`
--

INSERT INTO `chi_nhanh` (`ma_chi_nhanh`, `ten_chi_nhanh`, `dia_chi`, `so_dien_thoai`, `email`, `ID_gdoc`, `ngay_thanh_lap`) VALUES
(1, 'CN Hà Nội', 'Số 123 Đường Giải Phóng, Quận Đống Đa, Hà Nội', '02473001234', 'hanoi@congty.vn', 'NV0002', '2013-07-08'),
(2, 'CN Đà Nẵng', 'Số 456 Đường Lê Duẩn, Quận Hải Châu, Đà Nẵng', '02363845678', 'danang@congty.vn', 'NV0003', '2013-05-30'),
(3, 'CN TP. Hồ Chí Minh', 'Số 789 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh', '02838234567', 'hcm@congty.vn', 'NV0004', '2014-03-22');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chuc_vu`
--

CREATE TABLE `chuc_vu` (
  `chucvu_id` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ten_chuc_vu` varchar(100) NOT NULL,
  `luong_co_ban` decimal(15,2) DEFAULT 0.00,
  `he_so_luong` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `chuc_vu`
--

INSERT INTO `chuc_vu` (`chucvu_id`, `ten_chuc_vu`, `luong_co_ban`, `he_so_luong`) VALUES
('GDCN', 'Giám đốc Chi nhánh', 30000000.00, 7),
('NV', 'Nhân viên', 8000000.00, 2),
('TGD', 'Tổng Giám đốc', 50000000.00, 10),
('TP', 'Trưởng phòng', 18000000.00, 4);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hop_dong`
--

CREATE TABLE `hop_dong` (
  `ma_hop_dong` varchar(20) DEFAULT NULL,
  `ma_nhan_vien` varchar(20) NOT NULL,
  `loai_hop_dong` varchar(100) DEFAULT NULL,
  `ngay_bat_dau` date DEFAULT NULL,
  `ngay_ket_thuc` date DEFAULT NULL,
  `muc_luong` decimal(15,2) DEFAULT NULL,
  `noi_dung` text DEFAULT NULL,
  `trang_thai` enum('Còn hiệu lực','Hết hạn','Chấm dứt') DEFAULT 'Còn hiệu lực'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `khen_thuong_ky_luat`
--

CREATE TABLE `khen_thuong_ky_luat` (
  `ma_nhan_vien` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `loai` enum('Khen thưởng','Kỷ luật') NOT NULL,
  `ngay` date NOT NULL,
  `hinh_thuc` varchar(100) DEFAULT NULL,
  `ly_do` text DEFAULT NULL,
  `so_tien` decimal(15,2) DEFAULT NULL,
  `ghi_chu` varchar(255) DEFAULT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ngay_cap_nhat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `kpi_nhan_vien`
--

CREATE TABLE `kpi_nhan_vien` (
  `ma_nhan_vien` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ten_kpi` varchar(150) NOT NULL,
  `muc_tieu` decimal(10,2) DEFAULT NULL,
  `thuc_te` decimal(10,2) DEFAULT NULL,
  `don_vi_tinh` varchar(50) DEFAULT NULL,
  `ty_le_hoan_thanh` decimal(5,2) GENERATED ALWAYS AS (case when `muc_tieu` > 0 then `thuc_te` / `muc_tieu` * 100 else NULL end) STORED,
  `ky_danh_gia` varchar(50) DEFAULT NULL,
  `ghi_chu` text DEFAULT NULL,
  `trang_thai` enum('dat','khong_dat','dang_danh_gia') DEFAULT 'dang_danh_gia'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `luong`
--

CREATE TABLE `luong` (
  `ma_luong` varchar(20) DEFAULT NULL,
  `ma_nhan_vien` varchar(20) NOT NULL,
  `thang` int(11) DEFAULT NULL,
  `nam` int(11) DEFAULT NULL,
  `luong_co_ban` decimal(15,2) DEFAULT NULL,
  `phu_cap` decimal(15,2) DEFAULT NULL,
  `thuong` decimal(15,2) DEFAULT NULL,
  `khau_tru` decimal(15,2) DEFAULT NULL,
  `tong_luong` decimal(15,2) DEFAULT NULL,
  `ghi_chu` varchar(255) DEFAULT NULL,
  `he_so_luong` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhan_vien`
--

CREATE TABLE `nhan_vien` (
  `ma_nhan_vien` varchar(20) NOT NULL,
  `ho_ten` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phong_ban_id` varchar(20) DEFAULT NULL,
  `chuc_vu_id` varchar(11) NOT NULL,
  `ngay_vao_lam` date DEFAULT NULL,
  `trang_thai` enum('Đang làm','Nghỉ phép','Đã nghỉ') DEFAULT 'Đang làm',
  `chinhanh_id` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nhan_vien`
--

INSERT INTO `nhan_vien` (`ma_nhan_vien`, `ho_ten`, `email`, `phong_ban_id`, `chuc_vu_id`, `ngay_vao_lam`, `trang_thai`, `chinhanh_id`) VALUES
('NV0001', 'Nguyen Ngoc Truong', 'tonggiamdoc@congty.vn', NULL, 'TGD', '2010-01-01', 'Đang làm', 1),
('NV0002', 'Trần Thị Lan', 'gd.hanoi@congty.vn', NULL, 'GDCN', '2012-06-15', 'Đang làm', 1),
('NV0003', 'Lê Văn Minh', 'gd.danang@congty.vn', NULL, 'GDCN', '2012-06-15', 'Đang làm', 2),
('NV0004', 'Phạm Quốc Huy', 'gd.hcm@congty.vn', NULL, 'GDCN', '2012-06-15', 'Đang làm', 3),
('NV0005', 'Minh Mai Bảo Hoàng', 'hoàng69@cn1.vn', 'PB0101', 'TP', '2021-07-06', 'Đang làm', 1),
('NV0006', 'Quý cô Nhật Bùi', 'bùi160@cn1.vn', 'PB0102', 'TP', '2018-07-07', 'Đang làm', 1),
('NV0007', 'Quý ông Nhiên Nguyễn', 'nguyễn277@cn1.vn', 'PB0103', 'TP', '2023-07-25', 'Đang làm', 1),
('NV0008', 'Bảo Nguyễn', 'nguyễn414@cn1.vn', 'PB0104', 'TP', '2018-03-31', 'Đang làm', 1),
('NV0009', 'Quý cô Hương Đặng', 'đặng457@cn1.vn', 'PB0105', 'TP', '2023-08-01', 'Đang làm', 1),
('NV0010', 'Hương Trần', 'trần817@cn2.vn', 'PB0201', 'TP', '2022-10-20', 'Đang làm', 2),
('NV0011', 'An Hoàng', 'hoàng480@cn2.vn', 'PB0202', 'TP', '2021-09-27', 'Đang làm', 2),
('NV0012', 'Tú Phạm', 'phạm335@cn2.vn', 'PB0203', 'TP', '2020-11-11', 'Đang làm', 2),
('NV0013', 'Lâm Đặng', 'đặng337@cn2.vn', 'PB0204', 'TP', '2019-03-25', 'Đang làm', 2),
('NV0014', 'Châu Lê', 'lê756@cn2.vn', 'PB0205', 'TP', '2020-02-11', 'Đang làm', 2),
('NV0015', 'Thành Trí Nguyễn', 'nguyễn704@cn3.vn', 'PB0301', 'TP', '2020-11-03', 'Đang làm', 3),
('NV0016', 'Hà Phú Đặng', 'đặng196@cn3.vn', 'PB0302', 'TP', '2023-08-28', 'Đang làm', 3),
('NV0017', 'Vi Hoàng', 'hoàng650@cn3.vn', 'PB0303', 'TP', '2018-05-23', 'Đang làm', 3),
('NV0018', 'Nam Phú Dương', 'dương937@cn3.vn', 'PB0304', 'TP', '2021-06-04', 'Đang làm', 3),
('NV0019', 'Linh Trần', 'trần742@cn3.vn', 'PB0305', 'TP', '2022-12-21', 'Đang làm', 3),
('NV0020', 'Cô Lan Dương', 'dương9626@cn1.vn', 'PB0101', 'NV', '2025-06-18', 'Đang làm', 1),
('NV0021', 'Thành Quang Hoàng', 'hoàng8682@cn1.vn', 'PB0101', 'NV', '2023-07-16', 'Đang làm', 1),
('NV0022', 'Nhiên Mai Bảo Vũ', 'vũ6710@cn1.vn', 'PB0101', 'NV', '2023-07-18', 'Đang làm', 1),
('NV0023', 'An Nguyễn', 'nguyễn4085@cn1.vn', 'PB0101', 'NV', '2023-05-19', 'Đang làm', 1),
('NV0024', 'Hà Lê', 'lê9957@cn1.vn', 'PB0101', 'NV', '2021-03-28', 'Đang làm', 1),
('NV0025', 'Ánh Nguyễn', 'nguyễn2649@cn1.vn', 'PB0101', 'NV', '2023-08-29', 'Đang làm', 1),
('NV0026', 'Nhật Trí Đặng', 'đặng2464@cn1.vn', 'PB0101', 'NV', '2022-05-28', 'Đang làm', 1),
('NV0027', 'Anh Tú Hoàng', 'hoàng9173@cn1.vn', 'PB0101', 'NV', '2023-08-10', 'Đang làm', 1),
('NV0028', 'Trọng Bùi', 'bùi367@cn1.vn', 'PB0101', 'NV', '2021-04-29', 'Đang làm', 1),
('NV0029', 'Anh Bảo Phạm', 'phạm1338@cn1.vn', 'PB0101', 'NV', '2023-07-23', 'Đang làm', 1),
('NV0030', 'Cô Ngọc Đặng', 'đặng9573@cn1.vn', 'PB0101', 'NV', '2025-01-22', 'Đang làm', 1),
('NV0031', 'Bà Yến Vũ', 'vũ7350@cn1.vn', 'PB0101', 'NV', '2024-12-25', 'Đang làm', 1),
('NV0032', 'Nhật Mai', 'mai4186@cn1.vn', 'PB0101', 'NV', '2024-03-18', 'Đang làm', 1),
('NV0033', 'Cô Lâm Bùi', 'bùi7725@cn1.vn', 'PB0101', 'NV', '2023-03-06', 'Đang làm', 1),
('NV0034', 'Quý cô Bảo Dương', 'dương4682@cn1.vn', 'PB0101', 'NV', '2025-01-22', 'Đang làm', 1),
('NV0035', 'Ông Minh Trần', 'trần6309@cn1.vn', 'PB0101', 'NV', '2024-01-15', 'Đang làm', 1),
('NV0036', 'Hải Trần', 'trần4504@cn1.vn', 'PB0101', 'NV', '2022-05-30', 'Đang làm', 1),
('NV0037', 'Quang Mai', 'mai7112@cn1.vn', 'PB0101', 'NV', '2023-07-14', 'Đang làm', 1),
('NV0038', 'Quang Dương', 'dương3247@cn1.vn', 'PB0101', 'NV', '2022-11-07', 'Đang làm', 1),
('NV0039', 'Quý ông Khoa Nguyễn', 'nguyễn9728@cn1.vn', 'PB0102', 'NV', '2024-09-15', 'Đang làm', 1),
('NV0040', 'Hoàng Thế Vũ', 'vũ2550@cn1.vn', 'PB0102', 'NV', '2022-01-02', 'Đang làm', 1),
('NV0041', 'Khoa Dương', 'dương8463@cn1.vn', 'PB0102', 'NV', '2025-05-17', 'Đang làm', 1),
('NV0042', 'Quý cô Vi Phạm', 'phạm3187@cn1.vn', 'PB0102', 'NV', '2025-04-26', 'Đang làm', 1),
('NV0043', 'Cô Nhật Lê', 'lê5707@cn1.vn', 'PB0102', 'NV', '2022-10-02', 'Đang làm', 1),
('NV0044', 'Dũng Hoàng', 'hoàng3772@cn1.vn', 'PB0102', 'NV', '2025-04-20', 'Đang làm', 1),
('NV0045', 'Dũng Vũ', 'vũ8523@cn1.vn', 'PB0102', 'NV', '2025-03-26', 'Đang làm', 1),
('NV0046', 'Anh Văn Vũ', 'vũ6721@cn1.vn', 'PB0102', 'NV', '2022-04-21', 'Đang làm', 1),
('NV0047', 'Quý cô Hải Trần', 'trần350@cn1.vn', 'PB0102', 'NV', '2021-11-07', 'Đang làm', 1),
('NV0048', 'Chị Chi Mai', 'mai7065@cn1.vn', 'PB0102', 'NV', '2024-10-11', 'Đang làm', 1),
('NV0049', 'Hoàng Thị Trần', 'trần1770@cn1.vn', 'PB0102', 'NV', '2022-05-09', 'Đang làm', 1),
('NV0050', 'Ánh Nguyễn', 'nguyễn2686@cn1.vn', 'PB0102', 'NV', '2025-01-22', 'Đang làm', 1),
('NV0051', 'Nhật Phạm', 'phạm9165@cn1.vn', 'PB0102', 'NV', '2021-09-18', 'Đang làm', 1),
('NV0052', 'Thành Đức Dương', 'dương6466@cn1.vn', 'PB0102', 'NV', '2023-04-24', 'Đang làm', 1),
('NV0053', 'Huy Phạm', 'phạm3282@cn1.vn', 'PB0102', 'NV', '2023-05-16', 'Đang làm', 1),
('NV0054', 'Huy Tấn Đặng', 'đặng6928@cn1.vn', 'PB0102', 'NV', '2021-11-04', 'Đang làm', 1),
('NV0055', 'Chị Lâm Dương', 'dương5155@cn1.vn', 'PB0102', 'NV', '2024-10-03', 'Đang làm', 1),
('NV0056', 'Anh Đức Trần', 'trần8781@cn1.vn', 'PB0102', 'NV', '2025-04-28', 'Đang làm', 1),
('NV0057', 'Lâm Văn Phạm', 'phạm9580@cn1.vn', 'PB0102', 'NV', '2023-11-03', 'Đang làm', 1),
('NV0058', 'Chị Mai Nguyễn', 'nguyễn5586@cn1.vn', 'PB0103', 'NV', '2024-10-11', 'Đang làm', 1),
('NV0059', 'Nam Bảo Vũ', 'vũ5142@cn1.vn', 'PB0103', 'NV', '2023-07-13', 'Đang làm', 1),
('NV0060', 'Cô Lâm Hoàng', 'hoàng9729@cn1.vn', 'PB0103', 'NV', '2025-11-03', 'Đang làm', 1),
('NV0061', 'Yến Đặng', 'đặng7364@cn1.vn', 'PB0103', 'NV', '2025-05-03', 'Đang làm', 1),
('NV0062', 'Tùng Vũ', 'vũ2889@cn1.vn', 'PB0103', 'NV', '2024-07-15', 'Đang làm', 1),
('NV0063', 'Nhiên Trần', 'trần3141@cn1.vn', 'PB0103', 'NV', '2022-12-06', 'Đang làm', 1),
('NV0064', 'Nhật Lê', 'lê6747@cn1.vn', 'PB0103', 'NV', '2021-03-25', 'Đang làm', 1),
('NV0065', 'Quý cô Thảo Mai', 'mai4738@cn1.vn', 'PB0103', 'NV', '2024-07-12', 'Đang làm', 1),
('NV0066', 'Bà Hương Mai', 'mai4268@cn1.vn', 'PB0103', 'NV', '2023-06-05', 'Đang làm', 1),
('NV0067', 'Anh Trọng Mai', 'mai1277@cn1.vn', 'PB0103', 'NV', '2023-09-06', 'Đang làm', 1),
('NV0068', 'Thành Hải Phạm', 'phạm4756@cn1.vn', 'PB0103', 'NV', '2022-01-26', 'Đang làm', 1),
('NV0069', 'Yến Dương', 'dương2061@cn1.vn', 'PB0103', 'NV', '2023-12-13', 'Đang làm', 1),
('NV0070', 'Phương Văn Vũ', 'vũ2093@cn1.vn', 'PB0103', 'NV', '2025-10-05', 'Đang làm', 1),
('NV0071', 'Lâm Trần', 'trần4000@cn1.vn', 'PB0103', 'NV', '2025-09-11', 'Đang làm', 1),
('NV0072', 'Dũng Nguyễn', 'nguyễn9315@cn1.vn', 'PB0103', 'NV', '2022-05-23', 'Đang làm', 1),
('NV0073', 'Nhật Nguyễn', 'nguyễn445@cn1.vn', 'PB0103', 'NV', '2021-01-16', 'Đang làm', 1),
('NV0074', 'An Mai Dương', 'dương5307@cn1.vn', 'PB0103', 'NV', '2022-10-30', 'Đang làm', 1),
('NV0075', 'Thành Bùi', 'bùi8832@cn1.vn', 'PB0103', 'NV', '2021-05-10', 'Đang làm', 1),
('NV0076', 'Cô Chi Dương', 'dương3423@cn1.vn', 'PB0103', 'NV', '2023-01-16', 'Đang làm', 1),
('NV0077', 'Chị Duyên Dương', 'dương1905@cn1.vn', 'PB0104', 'NV', '2021-08-31', 'Đang làm', 1),
('NV0078', 'Phúc Trần', 'trần2556@cn1.vn', 'PB0104', 'NV', '2025-03-12', 'Đang làm', 1),
('NV0079', 'Khoa Bùi', 'bùi4616@cn1.vn', 'PB0104', 'NV', '2024-07-30', 'Đang làm', 1),
('NV0080', 'Nhiên Tấn Nguyễn', 'nguyễn5802@cn1.vn', 'PB0104', 'NV', '2024-10-21', 'Đang làm', 1),
('NV0081', 'Hoàng Hữu Nguyễn', 'nguyễn8197@cn1.vn', 'PB0104', 'NV', '2025-07-15', 'Đang làm', 1),
('NV0082', 'Cô Bảo Đặng', 'đặng8144@cn1.vn', 'PB0104', 'NV', '2024-01-18', 'Đang làm', 1),
('NV0083', 'Hải Đặng', 'đặng7347@cn1.vn', 'PB0104', 'NV', '2023-07-04', 'Đang làm', 1),
('NV0084', 'Vân Nguyễn', 'nguyễn5416@cn1.vn', 'PB0104', 'NV', '2025-06-05', 'Đang làm', 1),
('NV0085', 'Hải Đặng', 'đặng2390@cn1.vn', 'PB0104', 'NV', '2024-07-15', 'Đang làm', 1),
('NV0086', 'Bà Hải Phạm', 'phạm1158@cn1.vn', 'PB0104', 'NV', '2024-02-06', 'Đang làm', 1),
('NV0087', 'Bác Tùng Nguyễn', 'nguyễn3942@cn1.vn', 'PB0104', 'NV', '2025-03-09', 'Đang làm', 1),
('NV0088', 'Hạnh Đức Lê', 'lê394@cn1.vn', 'PB0104', 'NV', '2022-01-11', 'Đang làm', 1),
('NV0089', 'Quý cô Ngọc Phạm', 'phạm2634@cn1.vn', 'PB0104', 'NV', '2024-06-19', 'Đang làm', 1),
('NV0090', 'Trọng Đức Đặng', 'đặng8723@cn1.vn', 'PB0104', 'NV', '2022-12-29', 'Đang làm', 1),
('NV0091', 'Quý ông Nhiên Nguyễn', 'nguyễn4200@cn1.vn', 'PB0104', 'NV', '2024-05-31', 'Đang làm', 1),
('NV0092', 'Quý ông Huy Trần', 'trần6216@cn1.vn', 'PB0104', 'NV', '2024-07-26', 'Đang làm', 1),
('NV0093', 'Kim Phạm', 'phạm7715@cn1.vn', 'PB0104', 'NV', '2023-08-25', 'Đang làm', 1),
('NV0094', 'Khoa Lê', 'lê1356@cn1.vn', 'PB0104', 'NV', '2021-10-14', 'Đang làm', 1),
('NV0095', 'Hà Trí Trần', 'trần4096@cn1.vn', 'PB0104', 'NV', '2021-01-28', 'Đang làm', 1),
('NV0096', 'Linh Hoàng', 'hoàng2472@cn1.vn', 'PB0105', 'NV', '2022-02-15', 'Đang làm', 1),
('NV0097', 'Hạnh Trần', 'trần9553@cn1.vn', 'PB0105', 'NV', '2021-07-14', 'Đang làm', 1),
('NV0098', 'Thảo Vũ', 'vũ8080@cn1.vn', 'PB0105', 'NV', '2025-03-28', 'Đang làm', 1),
('NV0099', 'Quý cô Kim Phạm', 'phạm3443@cn1.vn', 'PB0105', 'NV', '2024-01-31', 'Đang làm', 1),
('NV0100', 'Bảo Hữu Phạm', 'phạm1209@cn1.vn', 'PB0105', 'NV', '2023-06-13', 'Đang làm', 1),
('NV0101', 'Ông Trọng Dương', 'dương6011@cn1.vn', 'PB0105', 'NV', '2023-08-18', 'Đang làm', 1),
('NV0102', 'Bà Nhật Hoàng', 'hoàng1671@cn1.vn', 'PB0105', 'NV', '2021-12-17', 'Đang làm', 1),
('NV0103', 'Bà Thành Vũ', 'vũ792@cn1.vn', 'PB0105', 'NV', '2022-10-19', 'Đang làm', 1),
('NV0104', 'Quý cô An Đặng', 'đặng4029@cn1.vn', 'PB0105', 'NV', '2024-05-30', 'Đang làm', 1),
('NV0105', 'Phúc Thế Dương', 'dương3888@cn1.vn', 'PB0105', 'NV', '2024-04-11', 'Đang làm', 1),
('NV0106', 'Phúc Nguyễn', 'nguyễn6010@cn1.vn', 'PB0105', 'NV', '2022-04-23', 'Đang làm', 1),
('NV0107', 'Minh Văn Đặng', 'đặng9523@cn1.vn', 'PB0105', 'NV', '2021-09-11', 'Đang làm', 1),
('NV0108', 'Cô Dương Lê', 'lê995@cn1.vn', 'PB0105', 'NV', '2021-06-15', 'Đang làm', 1),
('NV0109', 'Bảo Hoàng', 'hoàng7910@cn1.vn', 'PB0105', 'NV', '2021-10-16', 'Đang làm', 1),
('NV0110', 'Cô Lâm Phạm', 'phạm8754@cn1.vn', 'PB0105', 'NV', '2022-12-23', 'Đang làm', 1),
('NV0111', 'Anh Khoa Mai', 'mai8061@cn1.vn', 'PB0105', 'NV', '2021-11-12', 'Đang làm', 1),
('NV0112', 'Ông Vũ Bùi', 'bùi3935@cn1.vn', 'PB0105', 'NV', '2024-07-25', 'Đang làm', 1),
('NV0113', 'Hà Phạm', 'phạm4066@cn1.vn', 'PB0105', 'NV', '2025-05-11', 'Đang làm', 1),
('NV0114', 'Cô Bảo Hoàng', 'hoàng367@cn1.vn', 'PB0105', 'NV', '2023-03-15', 'Đang làm', 1),
('NV0115', 'Kim Nguyễn', 'nguyễn1554@cn2.vn', 'PB0201', 'NV', '2025-01-18', 'Đang làm', 2),
('NV0116', 'Hoàng Mai Bảo Trần', 'trần4711@cn2.vn', 'PB0201', 'NV', '2023-02-15', 'Đang làm', 2),
('NV0117', 'Thảo Đặng', 'đặng3563@cn2.vn', 'PB0201', 'NV', '2025-10-01', 'Đang làm', 2),
('NV0118', 'Lâm Đức Trần', 'trần1642@cn2.vn', 'PB0201', 'NV', '2022-03-19', 'Đang làm', 2),
('NV0119', 'Hạnh Hoàng Bùi', 'bùi5581@cn2.vn', 'PB0201', 'NV', '2020-12-16', 'Đang làm', 2),
('NV0120', 'Cô Lan Trần', 'trần1224@cn2.vn', 'PB0201', 'NV', '2025-08-11', 'Đang làm', 2),
('NV0121', 'Lâm Đặng', 'đặng7533@cn2.vn', 'PB0201', 'NV', '2023-02-17', 'Đang làm', 2),
('NV0122', 'Lâm Quang Nguyễn', 'nguyễn3531@cn2.vn', 'PB0201', 'NV', '2021-01-10', 'Đang làm', 2),
('NV0123', 'Chị Ngọc Vũ', 'vũ8899@cn2.vn', 'PB0201', 'NV', '2025-11-02', 'Đang làm', 2),
('NV0124', 'Cô Vi Vũ', 'vũ6399@cn2.vn', 'PB0201', 'NV', '2024-09-27', 'Đang làm', 2),
('NV0125', 'Cô Kim Đặng', 'đặng9980@cn2.vn', 'PB0201', 'NV', '2022-08-31', 'Đang làm', 2),
('NV0126', 'Ông Châu Mai', 'mai6585@cn2.vn', 'PB0201', 'NV', '2024-07-23', 'Đang làm', 2),
('NV0127', 'Bà Lan Nguyễn', 'nguyễn7689@cn2.vn', 'PB0201', 'NV', '2025-03-10', 'Đang làm', 2),
('NV0128', 'Chị An Nguyễn', 'nguyễn8677@cn2.vn', 'PB0201', 'NV', '2022-07-07', 'Đang làm', 2),
('NV0129', 'Châu Bảo Đặng', 'đặng3209@cn2.vn', 'PB0201', 'NV', '2025-04-14', 'Đang làm', 2),
('NV0130', 'An Thị Dương', 'dương9956@cn2.vn', 'PB0201', 'NV', '2021-06-15', 'Đang làm', 2),
('NV0131', 'Quý cô Thảo Dương', 'dương6579@cn2.vn', 'PB0201', 'NV', '2024-04-16', 'Đang làm', 2),
('NV0132', 'Cô Hương Dương', 'dương7947@cn2.vn', 'PB0201', 'NV', '2022-01-09', 'Đang làm', 2),
('NV0133', 'Thành Vũ', 'vũ3988@cn2.vn', 'PB0201', 'NV', '2025-07-24', 'Đang làm', 2),
('NV0134', 'An Mai', 'mai6983@cn2.vn', 'PB0202', 'NV', '2022-10-19', 'Đang làm', 2),
('NV0135', 'Anh Hưng Đặng', 'đặng8443@cn2.vn', 'PB0202', 'NV', '2021-03-12', 'Đang làm', 2),
('NV0136', 'Lâm Trí Đặng', 'đặng9447@cn2.vn', 'PB0202', 'NV', '2025-04-19', 'Đang làm', 2),
('NV0137', 'Hạnh Hải Nguyễn', 'nguyễn7180@cn2.vn', 'PB0202', 'NV', '2024-06-01', 'Đang làm', 2),
('NV0138', 'Dương Nguyễn', 'nguyễn8202@cn2.vn', 'PB0202', 'NV', '2022-11-04', 'Đang làm', 2),
('NV0139', 'Nhật Đặng', 'đặng2157@cn2.vn', 'PB0202', 'NV', '2023-04-10', 'Đang làm', 2),
('NV0140', 'Bà Bảo Đặng', 'đặng5017@cn2.vn', 'PB0202', 'NV', '2022-10-20', 'Đang làm', 2),
('NV0141', 'Quang Trí Nguyễn', 'nguyễn8953@cn2.vn', 'PB0202', 'NV', '2024-09-25', 'Đang làm', 2),
('NV0142', 'Bà Nhật Vũ', 'vũ5987@cn2.vn', 'PB0202', 'NV', '2023-01-31', 'Đang làm', 2),
('NV0143', 'Tú Vũ', 'vũ602@cn2.vn', 'PB0202', 'NV', '2023-10-13', 'Đang làm', 2),
('NV0144', 'Quý ông Bảo Phạm', 'phạm317@cn2.vn', 'PB0202', 'NV', '2025-07-08', 'Đang làm', 2),
('NV0145', 'Quý ông Trọng Phạm', 'phạm4783@cn2.vn', 'PB0202', 'NV', '2022-02-22', 'Đang làm', 2),
('NV0146', 'Thành Trần', 'trần8751@cn2.vn', 'PB0202', 'NV', '2022-12-13', 'Đang làm', 2),
('NV0147', 'Cô Ánh Lê', 'lê5755@cn2.vn', 'PB0202', 'NV', '2021-02-10', 'Đang làm', 2),
('NV0148', 'Nhật Quang Lê', 'lê148@cn2.vn', 'PB0202', 'NV', '2025-10-17', 'Đang làm', 2),
('NV0149', 'Bảo Đặng', 'đặng1795@cn2.vn', 'PB0202', 'NV', '2024-10-13', 'Đang làm', 2),
('NV0150', 'Quý cô Nhật Phạm', 'phạm4178@cn2.vn', 'PB0202', 'NV', '2022-08-22', 'Đang làm', 2),
('NV0151', 'Quý cô Thảo Dương', 'dương5252@cn2.vn', 'PB0202', 'NV', '2025-09-01', 'Đang làm', 2),
('NV0152', 'Châu Hoàng', 'hoàng7914@cn2.vn', 'PB0202', 'NV', '2021-01-08', 'Đang làm', 2),
('NV0153', 'Bà Thảo Đặng', 'đặng4394@cn2.vn', 'PB0203', 'NV', '2022-04-14', 'Đang làm', 2),
('NV0154', 'Vũ Mai Hoàng', 'hoàng431@cn2.vn', 'PB0203', 'NV', '2023-12-15', 'Đang làm', 2),
('NV0155', 'Bác Trọng Đặng', 'đặng918@cn2.vn', 'PB0203', 'NV', '2025-01-18', 'Đang làm', 2),
('NV0156', 'Chị Duyên Vũ', 'vũ7883@cn2.vn', 'PB0203', 'NV', '2022-03-03', 'Đang làm', 2),
('NV0157', 'Bà Bảo Trần', 'trần9239@cn2.vn', 'PB0203', 'NV', '2021-12-11', 'Đang làm', 2),
('NV0158', 'Thành Phú Hoàng', 'hoàng9715@cn2.vn', 'PB0203', 'NV', '2023-12-30', 'Đang làm', 2),
('NV0159', 'Ánh Mai', 'mai6181@cn2.vn', 'PB0203', 'NV', '2021-11-30', 'Đang làm', 2),
('NV0160', 'Chị Hải Vũ', 'vũ3677@cn2.vn', 'PB0203', 'NV', '2021-10-01', 'Đang làm', 2),
('NV0161', 'Bà Bảo Trần', 'trần2045@cn2.vn', 'PB0203', 'NV', '2025-08-23', 'Đang làm', 2),
('NV0162', 'Bà Phương Lê', 'lê3399@cn2.vn', 'PB0203', 'NV', '2024-10-21', 'Đang làm', 2),
('NV0163', 'Phương Đặng', 'đặng6751@cn2.vn', 'PB0203', 'NV', '2021-09-30', 'Đang làm', 2),
('NV0164', 'Chị Bảo Trần', 'trần4046@cn2.vn', 'PB0203', 'NV', '2024-02-21', 'Đang làm', 2),
('NV0165', 'Quý cô Lan Lê', 'lê9067@cn2.vn', 'PB0203', 'NV', '2024-04-04', 'Đang làm', 2),
('NV0166', 'Quý cô Xuân Đặng', 'đặng6747@cn2.vn', 'PB0203', 'NV', '2025-08-17', 'Đang làm', 2),
('NV0167', 'Hoàng Hải Bùi', 'bùi2487@cn2.vn', 'PB0203', 'NV', '2025-07-16', 'Đang làm', 2),
('NV0168', 'Quý cô Ngọc Dương', 'dương6862@cn2.vn', 'PB0203', 'NV', '2023-02-08', 'Đang làm', 2),
('NV0169', 'Ông Trọng Phạm', 'phạm3561@cn2.vn', 'PB0203', 'NV', '2022-05-20', 'Đang làm', 2),
('NV0170', 'Hạnh Đặng', 'đặng8719@cn2.vn', 'PB0203', 'NV', '2024-02-14', 'Đang làm', 2),
('NV0171', 'Ánh Nguyễn', 'nguyễn7719@cn2.vn', 'PB0203', 'NV', '2020-12-02', 'Đang làm', 2),
('NV0172', 'Trung Phạm', 'phạm6642@cn2.vn', 'PB0204', 'NV', '2023-08-26', 'Đang làm', 2),
('NV0173', 'Lan Hoàng', 'hoàng9244@cn2.vn', 'PB0204', 'NV', '2021-08-17', 'Đang làm', 2),
('NV0174', 'Hạnh Đức Nguyễn', 'nguyễn8179@cn2.vn', 'PB0204', 'NV', '2024-04-22', 'Đang làm', 2),
('NV0175', 'Dương Đặng', 'đặng9614@cn2.vn', 'PB0204', 'NV', '2024-07-31', 'Đang làm', 2),
('NV0176', 'Bảo Phú Đặng', 'đặng3521@cn2.vn', 'PB0204', 'NV', '2024-08-15', 'Đang làm', 2),
('NV0177', 'Phương Vũ', 'vũ6895@cn2.vn', 'PB0204', 'NV', '2025-02-14', 'Đang làm', 2),
('NV0178', 'Bà Vi Bùi', 'bùi6876@cn2.vn', 'PB0204', 'NV', '2021-01-18', 'Đang làm', 2),
('NV0179', 'Quý cô Hương Vũ', 'vũ8291@cn2.vn', 'PB0204', 'NV', '2021-04-06', 'Đang làm', 2),
('NV0180', 'Bà Yến Vũ', 'vũ1800@cn2.vn', 'PB0204', 'NV', '2025-07-01', 'Đang làm', 2),
('NV0181', 'Trọng Quang Trần', 'trần1557@cn2.vn', 'PB0204', 'NV', '2022-11-28', 'Đang làm', 2),
('NV0182', 'Bà Nhật Đặng', 'đặng625@cn2.vn', 'PB0204', 'NV', '2022-03-26', 'Đang làm', 2),
('NV0183', 'Cô Xuân Vũ', 'vũ5694@cn2.vn', 'PB0204', 'NV', '2022-11-30', 'Đang làm', 2),
('NV0184', 'Quý ông Tú Phạm', 'phạm6785@cn2.vn', 'PB0204', 'NV', '2021-05-28', 'Đang làm', 2),
('NV0185', 'Lâm Bảo Mai', 'mai1060@cn2.vn', 'PB0204', 'NV', '2021-10-16', 'Đang làm', 2),
('NV0186', 'Xuân Vũ', 'vũ8324@cn2.vn', 'PB0204', 'NV', '2023-02-17', 'Đang làm', 2),
('NV0187', 'Vân Đặng', 'đặng7890@cn2.vn', 'PB0204', 'NV', '2021-08-08', 'Đang làm', 2),
('NV0188', 'Thành Phú Đặng', 'đặng1349@cn2.vn', 'PB0204', 'NV', '2024-08-05', 'Đang làm', 2),
('NV0189', 'Bà An Trần', 'trần1422@cn2.vn', 'PB0204', 'NV', '2021-03-03', 'Đang làm', 2),
('NV0190', 'Cô Lan Vũ', 'vũ8892@cn2.vn', 'PB0204', 'NV', '2023-04-01', 'Đang làm', 2),
('NV0191', 'Quý cô Vi Hoàng', 'hoàng6995@cn2.vn', 'PB0205', 'NV', '2023-12-14', 'Đang làm', 2),
('NV0192', 'Phương Hoàng', 'hoàng1095@cn2.vn', 'PB0205', 'NV', '2022-04-16', 'Đang làm', 2),
('NV0193', 'Thành Trí Bùi', 'bùi5212@cn2.vn', 'PB0205', 'NV', '2025-06-18', 'Đang làm', 2),
('NV0194', 'Chị Duyên Hoàng', 'hoàng3478@cn2.vn', 'PB0205', 'NV', '2025-02-21', 'Đang làm', 2),
('NV0195', 'Phương Trần', 'trần1586@cn2.vn', 'PB0205', 'NV', '2021-10-11', 'Đang làm', 2),
('NV0196', 'Chị Vân Trần', 'trần3983@cn2.vn', 'PB0205', 'NV', '2022-05-24', 'Đang làm', 2),
('NV0197', 'Nhật Phạm', 'phạm1795@cn2.vn', 'PB0205', 'NV', '2023-05-25', 'Đang làm', 2),
('NV0198', 'Lan Nguyễn', 'nguyễn4954@cn2.vn', 'PB0205', 'NV', '2025-08-19', 'Đang làm', 2),
('NV0199', 'Khoa Đức Lê', 'lê6299@cn2.vn', 'PB0205', 'NV', '2023-09-27', 'Đang làm', 2),
('NV0200', 'Bảo Mai', 'mai672@cn2.vn', 'PB0205', 'NV', '2022-08-23', 'Đang làm', 2),
('NV0201', 'Kim Lê', 'lê1677@cn2.vn', 'PB0205', 'NV', '2020-11-09', 'Đang làm', 2),
('NV0202', 'Hạnh Thế Hoàng', 'hoàng5150@cn2.vn', 'PB0205', 'NV', '2021-01-01', 'Đang làm', 2),
('NV0203', 'Bảo Dương', 'dương8786@cn2.vn', 'PB0205', 'NV', '2024-06-06', 'Đang làm', 2),
('NV0204', 'Vi Lê', 'lê5390@cn2.vn', 'PB0205', 'NV', '2021-11-02', 'Đang làm', 2),
('NV0205', 'Dương Trần', 'trần3994@cn2.vn', 'PB0205', 'NV', '2024-07-26', 'Đang làm', 2),
('NV0206', 'Khoa Hải Dương', 'dương2607@cn2.vn', 'PB0205', 'NV', '2021-03-04', 'Đang làm', 2),
('NV0207', 'Chị An Lê', 'lê5924@cn2.vn', 'PB0205', 'NV', '2021-03-13', 'Đang làm', 2),
('NV0208', 'Kim Thế Hoàng', 'hoàng442@cn2.vn', 'PB0205', 'NV', '2022-07-26', 'Đang làm', 2),
('NV0209', 'Chị Hương Vũ', 'vũ8114@cn2.vn', 'PB0205', 'NV', '2021-05-30', 'Đang làm', 2),
('NV0210', 'Chị Bảo Dương', 'dương3223@cn3.vn', 'PB0301', 'NV', '2022-11-29', 'Đang làm', 3),
('NV0211', 'Anh Dũng Dương', 'dương4618@cn3.vn', 'PB0301', 'NV', '2024-10-24', 'Đang làm', 3),
('NV0212', 'Anh Quang Trần', 'trần4740@cn3.vn', 'PB0301', 'NV', '2023-05-11', 'Đang làm', 3),
('NV0213', 'Ngọc Dương', 'dương1285@cn3.vn', 'PB0301', 'NV', '2024-05-23', 'Đang làm', 3),
('NV0214', 'Cô Nhật Bùi', 'bùi7878@cn3.vn', 'PB0301', 'NV', '2024-12-13', 'Đang làm', 3),
('NV0215', 'Phương Trần', 'trần7643@cn3.vn', 'PB0301', 'NV', '2021-08-26', 'Đang làm', 3),
('NV0216', 'Lâm Bảo Bùi', 'bùi2825@cn3.vn', 'PB0301', 'NV', '2024-12-11', 'Đang làm', 3),
('NV0217', 'Kim Dương', 'dương8033@cn3.vn', 'PB0301', 'NV', '2023-06-27', 'Đang làm', 3),
('NV0218', 'Chị Hải Dương', 'dương3150@cn3.vn', 'PB0301', 'NV', '2022-09-02', 'Đang làm', 3),
('NV0219', 'Dũng Mai', 'mai5931@cn3.vn', 'PB0301', 'NV', '2025-01-29', 'Đang làm', 3),
('NV0220', 'Quý cô Lâm Trần', 'trần4444@cn3.vn', 'PB0301', 'NV', '2025-06-09', 'Đang làm', 3),
('NV0221', 'Hưng Phú Nguyễn', 'nguyễn6512@cn3.vn', 'PB0301', 'NV', '2022-06-27', 'Đang làm', 3),
('NV0222', 'Tùng Tấn Phạm', 'phạm9673@cn3.vn', 'PB0301', 'NV', '2023-12-08', 'Đang làm', 3),
('NV0223', 'Cô Thành Dương', 'dương2798@cn3.vn', 'PB0301', 'NV', '2024-01-20', 'Đang làm', 3),
('NV0224', 'Trọng Đặng', 'đặng7753@cn3.vn', 'PB0301', 'NV', '2025-04-15', 'Đang làm', 3),
('NV0225', 'Cô Hà Phạm', 'phạm4237@cn3.vn', 'PB0301', 'NV', '2025-04-28', 'Nghỉ phép', 3),
('NV0226', 'Hương Bùi', 'bùi5555@cn3.vn', 'PB0301', 'NV', '2020-12-17', 'Đang làm', 3),
('NV0227', 'An Nguyễn', 'nguyễn9718@cn3.vn', 'PB0301', 'NV', '2022-02-21', 'Đang làm', 3),
('NV0228', 'Cô Mai Vũ', 'vũ5799@cn3.vn', 'PB0301', 'NV', '2021-07-16', 'Đang làm', 3),
('NV0229', 'An Hữu Nguyễn', 'nguyễn726@cn3.vn', 'PB0302', 'NV', '2023-02-08', 'Đang làm', 3),
('NV0230', 'Quý cô Khoa Trần', 'trần6321@cn3.vn', 'PB0302', 'NV', '2024-01-25', 'Đang làm', 3),
('NV0231', 'Thành Thị Lê', 'lê4322@cn3.vn', 'PB0302', 'NV', '2022-06-19', 'Đang làm', 3),
('NV0232', 'Kim Vũ', 'vũ8946@cn3.vn', 'PB0302', 'NV', '2024-05-06', 'Đang làm', 3),
('NV0233', 'Bà Thành Nguyễn', 'nguyễn884@cn3.vn', 'PB0302', 'NV', '2022-03-04', 'Đang làm', 3),
('NV0234', 'Bảo Vũ', 'vũ3107@cn3.vn', 'PB0302', 'NV', '2023-11-10', 'Đang làm', 3),
('NV0235', 'Ông Dũng Bùi', 'bùi4610@cn3.vn', 'PB0302', 'NV', '2023-11-03', 'Đang làm', 3),
('NV0236', 'Quý cô Khoa Lê', 'lê1103@cn3.vn', 'PB0302', 'NV', '2020-12-24', 'Đang làm', 3),
('NV0237', 'Nhật Vũ', 'vũ2639@cn3.vn', 'PB0302', 'NV', '2020-11-23', 'Đang làm', 3),
('NV0238', 'Chị Lan Dương', 'dương3499@cn3.vn', 'PB0302', 'NV', '2024-10-03', 'Đang làm', 3),
('NV0239', 'Mai Hoàng', 'hoàng5923@cn3.vn', 'PB0302', 'NV', '2021-07-02', 'Đang làm', 3),
('NV0240', 'Phương Phú Bùi', 'bùi3438@cn3.vn', 'PB0302', 'NV', '2023-04-06', 'Đang làm', 3),
('NV0241', 'Nhiên Quang Lê', 'lê515@cn3.vn', 'PB0302', 'NV', '2024-11-21', 'Đang làm', 3),
('NV0242', 'Bác Thành Lê', 'lê538@cn3.vn', 'PB0302', 'NV', '2021-10-10', 'Đang làm', 3),
('NV0243', 'Minh Mai Bảo Nguyễn', 'nguyễn4237@cn3.vn', 'PB0302', 'NV', '2024-04-10', 'Đang làm', 3),
('NV0244', 'Bà Dương Lê', 'lê2048@cn3.vn', 'PB0302', 'NV', '2021-02-03', 'Đang làm', 3),
('NV0245', 'Chị Ngọc Trần', 'trần3069@cn3.vn', 'PB0302', 'NV', '2024-05-05', 'Đang làm', 3),
('NV0246', 'Bác Nam Lê', 'lê761@cn3.vn', 'PB0302', 'NV', '2024-10-06', 'Đang làm', 3),
('NV0247', 'Kim Bùi', 'bùi624@cn3.vn', 'PB0302', 'NV', '2023-07-19', 'Đang làm', 3),
('NV0248', 'Lâm Đặng', 'đặng4021@cn3.vn', 'PB0303', 'NV', '2022-02-17', 'Đang làm', 3),
('NV0249', 'Hà Mai Bảo Phạm', 'phạm9749@cn3.vn', 'PB0303', 'NV', '2021-01-20', 'Đang làm', 3),
('NV0250', 'Thành Dương', 'dương4952@cn3.vn', 'PB0303', 'NV', '2021-06-30', 'Đang làm', 3),
('NV0251', 'Lâm Đặng', 'đặng1143@cn3.vn', 'PB0303', 'NV', '2021-01-06', 'Đang làm', 3),
('NV0252', 'Hưng Nguyễn', 'nguyễn6655@cn3.vn', 'PB0303', 'NV', '2025-05-07', 'Đang làm', 3),
('NV0253', 'Xuân Phạm', 'phạm8702@cn3.vn', 'PB0303', 'NV', '2022-06-13', 'Đang làm', 3),
('NV0254', 'Tú Lê', 'lê8614@cn3.vn', 'PB0303', 'NV', '2021-05-19', 'Đang làm', 3),
('NV0255', 'Vân Mai', 'mai7898@cn3.vn', 'PB0303', 'NV', '2022-10-06', 'Đang làm', 3),
('NV0256', 'Quý ông Phúc Dương', 'dương6346@cn3.vn', 'PB0303', 'NV', '2022-02-18', 'Đang làm', 3),
('NV0257', 'Quý cô Thảo Bùi', 'bùi6372@cn3.vn', 'PB0303', 'NV', '2022-07-09', 'Đang làm', 3),
('NV0258', 'Phương Vũ', 'vũ71@cn3.vn', 'PB0303', 'NV', '2021-08-10', 'Đang làm', 3),
('NV0259', 'Duyên Vũ', 'vũ3381@cn3.vn', 'PB0303', 'NV', '2023-11-20', 'Đang làm', 3),
('NV0260', 'Thành Đặng', 'đặng4464@cn3.vn', 'PB0303', 'NV', '2023-03-25', 'Đang làm', 3),
('NV0261', 'Huy Dương', 'dương5429@cn3.vn', 'PB0303', 'NV', '2024-06-24', 'Đang làm', 3),
('NV0262', 'Hạnh Mai', 'mai1739@cn3.vn', 'PB0303', 'NV', '2021-09-26', 'Đang làm', 3),
('NV0263', 'Quý cô Ngọc Trần', 'trần3126@cn3.vn', 'PB0303', 'NV', '2024-04-10', 'Đang làm', 3),
('NV0264', 'Quang Quang Trần', 'trần2376@cn3.vn', 'PB0303', 'NV', '2025-06-30', 'Đang làm', 3),
('NV0265', 'Tú Mai', 'mai8509@cn3.vn', 'PB0303', 'NV', '2025-05-18', 'Đang làm', 3),
('NV0266', 'Khoa Dương', 'dương9220@cn3.vn', 'PB0303', 'NV', '2024-11-20', 'Đang làm', 3),
('NV0267', 'Khoa Nguyễn', 'nguyễn8639@cn3.vn', 'PB0304', 'NV', '2022-05-23', 'Đang làm', 3),
('NV0268', 'Quý cô Vi Vũ', 'vũ6650@cn3.vn', 'PB0304', 'NV', '2021-07-26', 'Đang làm', 3),
('NV0269', 'Quý cô Kim Nguyễn', 'nguyễn9726@cn3.vn', 'PB0304', 'NV', '2022-07-15', 'Đang làm', 3),
('NV0270', 'Trung Hải Hoàng', 'hoàng4062@cn3.vn', 'PB0304', 'NV', '2022-05-17', 'Đang làm', 3),
('NV0271', 'Linh Đặng', 'đặng6981@cn3.vn', 'PB0304', 'NV', '2021-03-23', 'Đang làm', 3),
('NV0272', 'Yến Bùi', 'bùi2979@cn3.vn', 'PB0304', 'NV', '2023-04-17', 'Đang làm', 3),
('NV0273', 'Lâm Văn Lê', 'lê8572@cn3.vn', 'PB0304', 'NV', '2024-08-26', 'Đang làm', 3),
('NV0274', 'Quang Phạm', 'phạm6410@cn3.vn', 'PB0304', 'NV', '2025-10-21', 'Đang làm', 3),
('NV0275', 'Anh Đức Vũ', 'vũ3682@cn3.vn', 'PB0304', 'NV', '2023-04-27', 'Đang làm', 3),
('NV0276', 'Bảo Tấn Hoàng', 'hoàng7598@cn3.vn', 'PB0304', 'NV', '2022-03-02', 'Đang làm', 3),
('NV0277', 'Khoa Đặng', 'đặng1682@cn3.vn', 'PB0304', 'NV', '2021-01-25', 'Đang làm', 3),
('NV0278', 'Quý ông Quang Phạm', 'phạm9795@cn3.vn', 'PB0304', 'NV', '2021-02-08', 'Đang làm', 3),
('NV0279', 'Hưng Văn Vũ', 'vũ7450@cn3.vn', 'PB0304', 'NV', '2022-05-21', 'Đang làm', 3),
('NV0280', 'Phương Đức Trần', 'trần5609@cn3.vn', 'PB0304', 'NV', '2025-09-11', 'Đang làm', 3),
('NV0281', 'Lâm Vũ', 'vũ8997@cn3.vn', 'PB0304', 'NV', '2025-11-04', 'Đang làm', 3),
('NV0282', 'Khoa Dương', 'dương5523@cn3.vn', 'PB0304', 'NV', '2022-11-13', 'Đang làm', 3),
('NV0283', 'Ánh Nguyễn', 'nguyễn3711@cn3.vn', 'PB0304', 'NV', '2022-08-13', 'Đang làm', 3),
('NV0284', 'Phương Trí Mai', 'mai7618@cn3.vn', 'PB0304', 'NV', '2024-11-21', 'Đang làm', 3),
('NV0285', 'Khoa Nguyễn', 'nguyễn5183@cn3.vn', 'PB0304', 'NV', '2022-03-08', 'Đang làm', 3),
('NV0286', 'Khoa Trần', 'trần5490@cn3.vn', 'PB0305', 'NV', '2025-01-16', 'Đang làm', 3),
('NV0287', 'Ông Huy Mai', 'mai1672@cn3.vn', 'PB0305', 'NV', '2021-02-16', 'Đang làm', 3),
('NV0288', 'Cô Hương Phạm', 'phạm2399@cn3.vn', 'PB0305', 'NV', '2021-05-11', 'Đang làm', 3),
('NV0289', 'Khoa Dương', 'dương8825@cn3.vn', 'PB0305', 'NV', '2022-11-07', 'Đang làm', 3),
('NV0290', 'Trọng Nguyễn', 'nguyễn8587@cn3.vn', 'PB0305', 'NV', '2021-07-17', 'Đang làm', 3),
('NV0291', 'Quý cô Xuân Mai', 'mai4839@cn3.vn', 'PB0305', 'NV', '2021-06-03', 'Đang làm', 3),
('NV0292', 'Yến Phạm', 'phạm1094@cn3.vn', 'PB0305', 'NV', '2022-03-14', 'Đang làm', 3),
('NV0293', 'Bà Chi Đặng', 'đặng7775@cn3.vn', 'PB0305', 'NV', '2021-08-25', 'Đang làm', 3),
('NV0294', 'Ông Trọng Dương', 'dương8686@cn3.vn', 'PB0305', 'NV', '2022-01-24', 'Đang làm', 3),
('NV0295', 'Ánh Bùi', 'bùi7291@cn3.vn', 'PB0305', 'NV', '2023-01-17', 'Đang làm', 3),
('NV0296', 'Bà Hồng Trần', 'trần8041@cn3.vn', 'PB0305', 'NV', '2024-08-29', 'Đang làm', 3),
('NV0297', 'Châu Đặng', 'đặng7079@cn3.vn', 'PB0305', 'NV', '2023-11-21', 'Đang làm', 3),
('NV0298', 'Ông Châu Vũ', 'vũ6590@cn3.vn', 'PB0305', 'NV', '2025-04-17', 'Đang làm', 3),
('NV0299', 'Chi Dương', 'dương8219@cn3.vn', 'PB0305', 'NV', '2024-02-14', 'Đang làm', 3),
('NV0300', 'Hạnh Vũ', 'vũ5995@cn3.vn', 'PB0305', 'NV', '2022-01-15', 'Đang làm', 3),
('NV0301', 'Quý cô Hồng Phạm', 'phạm9951@cn3.vn', 'PB0305', 'NV', '2021-02-27', 'Đang làm', 3),
('NV0302', 'Ánh Phạm', 'phạm5288@cn3.vn', 'PB0305', 'NV', '2021-08-10', 'Đang làm', 3),
('NV0303', 'Bảo Bùi', 'bùi6351@cn3.vn', 'PB0305', 'NV', '2024-03-07', 'Đang làm', 3),
('NV0304', 'Kim Phạm', 'phạm8118@cn3.vn', 'PB0305', 'NV', '2022-11-04', 'Đang làm', 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phong_ban`
--

CREATE TABLE `phong_ban` (
  `mapb` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ten_phong` varchar(100) NOT NULL,
  `truong_phong_id` varchar(11) DEFAULT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp(),
  `ma_cn` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `phong_ban`
--

INSERT INTO `phong_ban` (`mapb`, `ten_phong`, `truong_phong_id`, `ngay_tao`, `ma_cn`) VALUES
('PB0101', 'Phòng Hành chính - Nhân sự', 'NV0005', '2023-01-21 17:00:00', 1),
('PB0102', 'Phòng Kế toán - Tài chính', 'NV0006', '2025-05-17 17:00:00', 1),
('PB0103', 'Phòng Kinh doanh', 'NV0007', '2023-03-29 17:00:00', 1),
('PB0104', 'Phòng Kỹ thuật', 'NV0008', '2024-01-14 17:00:00', 1),
('PB0105', 'Phòng Marketing', 'NV0009', '2022-11-28 17:00:00', 1),
('PB0201', 'Phòng Hành chính - Nhân sự', 'NV0010', '2024-02-29 17:00:00', 2),
('PB0202', 'Phòng Kế toán - Tài chính', 'NV0011', '2025-01-04 17:00:00', 2),
('PB0203', 'Phòng Kinh doanh', 'NV0012', '2022-11-23 17:00:00', 2),
('PB0204', 'Phòng Kỹ thuật', 'NV0013', '2024-01-24 17:00:00', 2),
('PB0205', 'Phòng Marketing', 'NV0014', '2024-03-13 17:00:00', 2),
('PB0301', 'Phòng Hành chính - Nhân sự', 'NV0015', '2024-08-09 17:00:00', 3),
('PB0302', 'Phòng Kế toán - Tài chính', 'NV0016', '2025-02-10 17:00:00', 3),
('PB0303', 'Phòng Kinh doanh', 'NV0017', '2022-12-03 17:00:00', 3),
('PB0304', 'Phòng Kỹ thuật', 'NV0018', '2024-06-02 17:00:00', 3),
('PB0305', 'Phòng Marketing', 'NV0019', '2025-08-02 17:00:00', 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `qua_trinh_cong_tac`
--

CREATE TABLE `qua_trinh_cong_tac` (
  `ma_nhan_vien` varchar(20) NOT NULL,
  `ma_phong_ban` varchar(20) NOT NULL,
  `ma_chuc_vu` varchar(11) NOT NULL,
  `tu_ngay` date DEFAULT NULL,
  `den_ngay` date DEFAULT NULL,
  `ghi_chu` varchar(255) DEFAULT NULL,
  `ngay_tao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `TenDangNhap` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `MatKhau` varchar(255) NOT NULL,
  `VaiTro` enum('tonggiamdoc','giamdoc_cn','truongphong','nhanvien') DEFAULT 'nhanvien'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`TenDangNhap`, `MatKhau`, `VaiTro`) VALUES
('nv0001', 'e10adc3949ba59abbe56e057f20f883e', 'tonggiamdoc'),
('nv0002', 'e10adc3949ba59abbe56e057f20f883e', 'giamdoc_cn'),
('nv0003', 'e10adc3949ba59abbe56e057f20f883e', 'giamdoc_cn'),
('nv0004', 'e10adc3949ba59abbe56e057f20f883e', 'giamdoc_cn'),
('nv0005', 'e10adc3949ba59abbe56e057f20f883e', 'truongphong'),
('nv0006', 'e10adc3949ba59abbe56e057f20f883e', 'truongphong'),
('nv0007', 'e10adc3949ba59abbe56e057f20f883e', 'truongphong'),
('nv0008', 'e10adc3949ba59abbe56e057f20f883e', 'truongphong'),
('nv0009', 'e10adc3949ba59abbe56e057f20f883e', 'truongphong'),
('nv0010', 'e10adc3949ba59abbe56e057f20f883e', 'truongphong'),
('nv0011', 'e10adc3949ba59abbe56e057f20f883e', 'truongphong'),
('nv0012', 'e10adc3949ba59abbe56e057f20f883e', 'truongphong'),
('nv0013', 'e10adc3949ba59abbe56e057f20f883e', 'truongphong'),
('nv0014', 'e10adc3949ba59abbe56e057f20f883e', 'truongphong'),
('nv0015', 'e10adc3949ba59abbe56e057f20f883e', 'truongphong'),
('nv0016', 'e10adc3949ba59abbe56e057f20f883e', 'truongphong'),
('nv0017', 'e10adc3949ba59abbe56e057f20f883e', 'truongphong'),
('nv0018', 'e10adc3949ba59abbe56e057f20f883e', 'truongphong'),
('nv0019', 'e10adc3949ba59abbe56e057f20f883e', 'truongphong'),
('nv0020', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0021', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0022', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0023', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0024', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0025', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0026', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0027', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0028', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0029', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0030', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0031', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0032', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0033', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0034', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0035', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0036', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0037', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0038', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0039', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0040', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0041', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0042', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0043', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0044', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0045', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0046', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0047', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0048', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0049', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0050', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0051', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0052', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0053', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0054', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0055', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0056', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0057', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0058', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0059', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0060', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0061', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0062', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0063', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0064', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0065', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0066', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0067', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0068', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0069', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0070', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0071', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0072', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0073', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0074', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0075', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0076', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0077', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0078', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0079', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0080', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0081', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0082', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0083', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0084', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0085', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0086', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0087', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0088', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0089', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0090', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0091', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0092', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0093', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0094', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0095', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0096', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0097', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0098', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0099', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0100', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0101', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0102', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0103', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0104', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0105', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0106', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0107', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0108', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0109', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0110', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0111', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0112', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0113', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0114', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0115', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0116', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0117', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0118', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0119', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0120', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0121', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0122', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0123', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0124', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0125', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0126', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0127', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0128', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0129', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0130', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0131', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0132', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0133', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0134', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0135', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0136', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0137', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0138', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0139', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0140', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0141', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0142', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0143', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0144', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0145', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0146', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0147', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0148', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0149', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0150', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0151', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0152', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0153', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0154', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0155', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0156', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0157', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0158', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0159', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0160', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0161', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0162', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0163', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0164', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0165', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0166', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0167', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0168', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0169', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0170', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0171', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0172', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0173', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0174', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0175', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0176', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0177', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0178', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0179', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0180', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0181', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0182', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0183', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0184', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0185', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0186', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0187', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0188', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0189', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0190', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0191', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0192', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0193', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0194', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0195', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0196', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0197', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0198', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0199', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0200', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0201', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0202', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0203', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0204', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0205', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0206', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0207', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0208', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0209', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0210', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0211', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0212', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0213', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0214', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0215', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0216', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0217', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0218', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0219', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0220', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0221', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0222', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0223', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0224', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0225', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0226', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0227', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0228', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0229', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0230', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0231', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0232', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0233', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0234', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0235', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0236', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0237', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0238', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0239', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0240', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0241', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0242', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0243', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0244', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0245', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0246', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0247', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0248', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0249', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0250', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0251', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0252', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0253', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0254', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0255', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0256', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0257', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0258', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0259', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0260', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0261', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0262', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0263', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0264', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0265', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0266', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0267', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0268', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0269', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0270', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0271', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0272', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0273', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0274', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0275', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0276', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0277', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0278', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0279', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0280', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0281', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0282', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0283', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0284', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0285', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0286', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0287', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0288', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0289', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0290', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0291', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0292', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0293', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0294', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0295', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0296', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0297', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0298', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0299', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0300', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0301', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0302', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0303', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien'),
('nv0304', 'e10adc3949ba59abbe56e057f20f883e', 'nhanvien');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bao_hiem_xa_hoi`
--
ALTER TABLE `bao_hiem_xa_hoi`
  ADD PRIMARY KEY (`ma_nhan_vien`);

--
-- Chỉ mục cho bảng `bao_hiem_y_te`
--
ALTER TABLE `bao_hiem_y_te`
  ADD PRIMARY KEY (`ma_nhan_vien`);

--
-- Chỉ mục cho bảng `cham_cong`
--
ALTER TABLE `cham_cong`
  ADD PRIMARY KEY (`ma_nhan_vien`);

--
-- Chỉ mục cho bảng `chi_nhanh`
--
ALTER TABLE `chi_nhanh`
  ADD PRIMARY KEY (`ma_chi_nhanh`);

--
-- Chỉ mục cho bảng `chuc_vu`
--
ALTER TABLE `chuc_vu`
  ADD PRIMARY KEY (`chucvu_id`);

--
-- Chỉ mục cho bảng `hop_dong`
--
ALTER TABLE `hop_dong`
  ADD PRIMARY KEY (`ma_nhan_vien`);

--
-- Chỉ mục cho bảng `khen_thuong_ky_luat`
--
ALTER TABLE `khen_thuong_ky_luat`
  ADD PRIMARY KEY (`ma_nhan_vien`);

--
-- Chỉ mục cho bảng `kpi_nhan_vien`
--
ALTER TABLE `kpi_nhan_vien`
  ADD PRIMARY KEY (`ma_nhan_vien`);

--
-- Chỉ mục cho bảng `luong`
--
ALTER TABLE `luong`
  ADD PRIMARY KEY (`ma_nhan_vien`);

--
-- Chỉ mục cho bảng `nhan_vien`
--
ALTER TABLE `nhan_vien`
  ADD PRIMARY KEY (`ma_nhan_vien`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `phong_ban_id` (`phong_ban_id`,`chuc_vu_id`),
  ADD KEY `chuc_vu_id` (`chuc_vu_id`);

--
-- Chỉ mục cho bảng `phong_ban`
--
ALTER TABLE `phong_ban`
  ADD PRIMARY KEY (`mapb`,`ma_cn`),
  ADD KEY `ma_cn` (`ma_cn`);

--
-- Chỉ mục cho bảng `qua_trinh_cong_tac`
--
ALTER TABLE `qua_trinh_cong_tac`
  ADD PRIMARY KEY (`ma_nhan_vien`,`ma_phong_ban`,`ma_chuc_vu`),
  ADD KEY `ma_phong_ban` (`ma_phong_ban`),
  ADD KEY `ma_chuc_vu` (`ma_chuc_vu`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`TenDangNhap`);

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bao_hiem_xa_hoi`
--
ALTER TABLE `bao_hiem_xa_hoi`
  ADD CONSTRAINT `bao_hiem_xa_hoi_ibfk_1` FOREIGN KEY (`ma_nhan_vien`) REFERENCES `nhan_vien` (`ma_nhan_vien`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `bao_hiem_y_te`
--
ALTER TABLE `bao_hiem_y_te`
  ADD CONSTRAINT `bao_hiem_y_te_ibfk_1` FOREIGN KEY (`ma_nhan_vien`) REFERENCES `nhan_vien` (`ma_nhan_vien`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `cham_cong`
--
ALTER TABLE `cham_cong`
  ADD CONSTRAINT `cham_cong_ibfk_1` FOREIGN KEY (`ma_nhan_vien`) REFERENCES `nhan_vien` (`ma_nhan_vien`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `hop_dong`
--
ALTER TABLE `hop_dong`
  ADD CONSTRAINT `hop_dong_ibfk_1` FOREIGN KEY (`ma_nhan_vien`) REFERENCES `nhan_vien` (`ma_nhan_vien`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `khen_thuong_ky_luat`
--
ALTER TABLE `khen_thuong_ky_luat`
  ADD CONSTRAINT `khen_thuong_ky_luat_ibfk_1` FOREIGN KEY (`ma_nhan_vien`) REFERENCES `nhan_vien` (`ma_nhan_vien`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `kpi_nhan_vien`
--
ALTER TABLE `kpi_nhan_vien`
  ADD CONSTRAINT `kpi_nhan_vien_ibfk_1` FOREIGN KEY (`ma_nhan_vien`) REFERENCES `nhan_vien` (`ma_nhan_vien`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `luong`
--
ALTER TABLE `luong`
  ADD CONSTRAINT `luong_ibfk_1` FOREIGN KEY (`ma_nhan_vien`) REFERENCES `nhan_vien` (`ma_nhan_vien`);

--
-- Các ràng buộc cho bảng `nhan_vien`
--
ALTER TABLE `nhan_vien`
  ADD CONSTRAINT `nhan_vien_ibfk_8` FOREIGN KEY (`phong_ban_id`) REFERENCES `phong_ban` (`mapb`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `nhan_vien_ibfk_9` FOREIGN KEY (`chuc_vu_id`) REFERENCES `chuc_vu` (`chucvu_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `phong_ban`
--
ALTER TABLE `phong_ban`
  ADD CONSTRAINT `phong_ban_ibfk_1` FOREIGN KEY (`ma_cn`) REFERENCES `chi_nhanh` (`ma_chi_nhanh`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `qua_trinh_cong_tac`
--
ALTER TABLE `qua_trinh_cong_tac`
  ADD CONSTRAINT `qua_trinh_cong_tac_ibfk_3` FOREIGN KEY (`ma_nhan_vien`) REFERENCES `nhan_vien` (`ma_nhan_vien`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `qua_trinh_cong_tac_ibfk_4` FOREIGN KEY (`ma_phong_ban`) REFERENCES `phong_ban` (`mapb`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `qua_trinh_cong_tac_ibfk_5` FOREIGN KEY (`ma_chuc_vu`) REFERENCES `chuc_vu` (`chucvu_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`TenDangNhap`) REFERENCES `nhan_vien` (`ma_nhan_vien`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
