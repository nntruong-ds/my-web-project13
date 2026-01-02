from sqlalchemy import Column, String, Enum

from app.configs.database import Base
from app.models.enums import VaiTro

class User(Base):
    __tablename__ = "users"

    # Map tên cột chính xác với SQL
    username = Column("TenDangNhap", String(20), primary_key=True) 
    password = Column("MatKhau", String(255), nullable=False)
    role = Column("VaiTro", Enum(VaiTro, values_callable=lambda obj: [e.value for e in obj]),    # Gọi các giá trị đã cài đặt trong enums để gửi về database
                        nullable=False,
                        default=VaiTro.NV,
                        server_default=VaiTro.NV.value)
