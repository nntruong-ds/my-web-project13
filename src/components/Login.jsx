import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import employees from "../data/employees";
import "./css/dangnhap.css";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = (e) => {
        e.preventDefault();
        const user = employees.find(
            u => u.username === username && u.password === password
        );
        if (!user) {
            alert("Sai username hoặc mật khẩu!");
            return;
        }
        // Nếu muốn check password thật thì tạo field password trong employees
        if (password.length < 1) {
            alert("Sai username hoặc mật khẩu!");
            return;
        }
        navigate(`/employee/${user.id}`);
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
                                    placeholder="Email hoặc Username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className="input-field">
                                <img
                                    src={require("./css/keyicon.png")}
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
