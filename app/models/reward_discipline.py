from sqlalchemy import Column, String, Date, Integer, ForeignKey, Enum, Float, Text
from sqlalchemy.orm import relationship
from app.configs.database import Base
from app.models.enums import ThuongPhat

class RewardDiscipline(Base):
    __tablename__ = "khen_thuong_ky_luat"

    id = Column(Integer, primary_key=True, index=True) 
    
    # Các cột dữ liệu
    ma_nhan_vien = Column(String(20), ForeignKey("nhan_vien.ma_nhan_vien"))
    loai = Column(Enum(ThuongPhat, values_callable=lambda obj: [e.value for e in obj]), nullable=False)
    ngay = Column(Date, nullable=False)
    hinh_thuc = Column(String(100))
    ly_do = Column(Text)
    so_tien = Column(Float(15, 2), nullable=False)
    
    # Relationship
    nhan_vien = relationship("Employee", lazy="joined")

    # Property hiển thị
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