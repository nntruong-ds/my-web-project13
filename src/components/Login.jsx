import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/dangnhap.css";
import axios from "axios";

export default function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://127.0.0.1:8000/auth/login", {
                username,
                password
            });

            if (res.data?.access_token) {
                localStorage.setItem("access_token", res.data.access_token);
                localStorage.setItem("role", res.data.role);
                localStorage.setItem("ma_nhan_vien", username);

                // 🔥 GỌI PROFILE ĐỂ LẤY HỌ TÊN
                const profileRes = await axios.get(
                    `http://127.0.0.1:8000/employee/profile?username=${username.toUpperCase()}`
                );

                // 👉 LƯU HỌ TÊN
                localStorage.setItem("ho_ten", profileRes.data.ho_ten);

                navigate(`/employee/${username}`);
            }
        } catch (err) {
            alert("Sai tài khoản hoặc mật khẩu!");
            console.error(err);
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
                        <img
                            src={require("./css/ava2.png")}
                            alt="avatar"
                            className="login-avatar"
                        />
                        <h2 className="login-title">ĐĂNG NHẬP</h2>

                        <form className="login-form" onSubmit={handleLogin}>
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
                                    required
                                />
                            </div>

                            <div className="input-field">
                                <img
                                    src={require("./css/keyicon.png")}
                                    alt="password"
                                    className="input-icon"
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
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
