import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./css/sinhnhat.css";

export default function SinhNhat() {
    const navigate = useNavigate();
    const { ma_nhan_vien } = useParams();   // 🔴 ĐÚNG PARAM

    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const token = localStorage.getItem("access_token");

                const res = await axios.get(
                    "http://127.0.0.1:8000/birthday/upcoming",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                console.log("Birthday data:", res.data);
                setEmployees(res.data || []);
            } catch (err) {
                console.error("Lỗi tải danh sách sinh nhật:", err);
                setEmployees([]);
            } finally {
                setLoading(false);
            }
        };

        loadEmployees();
    }, []);

    if (loading) {
        return <h2 style={{ textAlign: "center" }}>Đang tải danh sách...</h2>;
    }

    return (
        <div className="sn-container">
            <div className="sn-header">
                <button
                    className="sn-back-btn"
                    onClick={() => navigate(`/employee/${ma_nhan_vien}`)}
                >
                    ←
                </button>
                <h2>Sinh nhật</h2>
            </div>

            <h3 className="sn-title">Sinh nhật của nhân viên</h3>

            <div className="sn-table-wrapper">
                <table className="sn-table">
                    <thead>
                    <tr>
                        <th>Họ và tên</th>
                        <th>Sinh nhật</th>
                        <th>Email</th>
                    </tr>
                    </thead>

                    <tbody>
                    {employees.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: "center" }}>
                                Tháng này không có nhân viên nào sinh nhật 🎂
                            </td>
                        </tr>
                    ) : (
                        employees.map((emp, idx) => (
                            <tr key={idx}>
                                <td>{emp.ho_ten}</td>
                                <td>{emp.sinh_nhat}</td>
                                <td>
                                    <img
                                        src={require("./css/mailicon.png")}
                                        className="sn-mail-icon"
                                        alt="email"
                                        onClick={() =>
                                            navigate(
                                                `/employee/${ma_nhan_vien}/email?to=${emp.email}`
                                            )
                                        }
                                        style={{ cursor: "pointer" }}
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>

                <p className="sn-note">
                    Bấm vào biểu tượng email để gửi lời chúc mừng sinh nhật 🎉
                </p>
            </div>
        </div>
    );
}
