from fastapi import APIRouter
from app.schemas.email_schema import EmailRequest
from app.services.email_service import send_email_service, inbox_service

router = APIRouter(prefix="/email", tags=["Email"])


@router.post("/send")
def send_email(data: EmailRequest):
    return send_email_service(data)


@router.get("/inbox")
def get_inbox():
    return inbox_service()
