from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, Session
from fastapi import Depends

# MySQL localhost, không password
DATABASE_URL = "mysql+pymysql://root:@localhost:3306/mywebfinal"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Khởi tạo DB
def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Kết nối database 'myweb' thành công và tạo bảng nếu chưa có!")
    except Exception as e:
        print("❌ Lỗi kết nối database:", e)

# Dependency để dùng trong controller
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
