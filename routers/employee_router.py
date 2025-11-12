from fastapi import APIRouter
from app.controllers import employee_controller

router = APIRouter()
router.include_router(employee_controller.router)
