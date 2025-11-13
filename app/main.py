from fastapi import FastAPI
from app.routers import department_router

# === PHẦN SỬA LỖI BẮT ĐẦU ===
from app.configs.database import engine, Base

# 1. Import TẤT CẢ các module model của bạn
#    để Base.metadata "biết" về chúng TRƯỚC KHI tạo bảng.
from app.models import department  # <-- Đảm bảo import file model ở đây
# from app.models import user      # <-- Và bất kỳ model nào khác (nếu có)

# 2. Ra lệnh tạo bảng
#    Lệnh này sẽ tạo các bảng (như 'phong_ban') nếu chúng chưa tồn tại.
Base.metadata.create_all(bind=engine)
# === PHẦN SỬA LỖI KẾT THÚC ===

app = FastAPI(title="Hệ thống Quản lý Nhân sự")

app.include_router(department_router.router)

@app.get("/")
def home():
    return {"message": "Chao mung ban den voi He thong quan ly nhan su cua chung ta"}