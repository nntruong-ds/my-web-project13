import React, { useState } from "react";
import "./css/quenpass.css";

export default function QuenPass() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [showPopup, setShowPopup] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!username || !email) {
            alert("Vui lòng nhập đủ thông tin!");
            return;
        }

        // Hiện popup
        setShowPopup(true);

        // Tự quay lại sau 2 giây
        setTimeout(() => {
            setShowPopup(false);
            window.location.href = "/";
        }, 2000);
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

                        <p className="note">
                            Chú ý: Hệ thống sẽ gửi mật khẩu mới qua email
                        </p>
                    </div>
                </div>
            </div>

            {/* POPUP — thêm vào cuối */}
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
