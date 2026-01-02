from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.configs.database import get_db
from app.services.birthday_service import get_upcoming_birthdays

router = APIRouter(prefix="/birthday", tags=["Birthday"])

@router.get("/upcoming")
def upcoming_birthdays(db: Session = Depends(get_db)):
    return get_upcoming_birthdays(db)
