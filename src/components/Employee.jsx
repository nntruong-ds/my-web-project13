import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import employeesData from "../data/employees";
import "./css/nhanvien.css";

export default function Employee() {
    const { id } = useParams();
    const navigate = useNavigate();
    const stored = localStorage.getItem("employees");
    const employees = stored ? JSON.parse(stored) : employeesData;
    const user = employees.find(u => u.id === Number(id));
    if (!user) return <h2>Không tìm thấy nhân viên</h2>;

    const features = [
        { name: "Sinh nhật", path: "sinhnhat", icon: require("./css/sinhnhat.png") },
        { name: "Hồ sơ", path: "hoso", icon: require("./css/hoso.png") },
        { name: "Phiếu lương", path: "phieuluong", icon: require("./css/phieuluong.png") },
        { name: "Bảng công", path: "bangcong", icon: require("./css/bangcong.png") },
        { name: "Email", path: "email", icon: require("./css/email.png") },
    ];

    return (
        <div className="nv-container">
            <div className="nv-header">
                <button className="btn-logout" onClick={() => navigate("/")}>
                    Đăng xuất
                </button>
            </div>
            <div className="nv-info-box">

                <div className="nv-avatar-box">
                    <img className="nv-avatar" src={user.avatar} alt="avatar" />
                </div>

                <div className="nv-text">
                    <h2 className="nv-name">{user.name}</h2>
                    <p><b>Chức vụ:</b> {user.position}</p>
                    <p><b>Phòng ban:</b> {user.department}</p>
                    <p><b>Chi nhánh:</b> {user.branch}</p>
                </div>

            </div>

            <h2 className="nv-section-title">Tính năng</h2>

            <div className="nv-feature-grid">
                {features.map((item, index) => (
                    <div
                        key={index}
                        className="nv-feature-item"
                        onClick={() => navigate(`/employee/${id}/${item.path}`)}
                    >
                        <img src={item.icon} alt={item.name} />
                        <p>{item.name}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}
