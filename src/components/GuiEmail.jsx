import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/guiemail.css";

export default function GuiEmail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [toEmail, setToEmail] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    return (
        <div className="email-container">

            <button className="email-back" onClick={() => navigate(`/employee/${id}`)}>
                ← Quay lại
            </button>

            <h2 className="email-title">Gửi Email</h2>

            <form className="email-form">
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
        </div>
    );
}
