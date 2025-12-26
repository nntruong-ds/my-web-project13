from pydantic import BaseModel, Field

from app.models.enums import VaiTro

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=20)
    role: VaiTro = VaiTro.NV

# Dùng khi tạo tài khoản (Cần mật khẩu)
class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

# Dùng khi đăng nhập
class UserLogin(BaseModel):
    username: str
    password: str

# Quên mật khẩu
class ForgotPasswordRequest(BaseModel):
    username: str
    email: str # Email để đối chiếu

# Reset password sau khi lấy được token từ quên mật khẩu
class ResetPasswordRequest(BaseModel):
    token: str # Mã token nhận được qua email
    new_password: str = Field(..., min_length=6)

# Đổi mật khẩu
class ChangePasswordRequest(BaseModel):
    old_password: str = Field(..., description="Mật khẩu hiện tại")
    new_password: str = Field(..., min_length=6, description="Mật khẩu mới (tối thiểu 6 ký tự)")

# Dùng để trả về (TUYỆT ĐỐI KHÔNG TRẢ VỀ MẬT KHẨU)
class UserResponse(UserBase):
    class Config:
        from_attributes = True