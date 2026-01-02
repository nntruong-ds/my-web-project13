import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.module.css";
import response from "assert";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password})
            });
            const data = await res.json();
            if (!response.ok) {
                alert(data.detail || "Sai tài khoản hoặc mật khẩu!");
                return;
            }

            // Lưu token + role
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("user_id", data.user_id);

            // Điều hướng theo quyền
            if (data.role === "admin") {
                navigate("/admin");
            } else {
                navigate(`/employee/${data.user_id}`);
            }
        } catch (error) {
            console.error(err);
            alert("Không thể kết nối server!");
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
                            src="/image/anhnhom.png"
                            alt="illustration"
                            className="login-img"
                        />
                    </div>

                    <div className="login-right">
                        <img
                            src="/image/ava2.png"
                            alt="avatar"
                            className="login-avatar"
                        />
                        <h2 className="login-title">ĐĂNG NHẬP</h2>

                        <form className="login-form" onSubmit={handleLogin}>
                            <div className="input-field">
                                <img
                                    src="/image/usericon.png"
                                    alt="user"
                                    className="input-icon"
                                />
                                <input
                                    type="text"
                                    placeholder="Email hoặc Username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="input-field">
                                <img
                                    src="/image/keyicon.png"
                                    alt="key"
                                    className="input-icon"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </span>
                            </div>

                            <button type="submit">Log in</button>
                        </form>

                        <a href="/forgot" className="forgot-link">
                            Forgot password?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}