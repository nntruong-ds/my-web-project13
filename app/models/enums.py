import enum

class TrangThaiNhanVien(str, enum.Enum):
    DANG_LAM = "Đang làm"
    NGHI_PHEP = "Nghỉ phép"
    DA_NGHI = "Đã nghỉ"

# class VaiTroEnum(str, enum.Enum):
#     TONG_GIAM_DOC = "tonggiamdoc"
#     GIAM_DOC_CN = "giamdoc_cn"
#     TRUONG_PHONG = "truongphong"
#     NHAN_VIEN = "nhanvien"