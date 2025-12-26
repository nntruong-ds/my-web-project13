from sqlalchemy import Column, String, Integer, Date, ForeignKey, Enum
from sqlalchemy.orm import relationship

from app.configs.database import Base
from app.models.enums import TrangThaiNhanVien

class Employee(Base):
    __tablename__ = "nhan_vien"

    ma_nhan_vien = Column(String(20), primary_key=True, index=True)
    ho_ten = Column(String(100), nullable=False)
    email = Column(String(100), unique=True)
    phong_ban_id = Column(String(20), ForeignKey("phong_ban.mapb"))
    chuc_vu_id = Column(String(11), ForeignKey("chuc_vu.chucvu_id"), nullable=False)
    ngay_vao_lam = Column(Date)
    trang_thai = Column(Enum(TrangThaiNhanVien, values_callable=lambda obj: [e.value for e in obj]),    # Gọi các giá trị đã cài đặt trong enums để gửi về database
                        nullable=False,
                        default=TrangThaiNhanVien.DANG_LAM,
                        server_default=TrangThaiNhanVien.DANG_LAM.value)
    chinhanh_id = Column(Integer, ForeignKey("chi_nhanh.ma_chi_nhanh"), nullable=False)
    ngay_sinh = Column(Date, nullable=False)

    # Relationship: Nhân viên thuộc về 1 phòng ban
    phong_truc_thuoc = relationship("Department", back_populates="ds_nhan_vien", foreign_keys=[phong_ban_id])

    # Relationship: 1 trưởng phòng quản lý 1 phòng ban
    phong_quan_ly = relationship("Department", back_populates="truong_phong", foreign_keys="Department.truong_phong_id", uselist=False)

    # Relationship: 1 giám đốc quản lý 1 chi nhánh
    chi_nhanh_quan_ly = relationship("Branch", back_populates="giam_doc", foreign_keys="Branch.id_gdoc", uselist=False)

    # Relationship: Nhân viên thuộc về 1 chi nhánh
    chi_nhanh_lam_viec = relationship("Branch", back_populates="ds_nhan_vien", foreign_keys=[chinhanh_id])

    # Relationship 1-n: Một nhân viên có danh sách chấm công
    ds_cham_cong = relationship("Attendance", back_populates="nhan_vien")

    #Relationship: Một nhân viên có 1 chức vụ
    chuc_vu = relationship("Position", back_populates="ds_nhan_vien", foreign_keys=[chuc_vu_id])

    def __repr__(self):
        return f"<NhanVien(manv='{self.ma_nhan_vien}', ho_ten='{self.ho_ten}')>"