import React, { useState } from "react";
import axios from "axios";
import "./css/resetpass.css";

export default function ResetPass() {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const username = localStorage.getItem("username");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!otp || !newPassword || !confirmPassword) {
            setError("Vui lòng nhập đầy đủ thông tin");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

        try {
            setLoading(true);
            await axios.post("http://127.0.0.1:8000/auth/reset-password", {
                username,
                otp,
                new_password: newPassword
            });

            alert("Đổi mật khẩu thành công");
            localStorage.removeItem("username");
            window.location.href = "/";
        } catch (err) {
            setError(err.response?.data?.detail || "OTP không đúng");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-container">
            <div className="reset-box">
                <a href="/forgot" className="back-link">Quay lại</a>

                <img
                    src={require("./css/ava1.png")}
                    alt="avatar"
                    className="reset-avatar"
                />

                <h2 className="reset-title">NHẬP MÃ OTP</h2>

                <form className="reset-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Mã OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    {/* Mật khẩu mới */}
                    <div className="password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Mật khẩu mới"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <span
                            className="toggle-pass"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </span>
                    </div>

                    {/* Xác nhận mật khẩu */}
                    <div className="password-field">
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <span
                            className="toggle-pass"
                            onClick={() => setShowConfirm(!showConfirm)}
                        >
                            {showConfirm ? "🙈" : "👁️"}
                        </span>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN"}
                    </button>
                </form>

                {error && <p className="error-text">{error}</p>}
            </div>
        </div>
    );
}
