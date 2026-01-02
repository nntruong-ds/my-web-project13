import smtplib
from email.mime.text import MIMEText

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_ADDRESS = "23001568@hus.edu.vn"
EMAIL_PASSWORD = "zvtiubaeyimpibzh"

def send_reset_email(to_email: str, otp: str, debug: bool = False):
    subject = "OTP đặt lại mật khẩu"
    body = f"Mã OTP của bạn là: {otp}"

    if debug:
        print(f"[DEBUG] OTP gửi tới {to_email}: {otp}")
        return

    try:
        msg = MIMEText(body, "plain", "utf-8")
        msg["Subject"] = subject
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = to_email

        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.send_message(msg)

        print("✅ OTP đã được gửi thành công")

    except smtplib.SMTPException as e:
        print("❌ Gửi email thất bại:", e)
