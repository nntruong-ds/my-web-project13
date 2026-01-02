from pydantic import BaseModel

class InternalEmailRequest(BaseModel):
    receiver_ma_nv: str
    subject: str
    content: str
