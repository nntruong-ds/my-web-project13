from fastapi import FastAPI
from app.routers import auth_router, employee_router, email_router, cham_cong_router, salary_router, birthday_router
from app.configs.database import init_db

app = FastAPI(title="Employee Management API")

init_db()

# Auth
app.include_router(auth_router.router, prefix="/auth")

# Employees
app.include_router(employee_router.router)

# Sinh nhật
app.include_router(birthday_router.router)

# Email
app.include_router(email_router.router)

# Chấm công
app.include_router(cham_cong_router.router)

# Salary
app.include_router(salary_router.router)

