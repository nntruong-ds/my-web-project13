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

class TrangThaiBHXH(str, enum.Enum):
    HOAT_DONG = "hoat_dong"
    TAM_NGUNG = "tam_ngung"

class TrangThaiBHYT(str, enum.Enum):
    HOAT_DONG = "hoat_dong"
    HET_HAN = "het_han"

class TrangThaiKPI(str, enum.Enum):
    DAT = "dat"
    KHONG_DAT = "khong_dat"
    DANG_DANH_GIA = "dang_danh_gia"

class ThuongPhat(str, enum.Enum):
    KHEN_THUONG = "Khen thưởng"
    KY_LUAT = "Kỷ luật"