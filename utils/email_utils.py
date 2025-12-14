import smtplib
import imaplib
import email
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

IMAP_SERVER = "imap.gmail.com"

EMAIL_ADDRESS = "your_email@gmail.com"
APP_PASSWORD = "xxxx xxxx xxxx xxxx"  # App password Gmail


# ---------------- GỬI EMAIL ---------------- #
def send_email(to_email, subject, content):
    msg = MIMEMultipart()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(content, "html"))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(EMAIL_ADDRESS, APP_PASSWORD)
        server.sendmail(EMAIL_ADDRESS, to_email, msg.as_string())

    return True


# ---------------- ĐỌC EMAIL (INBOX) ---------------- #
def read_inbox(limit=15):
    mail = imaplib.IMAP4_SSL(IMAP_SERVER)
    mail.login(EMAIL_ADDRESS, APP_PASSWORD)
    mail.select("inbox")

    status, data = mail.search(None, "ALL")
    mail_ids = data[0].split()

    emails = []

    for msg_id in mail_ids[-limit:]:
        status, msg_data = mail.fetch(msg_id, "(RFC822)")
        raw_email = msg_data[0][1]
        msg = email.message_from_bytes(raw_email)

        emails.append({
            "from": msg["From"],
            "subject": msg["Subject"],
            "body": extract_body(msg)
        })

    return emails


# ---------------- HỖ TRỢ LẤY NỘI DUNG EMAIL ---------------- #
def extract_body(msg):
    if msg.is_multipart():
        for part in msg.walk():
            content_type = part.get_content_type()
            if content_type == "text/plain":
                return part.get_payload(decode=True).decode()
            if content_type == "text/html":
                return part.get_payload(decode=True).decode()
    else:
        return msg.get_payload(decode=True).decode()

    return "(Không thể đọc nội dung)"
