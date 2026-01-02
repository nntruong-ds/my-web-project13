from sqlalchemy import Column, String, Integer, ForeignKey, Float, DECIMAL, Computed
from sqlalchemy.orm import relationship
from app.configs.database import Base

class Salary(Base):
    __tablename__ = "luong"

    # Khóa chính phức hợp 3 cột (Mỗi nhân viên 1 tháng chỉ có 1 bảng lương)
    ma_nhan_vien = Column(String(20), ForeignKey("nhan_vien.ma_nhan_vien"), primary_key=True)
    thang = Column(Integer, primary_key=True)
    nam = Column(Integer, primary_key=True)
    
    # Các khoản thu nhập
    luong_co_ban = Column(DECIMAL(15, 2), default=0)
    phu_cap = Column(DECIMAL(15, 2), default=0)
    thuong = Column(DECIMAL(15, 2), default=0)
    he_so_luong = Column(Integer, default=1)
    
    # Các khoản nợ/phạt/khấu trừ
    luong_no_thang_truoc = Column(Float(15, 2), default=0)
    bhyt = Column(Float, default=0)
    bhxh = Column(Float, default=0)
    phat = Column(Float, default=0)
    
    # Tổng lương thực nhận
    tong_luong = Column(DECIMAL(15, 2))

    # Relationship
    nhan_vien = relationship("Employee", lazy="joined", back_populates="ds_luong", foreign_keys=[ma_nhan_vien])
    
    # Property lấy thông tin hiển thị cho danh sách
    @property
    def ten_nhan_vien(self):
        return self.nhan_vien.ho_ten if self.nhan_vien else None
    
    @property
    def ten_phong_ban(self):
        if self.nhan_vien and self.nhan_vien.phong_truc_thuoc:
            return self.nhan_vien.phong_truc_thuoc.ten_phong 
        return None

    @property
    def ten_chuc_vu(self):
        if self.nhan_vien and self.nhan_vien.chuc_vu:
             return self.nhan_vien.chuc_vu.ten_chuc_vu 
        return "N/A"