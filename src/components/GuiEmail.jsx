import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./css/guiemail.css";
import axios from "axios";

export default function GuiEmail() {
    const { ma_nhan_vien } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const defaultEmail = params.get("to") || "";

    const [activeTab, setActiveTab] = useState("home");
    const [toEmail, setToEmail] = useState(defaultEmail);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [popup, setPopup] = useState(null);

    const token = localStorage.getItem("access_token");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!toEmail || !title || !content) {
            setPopup({ type: "error", message: "Vui lòng nhập đủ thông tin" });
            return;
        }

        try {
            await axios.post(
                "http://127.0.0.1:8000/email/send",
                {
                    to_email: toEmail,
                    subject: title,
                    content: content
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setPopup({ type: "success", message: "Gửi email thành công!" });
            setTitle("");
            setContent("");
        } catch (err) {
            setPopup({ type: "error", message: "Không thể gửi email" });
        }
    };

    return (
        <div className="gmail-page">

            <div className="gmail-header">
                <button onClick={() => navigate(`/employee/${ma_nhan_vien}`)}>←</button>
                <h2>GMAIL</h2>
            </div>

            <div className="gmail-body">
                <div className="gmail-sidebar">
                    <button onClick={() => setActiveTab("compose")}>SOẠN THƯ</button>
                    <button onClick={() => setActiveTab("inbox")}>HỘP THƯ ĐẾN</button>
                    <button onClick={() => setActiveTab("sent")}>ĐÃ GỬI</button>
                </div>

                <div className="gmail-content">

                    {activeTab === "compose" && (
                        <div className="compose-box">
                            <h3>SOẠN THƯ</h3>

                            <form onSubmit={handleSubmit}>
                                <label>Địa chỉ người nhận *</label>
                                <input
                                    type="text"
                                    value={toEmail}
                                    onChange={(e) => setToEmail(e.target.value)}
                                />

                                <label>Tiêu đề *</label>
                                <input
                                    type="text"
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
                                    GỬI
                                </button>
                            </form>
                        </div>
                    )}

                    {(activeTab === "inbox" || activeTab === "sent") && (
                        <div className="gmail-placeholder">
                            Chức năng đang phát triển 🚧
                        </div>
                    )}
                </div>
            </div>

            {popup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h3>{popup.type === "success" ? "🎉 Thành công" : "❌ Lỗi"}</h3>
                        <p>{popup.message}</p>
                        <button onClick={() => setPopup(null)}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
}
