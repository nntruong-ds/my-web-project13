from sqlalchemy import Column, String, Integer, Date, ForeignKey
from app.configs.database import Base

class Employee(Base):
    __tablename__ = "nhan_vien"

    ma_nhan_vien = Column(String(20), primary_key=True)
    ho_ten = Column(String(100))
    ngay_sinh = Column(Date, nullable=True)
    email = Column(String(100))
    phong_ban_id = Column(Integer, nullable=True)
    chuc_vu_id = Column(String(20))
    ngay_vao_lam = Column(Date)
    trang_thai = Column(String(50))
    chinhanh_id = Column(Integer)
