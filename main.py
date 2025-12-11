from fastapi import FastAPI
from app.routers import auth_router, employee_router
from app.configs.database import init_db

# Khởi tạo app FastAPI
app = FastAPI(title="Employee Management API")

# Khởi tạo database
init_db()

# Include router
app.include_router(auth_router.router, prefix="/auth")
app.include_router(employee_router.router)
