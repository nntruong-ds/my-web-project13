from fastapi import FastAPI
from Backend.routers import auth_router
from Backend.configs.database import Base, engine
app = FastAPI()

# Tạo bảng
Base.metadata.create_all(bind=engine)

# Đăng ký router
app.include_router(auth_router.router)

@app.get("/")
def home():
    return {"msg": "Welcome to Employee Management API"}
