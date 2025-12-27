from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.configs.database import Base

class Branch(Base):
    __tablename__ = "chi_nhanh"

    ma_chi_nhanh = Column(Integer, primary_key=True, index=True)
    ten_chi_nhanh = Column(String(100), nullable=False)
    dia_chi = Column(String(255))
    so_dien_thoai = Column(String(15))
    email = Column(String(100))
    id_gdoc = Column("ID_gdoc", String(20), ForeignKey("nhan_vien.ma_nhan_vien"))
    ngay_thanh_lap = Column(Date)

    # Relationship: Một chi nhánh có 1 Giám đốc
    giam_doc = relationship("Employee", back_populates="chi_nhanh_quan_ly", foreign_keys=[id_gdoc], lazy="joined")

    @property
    def ten_giam_doc(self):
        # Kiểm tra: Nếu có giám đốc thì trả về tên, nếu không (None) thì trả về None
        return self.giam_doc.ho_ten if self.giam_doc else None
    
    @property
    def gioi_tinh_giam_doc(self):
        return self.giam_doc.gioi_tinh if self.giam_doc else None

    # Relationship 1-nhiều (1 chi nhánh có nhiều nhân viên)
    ds_nhan_vien = relationship("Employee", back_populates="chi_nhanh_lam_viec", foreign_keys="Employee.chinhanh_id")

    @property
    def so_luong_nhan_vien(self):
        return len(self.ds_nhan_vien)

    # Relationship 1-nhiều (1 chi nhánh có nhiều phòng ban)
    ds_phong_ban = relationship("Department", back_populates="chi_nhanh_truc_thuoc", foreign_keys="Department.ma_cn")

    @property
    def so_luong_phong_ban(self):
        return len(self.ds_phong_ban)

    def __repr__(self):
        return f"<ChiNhanh(id={self.ma_chi_nhanh}, ten='{self.ten_chi_nhanh}')>"