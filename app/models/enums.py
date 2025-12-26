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

class VaiTro(str, enum.Enum):
    TGD = "tonggiamdoc"
    GDCN = "giamdoc_cn"
    TP = "truongphong"
    NV = "nhanvien"