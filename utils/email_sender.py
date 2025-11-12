import smtplib
from email.mime.text import MIMEText

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
EMAIL_ADDRESS = "your_email@gmail.com"
EMAIL_PASSWORD = "your_email_password"

def send_reset_email(to_email: str, otp: str, debug: bool = True):
    """
    Gửi OTP tới email.
    Nếu debug=True thì in ra console thay vì gửi thật
    """
    if debug:
        print(f"[DEBUG] OTP gửi tới {to_email}: {otp}")
        return

    subject = "OTP đặt lại mật khẩu"
    body = f"Mã OTP của bạn là: {otp}"
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email

    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
    server.sendmail(EMAIL_ADDRESS, to_email, msg.as_string())
    server.quit()
