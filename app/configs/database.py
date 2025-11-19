from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv


load_dotenv()  # Đọc file .env

DATABASE_URL = os.getenv("DATABASE_URL")

# Test API
# DATABASE_URL= "sqlite:///./test.db"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Khởi tạo DB
def init_db():
    try:
        from app.models.department import Department
        from app.models.employee import Employee

        Base.metadata.create_all(bind=engine)
        print("✅ Kết nối database thành công và tạo bảng nếu chưa có!")
    except Exception as e:
        print("❌ Lỗi kết nối database:", e)

# Tạo session mới cho mỗi request
def get_db():
    db = SessionLocal()     # Mở
    try:
        yield db
    finally:
        db.close()          # Đóng
