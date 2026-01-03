import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./css/guiemail.css";
import axios from "axios";

export default function GuiEmail() {
    const { ma_nhan_vien } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const defaultEmail = params.get("to") || "";

    const [activeTab, setActiveTab] = useState("compose");
    const [toEmail, setToEmail] = useState(defaultEmail);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [popup, setPopup] = useState(null);

    const [emails, setEmails] = useState([]);
    const [sentEmails, setSentEmails] = useState([]);
    const [selectedMail, setSelectedMail] = useState(null);

    const token = localStorage.getItem("access_token");
    const unreadCount = emails.filter(m => m.is_read === 0).length;

    const loadInbox = async () => {
        try {
            const res = await axios.get(
                "http://127.0.0.1:8000/email/inbox",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setEmails(res.data?.emails || []);
        } catch (err) {
            console.error(err);
            setEmails([]);
        }
    };

    /* ===== LOAD SENT ===== */
    const loadSent = async () => {
        try {
            const res = await axios.get(
                "http://127.0.0.1:8000/email/sent",
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSentEmails(res.data?.emails || []);
        } catch (err) {
            console.error(err);
            setSentEmails([]);
        }
    };

    useEffect(() => {
        loadInbox();
    }, []);

    useEffect(() => {
        if (activeTab === "inbox") loadInbox();
        if (activeTab === "sent") loadSent();
    }, [activeTab]);

    /* ===== SEND MAIL ===== */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!toEmail || !title || !content) {
            setPopup({ type: "error", message: "Vui lòng nhập đủ thông tin" });
            return;
        }

        try {
            await axios.post(
                "http://127.0.0.1:8000/email/send-internal",
                {
                    receiver_ma_nv: toEmail,
                    subject: title,
                    content
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setPopup({ type: "success", message: "Gửi thành công!" });
            setTitle("");
            setContent("");
            setActiveTab("sent");
            loadSent();
        } catch (err) {
            setPopup({
                type: "error",
                message: err.response?.data?.detail || "Không thể gửi"
            });
        }
    };

    /* ===== OPEN MAIL ===== */
    const openMail = async (mail) => {
        setSelectedMail(mail);

        if (activeTab === "inbox" && mail.is_read === 0) {
            try {
                await axios.put(
                    `http://127.0.0.1:8000/email/read/${mail.id}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                loadInbox();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="gmail-page">
            {/* ===== HEADER ===== */}
            <div className="gmail-header">
                <button onClick={() => navigate(`/employee/${ma_nhan_vien}`)}>
                    ←
                </button>
                <h2>HỘP THƯ NỘI BỘ</h2>
            </div>

            <div className="gmail-body">
                {/* ===== SIDEBAR ===== */}
                <div className="gmail-sidebar">
                    <button onClick={() => setActiveTab("compose")}>
                        ✍️ Soạn tin
                    </button>

                    <button onClick={() => setActiveTab("inbox")}>
                        📥 Inbox
                        {unreadCount > 0 && (
                            <span className="unread-badge">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    <button onClick={() => setActiveTab("sent")}>
                        📤 Đã gửi
                    </button>
                </div>

                {/* ===== CONTENT ===== */}
                <div className="gmail-content">
                    {/* ===== COMPOSE ===== */}
                    {activeTab === "compose" && (
                        <div className="compose-box">
                            <h3>Soạn tin nhắn</h3>

                            <form onSubmit={handleSubmit}>
                                <label>Mã người nhận *</label>
                                <input
                                    value={toEmail}
                                    onChange={(e) => setToEmail(e.target.value)}
                                />

                                <label>Tiêu đề *</label>
                                <input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />

                                <label>Nội dung *</label>
                                <textarea
                                    rows="6"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />

                                <button type="submit" className="send-btn">
                                    Gửi
                                </button>
                            </form>
                        </div>
                    )}

                    {/* ===== INBOX ===== */}
                    {activeTab === "inbox" && (
                        <div className="inbox-list">
                            {emails.length === 0 && (
                                <p className="empty">Inbox trống</p>
                            )}

                            {emails.map((m) => (
                                <div
                                    key={m.id}
                                    className={`mail-item ${m.is_read ? "read" : "unread"}`}
                                    onClick={() => openMail(m)}
                                >
                                    <div className="mail-header">
                                        <span className="mail-subject">
                                            {m.subject}
                                        </span>
                                        <span className="mail-time">
                                            {m.time}
                                        </span>
                                    </div>

                                    <div className="mail-content">
                                        {m.content.length > 80
                                            ? m.content.slice(0, 80) + "..."
                                            : m.content}
                                    </div>

                                    <div className="mail-footer">
                                        Từ: <b>{m.from}</b>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* ===== SENT ===== */}
                    {activeTab === "sent" && (
                        <div className="inbox-list">
                            {sentEmails.length === 0 && (
                                <p className="empty">Chưa gửi email nào</p>
                            )}

                            {sentEmails.map((m) => (
                                <div
                                    key={m.id}
                                    className="mail-item read"
                                    onClick={() => openMail(m)}
                                >
                                    <div className="mail-header">
                                        <span className="mail-subject">
                                            {m.subject}
                                        </span>
                                        <span className="mail-time">
                                            {m.time}
                                        </span>
                                    </div>

                                    <div className="mail-content">
                                        {m.content.length > 80
                                            ? m.content.slice(0, 80) + "..."
                                            : m.content}
                                    </div>

                                    <div className="mail-footer">
                                        Đến: <b>{m.to}</b>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* ===== POPUP ===== */}
            {popup && (
                <div className="popup-overlay">
                    <div className={`popup-box ${popup.type}`}>
                        <h3>{popup.type === "success" ? "✅ Thành công" : "❌ Lỗi"}</h3>
                        <p>{popup.message}</p>
                        <button onClick={() => setPopup(null)}>Đóng</button>
                    </div>
                </div>
            )}

            {/* ===== MAIL MODAL ===== */}
            {selectedMail && (
                <div className="popup-overlay">
                    <div className="mail-modal">
                        <div className="mail-modal-header">
                            <h2>{selectedMail.subject}</h2>
                        </div>

                        <div className="mail-meta">
                            {activeTab === "inbox" && (
                                <span><b>Từ:</b> {selectedMail.from}</span>
                            )}
                            {activeTab === "sent" && (
                                <span><b>Đến:</b> {selectedMail.to}</span>
                            )}
                            <span><b>Thời gian:</b> {selectedMail.time}</span>
                        </div>

                        <div className="mail-body">
                            {selectedMail.content}
                        </div>

                        <div className="mail-modal-footer">
                            <button onClick={() => setSelectedMail(null)}>
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
