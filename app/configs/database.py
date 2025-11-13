from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()  # Đọc file .env

DATABASE_URL = os.getenv("DATABASE_URL")

# DATABASE_URL= "sqlite:///./test.db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Tạo session mới cho mỗi request
def get_db():
    db = SessionLocal()     # Mở
    try:
        yield db
    finally:
        db.close()          # Đóng
