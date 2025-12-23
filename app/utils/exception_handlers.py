from fastapi import Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import IntegrityError # Import lỗi của SQLAlchemy

# Hàm xử lý khi gặp ValueError (Lỗi dữ liệu/nghiệp vụ)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "status": "error",
            "message": str(exc) # Lấy nội dung lỗi từ Service bắn ra
        },
    )

# Xử lý lỗi Database (Ví dụ: Trùng lặp dữ liệu Unique)
async def database_error_handler(request: Request, exc: IntegrityError):
    # IntegrityError thường khó đọc, ta có thể log lại để debug
    print(f"DB Error: {exc}") 
    
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT, # 409: Xung đột dữ liệu
        content={
            "status": "error",
            "message": "Dữ liệu bị trùng lặp hoặc vi phạm ràng buộc hệ thống."
        },
    )

# Xử lý tất cả các lỗi còn lại (Lưới an toàn cuối cùng)
async def general_exception_handler(request: Request, exc: Exception):
    # Đây là nơi bắt các lỗi "trên trời rơi xuống" (IndexError, KeyError,...)
    print(f"Server Error: {exc}") # Nên dùng logging thay vì print trong thực tế

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "message": "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau."
        },
    )