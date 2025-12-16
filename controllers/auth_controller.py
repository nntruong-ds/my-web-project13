from fastapi import APIRouter
from app.routers import auth_router

router = APIRouter(prefix="/auth", tags=["Auth"])
router.include_router(auth_router.router)
