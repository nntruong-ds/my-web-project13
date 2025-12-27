from sqlalchemy import Column, String, Date, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship

from app.configs.database import Base
from app.models.enums import TrangThaiBHXH

class SocialInsurance(Base):
    __tablename__ = "bao_hiem_xa_hoi"

    # Khóa chính 3 cột
    ma_nhan_vien = Column(String(20), ForeignKey("nhan_vien.ma_nhan_vien"), primary_key=True)
    so_so_bhxh = Column(String(50), primary_key=True)
    thang_nam = Column(Date, primary_key=True) # Lưu ngày (thường là ngày đầu tháng)
    
    trang_thai = Column(Enum(TrangThaiBHXH, values_callable=lambda obj: [e.value for e in obj]),    # Gọi các giá trị đã cài đặt trong enums để gửi về database
                        nullable=False,
                        default=TrangThaiBHXH.HOAT_DONG,
                        server_default=TrangThaiBHXH.HOAT_DONG.value)
    thang = Column(Integer, nullable=False) # Lưu số tháng (1-12)

    # Relationship để lấy tên nhân viên (dùng lazy='joined' cho nhanh)
    nhan_vien = relationship("Employee", foreign_keys=[ma_nhan_vien],lazy="joined")

    @property
    def ten_nhan_vien(self):
        """
        Tự động lấy tên từ relationship nhan_vien.
        Nếu không tìm thấy nhân viên (null), trả về chuỗi mặc định.
        """
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