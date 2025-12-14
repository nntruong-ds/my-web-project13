from app.schemas.email_schema import EmailRequest
from app.utils.email_utils import send_email, read_inbox

def send_email_service(data: EmailRequest):
    send_email(
        to_email=data.to_email,
        subject=data.subject,
        content=data.content
    )
    return {"message": "Email sent successfully"}


def inbox_service():
    emails = read_inbox()
    return {"emails": emails}
