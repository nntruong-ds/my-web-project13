from fastapi import FastAPI
from app.routers import department_router
from app.configs.database import engine, Base
from app.models import department

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Hệ thống Quản lý Nhân sự")

app.include_router(department_router.router)

@app.get("/")
def home():
    return {"message": "Chao mung ban den voi He thong quan ly nhan su cua chung ta"}