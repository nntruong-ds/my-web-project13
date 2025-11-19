import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./css/guiemail.css";

export default function GuiEmail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Lấy email từ URL (?to=...)
    const params = new URLSearchParams(location.search);
    const defaultEmail = params.get("to") || "";

    const [toEmail, setToEmail] = useState(defaultEmail);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [success, setSuccess] = useState(false); // popup

    const handleSubmit = (e) => {
        e.preventDefault();

        // check thiếu
        if (!toEmail || !title || !content) {
            alert("Vui lòng điền đầy đủ các trường bắt buộc.");
            return;
        }

        // bật popup
        setSuccess(true);

        // Tự động trở về trang Employee sau 2 giây
        setTimeout(() => {
            navigate(`/employee/${id}`);
        }, 2000);
    };

    return (
        <div className="email-container">

            <button className="email-back" onClick={() => navigate(`/employee/${id}`)}>
                ← Quay lại
            </button>

            <h2 className="email-title">Gửi Email</h2>

            <form className="email-form" onSubmit={handleSubmit}>
                <label>Email người nhận <span className="red">*</span></label>
                <input
                    type="email"
                    placeholder="Nhập email."
                    value={toEmail}
                    onChange={(e)=>setToEmail(e.target.value)}
                />

                <label>Tiêu đề <span className="red">*</span></label>
                <input
                    type="text"
                    placeholder="Nhập tiêu đề."
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                />

                <label>Nội dung <span className="red">*</span></label>
                <textarea
                    placeholder="Nhập nội dung email."
                    value={content}
                    onChange={(e)=>setContent(e.target.value)}
                ></textarea>

                <button type="submit" className="email-submit">Gửi</button>
            </form>

            {/* POPUP */}
            {success && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h3>🎉 Gửi thành công!</h3>
                        <p>Email đã được gửi.</p>

                        <button
                            className="popup-btn"
                            onClick={() => navigate(`/employee/${id}`)}
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
