import React, { useState } from "react";
import "./css/quenpass.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function QuenPass() {
    const navigate = useNavigate();
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
                {
                    username,
                    email
                }
            );

            if (res.status === 200) {
                localStorage.setItem("username_reset", username);

                alert("Đã gửi mã OTP về email!");
                navigate("/reset-password");
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
                    <div className="login-left">
                        <img
                            src={require("./css/anhnhom.png")}
                            alt="illustration"
                            className="login-img"
                        />
                    </div>

                    <div className="login-right">
                        <button
                            className="back-link"
                            onClick={() => navigate("/")}
                        >
                            Quay lại
                        </button>

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
