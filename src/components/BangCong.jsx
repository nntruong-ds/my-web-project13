import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import "./css/page.css";
import employees from "../data/employees";

export default function BangCong() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = employees.find(u => u.id === Number(id));
    if (!user) return <h2>Không tìm thấy nhân viên</h2>;

    return (
        <div className="page-container">
            <div className="page-header">
                <button className="email-back" onClick={() => navigate(`/employee/${id}`)}>
                    ← Quay lại
                </button>
                <h2 className="page-title">Bảng công</h2>
            </div>
            <div className="page-box">
                <p><b>Tổng công:</b> {user.timesheet.workDays} ngày</p>
                <p><b>Làm thêm:</b> {user.timesheet.overtime} giờ</p>
                <p><b>Đi muộn / về sớm:</b> {user.timesheet.lateEarly} lần</p>
                <p><b>Nghỉ:</b> {user.timesheet.absent} ngày</p>
                <h3 className="bc-checkin">
                    Bạn đã chấm công lúc {user.timesheet.checkinTime}
                </h3>
                <i>Bảng công được cập nhật tự động 10:00 – 12:00 – 15:15 – 17:00 mỗi ngày</i>
            </div>
        </div>
    );
}
