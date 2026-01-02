import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_router, employee_router, email_router, cham_cong_router, salary_router, birthday_router, kpi_router, reward_router, cong_tac_router
from app.configs.database import init_db
from app.routers import (
    department_router,
    employee_router,
    branch_router,
    attendance_router,
    position_router,
    user_router,
    business_trip_router,
    social_insurance_router,
    health_insurance_router,
    kpi_router,
    salary_router,
    reward_discipline_router
)

app = FastAPI(title="Employee Management API")

# 1. Bắt ValueError (Logic sai)
app.add_exception_handler(ValueError, value_error_handler)

# 2. Bắt IntegrityError (Lỗi DB - Trùng lặp)
app.add_exception_handler(IntegrityError, database_error_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

# Auth
app.include_router(auth_router.router, prefix="/auth")

# Employees
app.include_router(employee_router.router)

# Sinh nhật
app.include_router(birthday_router.router)

# Email
app.include_router(email_router.router)

# Attendance (Chấm công)
app.include_router(cham_cong_router.router)

# Salary
app.include_router(salary_router.router)

# KPI
app.include_router(kpi_router.router)

# Thưởng
app.include_router(reward_router.router)

# Công tác
app.include_router(cong_tac_router.router)

app.include_router(department_router.router)
app.include_router(employee_router.router)
app.include_router(branch_router.router)
app.include_router(attendance_router.router)
app.include_router(position_router.router)
app.include_router(user_router.router)
app.include_router(business_trip_router.router)
app.include_router(social_insurance_router.router)
app.include_router(health_insurance_router.router)
app.include_router(kpi_router.router)
app.include_router(reward_discipline_router.router)

@app.get("/")
def root():
    return {"message": "Chao mung ban den voi He thong quan ly nhan su cua chung ta"}

# Cấu hình chạy server (nếu chạy trực tiếp file này)
if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
