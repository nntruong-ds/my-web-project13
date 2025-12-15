import uvicorn
from fastapi import FastAPI
from app.configs.database import init_db
from app.routers import department_router, employee_router, branch_router

app = FastAPI(title="Hệ thống Quản lý Nhân sự")

# Khởi tạo DB (tạo bảng nếu chưa có)
init_db()

# Đăng ký router
app.include_router(department_router.router)
app.include_router(employee_router.router)
app.include_router(branch_router.router)

@app.get("/")
def root():
    return {"message": "Chao mung ban den voi He thong quan ly nhan su cua chung ta"}

# Cấu hình chạy server (nếu chạy trực tiếp file này)
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)