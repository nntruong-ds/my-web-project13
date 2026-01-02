from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.email_schema import InternalEmailRequest
from app.services.email_service import (
    send_internal_email_service,
    inbox_service,
    mark_as_read_service,
    sent_items_service
)
from app.utils.deps import get_current_user
from app.configs.database import get_db

router = APIRouter(
    prefix="/email",
    tags=["Email nội bộ"]
)

# ===============================
# GỬI EMAIL NỘI BỘ
# ===============================
@router.post("/send-internal")
def send_internal_email(
    data: InternalEmailRequest,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return send_internal_email_service(data, current_user, db)


@router.get("/sent")
def get_sent_items(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return sent_items_service(current_user, db)


# ===============================
# INBOX NHÂN VIÊN
# ===============================
@router.get("/inbox")
def get_inbox(
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return inbox_service(current_user, db)


# ===============================
# ĐÁNH DẤU ĐÃ ĐỌC
# ===============================
@router.put("/read/{email_id}")
def mark_as_read(
    email_id: int,
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return mark_as_read_service(email_id, current_user, db)



