import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import employees from "../data/employees";
import "./css/sinhnhat.css";

export default function SinhNhat() {
    const navigate = useNavigate();
    const { id } = useParams();  // Lấy ID người đang đăng nhập

    return (
        <div className="sn-container">
            <div className="sn-header">
                <button className="sn-back-btn" onClick={() => navigate(-1)}>←</button>
                <h2>Sinh nhật</h2>
            </div>

            <h3 className="sn-title">Sinh nhật của nhân viên</h3>

            <div className="sn-table-wrapper">
                <table className="sn-table">
                    <thead>
                    <tr>
                        <th>Họ và tên</th>
                        <th>Sinh nhật</th>
                        <th>Nhắn tin</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map((emp, index) => (
                        <tr key={index}>
                            <td>{emp.name}</td>
                            <td>{emp.birthday}</td>
                            <td>
                                <img
                                    src={require("./css/mailicon.png")}
                                    className="sn-mail-icon"
                                    alt="email"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        navigate(`/employee/${id}/email?to=${emp.email}`)
                                    }
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <p className="sn-note">Bấm vào ảnh để gửi lời chúc mừng sinh nhật.</p>
            </div>
        </div>
    );
}
