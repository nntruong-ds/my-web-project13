from sqlalchemy import Column, String, Date, Time, Float, Integer, Enum, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship

from app.configs.database import Base
from app.models.enums import TrangThaiChamCong

class Attendance(Base):
    __tablename__ = "cham_cong"

    # Khóa chính
    ma_nhan_vien = Column(String(20), ForeignKey("nhan_vien.ma_nhan_vien"), primary_key=True)
    ngay = Column(Date, primary_key=True)

    gio_vao = Column(Time)
    gio_ra = Column(Time)
    so_gio_lam = Column(DECIMAL(4, 2), default=0)
    trang_thai = Column(Enum(TrangThaiChamCong, values_callable=lambda obj: [e.value for e in obj]),    # Gọi các giá trị đã cài đặt trong enums để gửi về database
                        nullable=False,
                        default=TrangThaiChamCong.DI_LAM,
                        server_default=TrangThaiChamCong.DI_LAM.value)
    so_gio_tang_ca = Column(Float, default=0)
    so_lan_di_muon_ve_som = Column(Integer, default=0)
    so_ngay_da_nghi_phep = Column(Integer, default=0)

    # Relationship ngược về nhân viên
    nhan_vien = relationship("Employee", back_populates="ds_cham_cong")

    # Lấy tên nhân viên
    @property
    def ten_nhan_vien(self):
        return self.nhan_vien.ho_ten if self.nhan_vien else None