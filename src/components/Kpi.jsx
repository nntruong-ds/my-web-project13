import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./css/kpi.css";

export default function KPI() {
    const { ma_nhan_vien } = useParams();
    const navigate = useNavigate();

    const [month, setMonth] = useState(12);
    const [year, setYear] = useState(2024);

    const prevMonth = () => {
        if (month === 1) {
            setMonth(12);
            setYear(y => y - 1);
        } else {
            setMonth(m => m - 1);
        }
    };

    const nextMonth = () => {
        if (month === 12) {
            setMonth(1);
            setYear(y => y + 1);
        } else {
            setMonth(m => m + 1);
        }
    };

    return (
        <div className="kpi-page">
            <div className="kpi-header">
                <button
                    className="kpi-back"
                    onClick={() => navigate(`/employee/${ma_nhan_vien}`)}
                >
                    ←
                </button>

                <h2>BẢNG KPI CHI TIẾT</h2>

                <div className="kpi-month">
                    <span className="kpi-label">Tháng</span>
                    <button onClick={prevMonth}>‹</button>
                    <span className="kpi-time">{month} / {year}</span>
                    <button onClick={nextMonth}>›</button>
                </div>
            </div>

            {/* EMPLOYEE INFO */}
            <div className="kpi-employee">
                NGUYỄN NGỌC TRƯỜNG: 23001566
            </div>

            {/* TABLE */}
            <div className="kpi-table-wrapper">
                <table className="kpi-table">
                    <thead>
                    <tr>
                        <th>TÊN KPI</th>
                        <th>MỤC TIÊU</th>
                        <th>THỰC TẾ</th>
                        <th>TỶ LỆ HOÀN THÀNH</th>
                        <th>TRẠNG THÁI</th>
                        <th>ĐƠN VỊ</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td colSpan="6" className="kpi-empty">
                            Chưa có dữ liệu KPI
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
}
