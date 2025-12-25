import React, { useState } from "react";
import "./css/quenpass.css";
import axios from "axios";

export default function QuenPass() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !email) {
            alert("Vui lòng nhập đủ thông tin!");
            return;
        }

        try {
            const res = await axios.post(
                "http://127.0.0.1:8000/auth/forgot-password",
                { username, email }
            );

            if (res.data.success) {
                setShowPopup(true);

                setTimeout(() => {
                    setShowPopup(false);
                    window.location.href = "/";
                }, 2000);
            } else {
                setError("Không thể gửi email. Vui lòng kiểm tra lại thông tin.");
            }
        } catch (err) {
            console.log(err);
            setError("Username hoặc email không đúng.");
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

                            <button type="submit">XÁC NHẬN</button>
                        </form>

                        {error && <p className="error-text">{error}</p>}

                        <p className="note">
                            Hệ thống sẽ gửi mật khẩu mới vào email của bạn.
                        </p>
                    </div>
                </div>
            </div>

            {/* POPUP */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h3>✔ Gửi thành công!</h3>
                        <p>Mật khẩu mới đã được gửi vào email của bạn.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
