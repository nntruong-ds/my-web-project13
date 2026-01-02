from fastapi import APIRouter
from app.routers import employee_router
router = APIRouter()
router.include_router(employee_router.router)