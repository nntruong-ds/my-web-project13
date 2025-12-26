import React, { useState } from "react";
import "./css/quenpass.css";
import axios from "axios";

export default function QuenPass() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!username || !email) {
            setError("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                "http://127.0.0.1:8000/auth/forgot-password",
                { username, email }
            );

            // Backend trả OK → lưu username + chuyển trang
            if (res.status === 200) {
                localStorage.setItem("username", username);
                window.location.href = "/reset-password";
            }
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.detail ||
                "Username hoặc email không đúng."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="company-title">
                    CÔNG TY CỔ PHẦN NĂM THÀNH VIÊN A+88
                </h1>

                <div className="login-body">
                    {/* LEFT */}
                    <div className="login-left">
                        <img
                            src={require("./css/anhnhom.png")}
                            alt="illustration"
                            className="login-img"
                        />
                    </div>

                    {/* RIGHT */}
                    <div className="login-right">
                        <a href="/" className="back-link">
                            Quay lại
                        </a>

                        <img
                            src={require("./css/ava1.png")}
                            alt="avatar"
                            className="login-avatar"
                        />

                        <h2 className="login-title">QUÊN MẬT KHẨU</h2>

                        <form className="login-form" onSubmit={handleSubmit}>
                            <div className="input-field">
                                <img
                                    src={require("./css/usericon.png")}
                                    alt="user"
                                    className="input-icon"
                                />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="input-field">
                                <img
                                    src={require("./css/mailicon.png")}
                                    alt="email"
                                    className="input-icon"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button type="submit" disabled={loading}>
                                {loading ? "ĐANG GỬI..." : "XÁC NHẬN"}
                            </button>
                        </form>

                        {error && <p className="error-text">{error}</p>}

                        <p className="note">
                            Hệ thống sẽ gửi <b>mã OTP</b> vào email của bạn.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
