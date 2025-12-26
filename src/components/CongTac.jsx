import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./css/congtac.css";

export default function CongTac() {
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
        <div className="ct-page">

            {/* HEADER */}
            <div className="ct-header">
                <button
                    className="ct-back"
                    onClick={() => navigate(`/employee/${ma_nhan_vien}`)}
                >
                    ←
                </button>

                <h2>LỊCH CÔNG TÁC</h2>

                <div className="ct-month">
                    <span className="ct-label">Tháng</span>
                    <button onClick={prevMonth}>‹</button>
                    <span className="ct-time">{month} / {year}</span>
                    <button onClick={nextMonth}>›</button>
                </div>
            </div>

            {/* EMPLOYEE INFO */}
            <div className="ct-employee">
                NGUYỄN NGỌC TRƯỜNG: 23001566
            </div>

            {/* TABLE */}
            <div className="ct-table-wrapper">
                <table className="ct-table">
                    <thead>
                    <tr>
                        <th>TỪ NGÀY</th>
                        <th>ĐẾN NGÀY</th>
                        <th>ĐỊA ĐIỂM</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td colSpan="3" className="ct-empty">
                            Chưa có lịch công tác
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
}
