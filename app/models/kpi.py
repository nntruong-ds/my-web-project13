from sqlalchemy import Column, String, Integer, ForeignKey, Enum, Float, Text, DECIMAL, Computed
from sqlalchemy.orm import relationship

from app.configs.database import Base
from app.models.enums import TrangThaiKPI

class EmployeeKPI(Base):
    __tablename__ = "kpi_nhan_vien"

    # Khóa chính phức hợp 3 cột
    ma_nhan_vien = Column(String(20), ForeignKey("nhan_vien.ma_nhan_vien"), primary_key=True)
    ten_kpi = Column(String(150), primary_key=True)
    ky_danh_gia = Column(String(50), primary_key=True)
    
    muc_tieu = Column(DECIMAL(10, 2))
    thuc_te = Column(DECIMAL(10, 2))
    don_vi_tinh = Column(String(50))
    ty_le_hoan_thanh = Column(Float, Computed("(CASE WHEN muc_tieu > 0 THEN (thuc_te / muc_tieu) * 100 ELSE NULL END)"), nullable=True)
    ghi_chu = Column(Text)
    trang_thai = Column(Enum(TrangThaiKPI, values_callable=lambda obj: [e.value for e in obj]),    # Gọi các giá trị đã cài đặt trong enums để gửi về database
                        nullable=False,
                        default=TrangThaiKPI.DANG_DANH_GIA,
                        server_default=TrangThaiKPI.DANG_DANH_GIA.value)
    thang = Column(Integer)
    nam = Column(Integer)

    # Relationship
    nhan_vien = relationship("Employee", foreign_keys=[ma_nhan_vien], lazy="joined")

    @property
    def ten_nhan_vien(self):
        return self.nhan_vien.ho_ten if self.nhan_vien else None
    
    @property
    def ten_phong_ban(self):
        if self.nhan_vien and self.nhan_vien.phong_truc_thuoc:
            return self.nhan_vien.phong_truc_thuoc.ten_phong 
        return None

    @property
    def ten_chi_nhanh(self):
        if self.nhan_vien and self.nhan_vien.chi_nhanh_lam_viec:
            return self.nhan_vien.chi_nhanh_lam_viec.ten_chi_nhanh 
        return None