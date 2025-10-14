import React from "react";
import "./css/quenpass.css";

export default function QuenPass() {
    return (
        <div className="forgot-container">
            <h1 className="company-title">CÔNG TY CỔ PHẦN NĂM THÀNH VIÊN A+88</h1>
            <div className="forgot-box">
                <div className="forgot-left">
                    <img
                        src={require("./css/anhnhom.png")}
                        alt="illustration"
                        className="forgot-img"
                    />
                </div>
                <div className="forgot-right">
                    <a href="/" className="back-link">
                        Quay lại
                    </a>
                    <img
                        src={require("./css/ava1.png")}
                        alt="avatar"
                        className="forgot-avatar"
                    />
                    <h2>QUÊN MẬT KHẨU</h2>
                    <form className="forgot-form">
                        <input type="text" placeholder="Username" required />
                        <input type="email" placeholder="Email" required />
                        <button type="submit">XÁC NHẬN</button>
                    </form>
                    <p className="note">
                        Chú ý: Hệ thống sẽ gửi mật khẩu mới qua email
                    </p>
                </div>
            </div>
        </div>
    );
}
