from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.configs.database import Base

class Department(Base):
    __tablename__ = "phong_ban"

    mapb = Column(String(20), primary_key=True, index=True)
    ten_phong = Column(String(100), nullable=False)
    truong_phong_id = Column(String(11), ForeignKey("nhan_vien.ma_nhan_vien"), unique=True)
    ngay_tao = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    ma_cn = Column(Integer, nullable=False)

    ds_nhan_vien = relationship("Employee", back_populates="phong_truc_thuoc", foreign_keys="Employee.phong_ban_id")

    truong_phong = relationship("Employee", back_populates="phong_quan_ly", foreign_keys=[truong_phong_id], lazy="joined")

    def __repr__(self):
        return f"<PhongBan(mapb='{self.mapb}', ten_phong='{self.ten_phong}')>"