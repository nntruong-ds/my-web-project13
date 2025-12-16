from sqlalchemy import Column, String, Enum
from app.configs.database import Base
import enum

class RoleEnum(str, enum.Enum):
    tonggiamdoc = "tonggiamdoc"
    giamdoc_cn = "giamdoc_cn"
    truongphong = "truongphong"
    nhanvien = "nhanvien"

class User(Base):
    __tablename__ = "users"

    TenDangNhap = Column(String(20), primary_key=True)
    MatKhau = Column(String(255), nullable=False)
    VaiTro = Column(Enum(RoleEnum), default="nhanvien")
    HoTen = Column(String(100))
    Email = Column(String(100))
    SoDienThoai = Column(String(20))
    DiaChi = Column(String(255))
