import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.configs.database import init_db
from app.routers import department_router, employee_router, branch_router, attendance_router, position_router, user_router, business_trip_router
from sqlalchemy.exc import IntegrityError
from app.utils.exception_handlers import (
    value_error_handler, 
    database_error_handler, 
    general_exception_handler
)

app = FastAPI(title="Hệ thống Quản lý Nhân sự")

# ĐĂNG KÝ GLOBAL HANDLER
# 1. Bắt ValueError (Logic sai)
app.add_exception_handler(ValueError, value_error_handler)

# 2. Bắt IntegrityError (Lỗi DB - Trùng lặp)
app.add_exception_handler(IntegrityError, database_error_handler)

# 3. Bắt tất cả lỗi còn lại (Exception là cha của mọi lỗi)
app.add_exception_handler(Exception, general_exception_handler)

# Khởi tạo DB (tạo bảng nếu chưa có)
init_db()

# Đăng ký router
app.include_router(department_router.router)
app.include_router(employee_router.router)
app.include_router(branch_router.router)
app.include_router(attendance_router.router)
app.include_router(position_router.router)
app.include_router(user_router.router)
app.include_router(business_trip_router.router)

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://192.168.0.101:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Chao mung ban den voi He thong quan ly nhan su cua chung ta"}

# Cấu hình chạy server (nếu chạy trực tiếp file này)
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)