from sqlalchemy import Column, String, Date, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.configs.database import Base

class BusinessTrip(Base):
    __tablename__ = "qua_trinh_cong_tac"

    # Định nghĩa 4 cột làm Khóa chính (Composite Primary Key) theo đúng SQL của bạn
    ma_nhan_vien = Column(String(20), ForeignKey("nhan_vien.ma_nhan_vien"), primary_key=True)
    phong_ban_id = Column(String(20), ForeignKey("phong_ban.mapb"), primary_key=True)
    chuc_vu_id = Column("chuc_vu", String(11), ForeignKey("chuc_vu.chucvu_id"), primary_key=True)
    tu_ngay = Column(Date, primary_key=True)
    
    # Các cột dữ liệu khác
    den_ngay = Column(Date, nullable=True)
    chi_nhanh = Column(String(255), nullable=True)
    dia_diem = Column(String(20), nullable=True)   # Địa điểm cụ thể
    thang = Column("tháng", Integer, nullable=False)

    nhan_vien = relationship("Employee", lazy="joined")  
    phong_ban = relationship("Department", lazy="joined")
    chuc_vu = relationship("Position", lazy="joined")