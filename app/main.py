from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth_router, employee_router, email_router, cham_cong_router, salary_router, birthday_router, kpi_router, reward_router, cong_tac_router
from app.configs.database import init_db

app = FastAPI(title="Employee Management API")

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