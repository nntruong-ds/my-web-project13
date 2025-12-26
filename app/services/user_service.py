from sqlalchemy.orm import Session
import secrets

from app.models.user import User
from app.schemas.user_schema import *
from app.utils.security import SecurityUtils
from app.utils.jwt_handler import JWTUtils
from app.services.employee_service import EmployeeService
from app.models.employee import Employee

class UserService:
    # Tạo user mới
    @staticmethod
    def create_user(db: Session, user: UserCreate):
        # Check trùng tên đăng nhập
        existing_user = db.query(User).filter(User.username == user.username).first()
        if existing_user:
            raise ValueError("Tên đăng nhập đã tồn tại!")

        # Mã hóa mật khẩu
        hashed_pw = SecurityUtils.get_password_hash(user.password)

        # Lưu vào DB
        db_user = User(
            username=user.username,
            password=hashed_pw, # Lưu cái đã mã hóa
            role=user.role
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    # Xác thực
    @staticmethod
    def authenticate(db: Session, login_data: UserLogin):
        # Tìm user theo tên đăng nhập
        user = db.query(User).filter(User.username == login_data.username).first()
        
        # Nếu không tìm thấy user
        if not user:
            return None
        
        # Kiểm tra mật khẩu (So sánh hash)
        if not SecurityUtils.verify_password(login_data.password, user.password):
            return None
            
        return user
    
    # Quên mật khẩu
    @staticmethod
    def forgot_password(db: Session, data: ForgotPasswordRequest):
        # Tìm trong bảng User xem username có tồn tại không
        user = db.query(User).filter(User.username == data.username).first()
        if not user:
            raise ValueError("Tài khoản không tồn tại!")
        
        # LOGIC KẾT NỐI: User -> NhanVien
        # Quy tắc: username (nv001) <-> ma_nhan_vien (NV001)
        manv = data.username.upper() # Chuyển về chữ hoa
        
        employee = EmployeeService.get_employee_orm(db, manv)
        
        # Kiểm tra tính hợp lệ
        if not employee:
            raise ValueError(f"Không tìm thấy hồ sơ nhân viên cho mã {manv}")
            
        if not employee.email:
             raise ValueError("Nhân viên này chưa cập nhật Email trong hồ sơ!")

        # Đối chiếu Email người dùng nhập với Email trong hồ sơ (Bảo mật)
        if employee.email.strip().lower() != data.email.strip().lower():
            raise ValueError("Email cung cấp không khớp với hồ sơ nhân viên!")

        # Tạo Token chứa username và sẽ hết hạn sau 30p
        reset_token = JWTUtils.create_access_token(subject=user.username)
        
        # Giả lập gửi Email
        print(f"=== GỬI EMAIL ĐẾN: {employee.email} ===")
        print(f"Click vào link sau để reset: https://hrms.com/reset?token={reset_token}")
        print(f"Token (Copy để test): {reset_token}")

        return {"message": "Mã xác thực đã được gửi vào email hồ sơ!"}
    
    # Reset password
    @staticmethod
    def reset_password(db: Session, data: ResetPasswordRequest):
        # Giải mã Token xem có hợp lệ/hết hạn không
        payload = JWTUtils.verify_token(data.token)
        if not payload:
            raise ValueError("Token không hợp lệ hoặc đã hết hạn")
        
        username_in_token = payload.get("sub")

        # Tìm user trong DB
        user = db.query(User).filter(User.username == username_in_token).first()
        if not user:
            raise ValueError("User trong token không tồn tại")

        # Cập nhật mật khẩu mới
        new_hashed_pass = SecurityUtils.get_password_hash(data.new_password)
        user.password = new_hashed_pass
        
        db.commit()
        return {"message": "Mật khẩu đã được đặt lại thành công"}
    
    # Đổi mật khẩu
    @staticmethod
    def change_password(db: Session, username: str, data: ChangePasswordRequest):
        # Tìm user
        user = db.query(User).filter(User.username == username).first()
        if not user:
            raise ValueError("Tài khoản không tồn tại!")

        # Kiểm tra mật khẩu cũ
        if not SecurityUtils.verify_password(data.old_password, user.password):
            raise ValueError("Mật khẩu cũ không chính xác!")

        # Cập nhật mật khẩu mới (Nhớ Hash trước khi lưu!)
        user.password = SecurityUtils.get_password_hash(data.new_password)
        
        db.commit()
        return {"message": "Đổi mật khẩu thành công!"}