import enum

class TrangThaiNhanVien(str, enum.Enum):
    DANG_LAM = "Đang làm"
    NGHI_PHEP = "Nghỉ phép"
    DA_NGHI = "Đã nghỉ"