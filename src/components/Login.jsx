import React from "react";
import "./css/dangnhap.css";

export default function Login() {
    return (
        <div className="login-container">
            <h1 className="company-title">
                CÔNG TY CỔ PHẦN NĂM THÀNH VIÊN A+88
            </h1>
            <div className="login-box">
                <div className="login-left">
                    <img
                        src={require("./css/anhnhom.png")}
                        alt="illustration"
                        className="login-img"
                    />
                </div>

                {/* Form bên phải */}
                <div className="login-right">
                    <img
                        src={require("./css/ava2.png")}
                        alt="avatar"
                        className="login-avatar"
                    />
                    <h2 className="login-title">ĐĂNG NHẬP</h2>
                    <form className="login-form">
                        <input type="text" placeholder="Username" required />
                        <input type="password" placeholder="Password" required />
                        <button type="submit">Log in</button>
                    </form>
                    <a href="/forgot" className="forgot-link">
                        Forgot password?
                    </a>
                </div>
            </div>
        </div>
    );
}
