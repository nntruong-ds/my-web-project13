import enum

class TrangThaiNhanVien(str, enum.Enum):
    DANG_LAM = "Đang làm"
    DA_NGHI = "Đã nghỉ"
    NGHI_PHEP = "Nghỉ phép"

class TrangThaiChamCong(str, enum.Enum):
    DI_LAM = "Đi làm"
    NGHI_PHEP = "Nghỉ phép"
    NGHI_KHONG_PHEP = "Nghỉ không phép"
    LAM_THEM = "Làm thêm"

# class VaiTroEnum(str, enum.Enum):
#     TONG_GIAM_DOC = "tonggiamdoc"
#     GIAM_DOC_CN = "giamdoc_cn"
#     TRUONG_PHONG = "truongphong"
#     NHAN_VIEN = "nhanvien"