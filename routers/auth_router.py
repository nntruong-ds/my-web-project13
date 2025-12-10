from fastapi import APIRouter
from app.controllers import auth_controller

router = APIRouter(prefix="/auth", tags=["Auth"])
router.include_router(auth_controller.router)
