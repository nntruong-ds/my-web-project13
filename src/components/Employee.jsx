import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/nhanvien.css";

export default function Employee() {
    const { ma_nhan_vien } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const role = localStorage.getItem("role");
    const managerRoles = ["tonggiamdoc", "giamdoc_cn", "truongphong"];
    const isManager = managerRoles.includes(role);

    useEffect(() => {
        if (!ma_nhan_vien) {
            setLoading(false);
            return;
        }

        axios
            .get("http://127.0.0.1:8000/employee/profile", {
                params: { username: ma_nhan_vien },
            })
            .then((res) => {
                setUser(res.data);
                localStorage.setItem("ho_ten", res.data.ho_ten);
                window.dispatchEvent(new Event("storage"));

                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setUser(null);
                setLoading(false);
            });
    }, [ma_nhan_vien]);

    if (loading) return <h2>Đang tải...</h2>;
    if (!user) return <h2>Không tìm thấy nhân viên</h2>;

    const features = [
        { name: "Sinh nhật", path: "sinhnhat", icon: require("./css/sinhnhat.png") },
        { name: "Hồ sơ", path: "hoso", icon: require("./css/hoso.png") },
        { name: "Phiếu lương", path: "phieuluong", icon: require("./css/phieuluong.png") },
        { name: "Bảng công", path: "bangcong", icon: require("./css/bangcong.png") },
        { name: "KPI", path: "kpi", icon: require("./css/kpi.png") },
        { name: "Công tác", path: "congtac", icon: require("./css/congtac.png") },
        { name: "Email", path: "email", icon: require("./css/email.png") },
    ];

    return (
        <div className="nv-container">
            {/* HEADER */}
            <div className="nv-header">
                {isManager && (
                    <span
                        className="manager-text"
                        onClick={() =>
                            window.open(
                                `http://localhost:3000/overview?role=${role}`,
                                "_blank"
                            )
                        }
                    >
                        Quản lý
                    </span>
                )}

                <button
                    className="btn-logout"
                    onClick={() => {
                        localStorage.clear();
                        window.dispatchEvent(new Event("storage"));
                        navigate("/");
                    }}
                >
                    Đăng xuất
                </button>
            </div>

            {/* INFO */}
            <div className="nv-info-box">
                <div className="nv-avatar-box">
                    <img
                        className="nv-avatar"
                        src={require("./css/ava1.png")}
                        alt="avatar"
                    />
                </div>

                <div className="nv-text">
                    <h2 className="nv-name">{user.ho_ten}</h2>
                    <p><b>Mã NV:</b> {user.ma_nhan_vien}</p>
                    <p><b>Chức vụ:</b> {user.chuc_vu_id}</p>
                    <p><b>Phòng ban:</b> {user.phong_ban_id ?? "Chưa có"}</p>
                    <p><b>Chi nhánh:</b> {user.chinhanh_id}</p>
                </div>
            </div>

            {/* FEATURES */}
            <h2 className="nv-section-title">Tính năng</h2>

            <div className="nv-feature-grid">
                {features.map((item, index) => (
                    <div
                        key={index}
                        className="nv-feature-item"
                        onClick={() =>
                            navigate(`/employee/${ma_nhan_vien}/${item.path}`)
                        }
                    >
                        <img src={item.icon} alt={item.name} />
                        <p>{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
