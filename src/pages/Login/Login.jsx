import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { loginApi } from "../../api/auth";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await loginApi(username, password);

            localStorage.setItem("token", res.access_token);
            localStorage.setItem("role", res.role);

            if (res.role === "admin") navigate("/overview");
            else if (res.role === "manager") navigate("/manager");
            else navigate(`/employee/${res.user_id}`);

        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h1 className={styles.companyTitle}>
                    CÔNG TY CỔ PHẦN NĂM THÀNH VIÊN A+88
                </h1>

                <div className={styles.loginBody}>
                    <div className={styles.loginLeft}>
                        <img
                            src="/image/anhnhom.png"
                            alt="illustration"
                            className={styles.loginImg}
                        />
                    </div>

                    <div className={styles.loginRight}>
                        <img
                            src="/image/ava2.png"
                            alt="avatar"
                            className={styles.loginAvatar}
                        />
                        <h2 className={styles.loginTitle}>ĐĂNG NHẬP</h2>

                        <form className={styles.loginForm} onSubmit={handleLogin}>
                            <div className={styles.inputField}>
                                <img
                                    src="/image/usericon.png"
                                    alt="user"
                                    className={styles.inputIcon}
                                />
                                <input
                                    type="text"
                                    placeholder="Email hoặc Username"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>

                            <div className={styles.inputField}>
                                <img
                                    src="/image/keyicon.png"
                                    alt="key"
                                    className={styles.inputIcon}
                                />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <span
                                    className={styles.togglePassword}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </span>
                            </div>

                            <button type="submit" className={styles.loginButton}>
                                Log in
                            </button>
                        </form>

                        <a href="/forgot" className={styles.forgotLink}>
                            Forgot password?
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
