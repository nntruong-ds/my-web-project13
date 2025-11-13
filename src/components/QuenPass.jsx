import React from "react";
import "./css/quenpass.css";

export default function QuenPass() {
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

                        <form className="login-form">
                            <div className="input-field">
                                <img
                                    src={require("./css/usericon.png")}
                                    alt="user"
                                    className="input-icon"
                                />
                                <input type="text" placeholder="Username" required />
                            </div>

                            <div className="input-field">
                                <img
                                    src={require("./css/mailicon.png")}
                                    alt="email"
                                    className="input-icon"
                                />
                                <input type="email" placeholder="Email" required />
                            </div>

                            <button type="submit">XÁC NHẬN</button>
                        </form>

                        <p className="note">
                            Chú ý: Hệ thống sẽ gửi mật khẩu mới qua email
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
