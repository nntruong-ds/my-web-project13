from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.configs.database import Base

class Department(Base):
    __tablename__ = "phong_ban"

    mapb = Column(String(20), primary_key=True, index=True)
    ten_phong = Column(String(100), nullable=False)
    truong_phong_id = Column(String(11), ForeignKey("nhan_vien.ma_nhan_vien"), unique=True)
    ngay_tao = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    ma_cn = Column(Integer, ForeignKey("chi_nhanh.ma_chi_nhanh"),nullable=False)

    # Relationship 1-nhiều (1 phòng ban có nhiều nhân viên)
    ds_nhan_vien = relationship("Employee", back_populates="phong_truc_thuoc", foreign_keys="Employee.phong_ban_id")

    # Tạo thuộc tính ảo số lượng nhân viên
    @property
    def so_luong_nhan_vien(self):
        return len(self.ds_nhan_vien)

    # Relationship 1 phòng ban được quản lý bởi 1 trưởng phòng
    truong_phong = relationship("Employee", back_populates="phong_quan_ly", foreign_keys=[truong_phong_id], lazy="joined")

    # Lấy tên trưởng phòng nếu có
    @property
    def ten_truong_phong(self):
        return self.truong_phong.ho_ten if self.truong_phong else None

    # Relationship: Phòng ban thuộc về 1 chi nhánh
    chi_nhanh_truc_thuoc = relationship("Branch", back_populates="ds_phong_ban", foreign_keys=[ma_cn])

    # Lấy tên chi nhánh
    @property
    def ten_chi_nhanh(self):
        return self.chi_nhanh_truc_thuoc.ten_chi_nhanh

    def __repr__(self):
        return f"<PhongBan(mapb='{self.mapb}', ten_phong='{self.ten_phong}')>"