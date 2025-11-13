import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import employees from "../data/employees";
import "./css/phieuluong.css";

export default function PhieuLuong() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = employees.find(u => u.id === Number(id));
    if (!user) return <h2>Không tìm thấy nhân viên</h2>;

    return (
        <div className="pl-container">

            {/* Header */}
            <div className="pl-header">
                <button className="email-back" onClick={() => navigate(`/employee/${id}`)}>
                    ← Quay lại
                </button>
                <h2 className="pl-title">Phiếu lương</h2>
            </div>

            {/* Box lương */}
            <div className="pl-box">

                <div className="pl-row">
                    <span className="pl-label">Tổng thu nhập:</span>
                    <span className="pl-value">{user.salary.income} triệu</span>
                </div>

                <div className="pl-row">
                    <span className="pl-label">Khấu trừ:</span>
                    <span className="pl-value"> - {user.salary.deduction} triệu</span>
                </div>

                <div className="pl-row">
                    <span className="pl-label">Tạm ứng:</span>
                    <span className="pl-value"> - {user.salary.advance} triệu</span>
                </div>

                <div className="pl-row">
                    <span className="pl-label">Thưởng:</span>
                    <span className="pl-value">{user.salary.bonus} triệu</span>
                </div>

                <div className="pl-row">
                    <span className="pl-label">Phụ cấp:</span>
                    <span className="pl-value">{user.salary.allowance} triệu</span>
                </div>

                <div className="pl-final-row">
                    <span className="pl-final-label">Lương thực lĩnh:</span>
                    <span className="pl-final-value"> {user.salary.income - user.salary.deduction - user.salary.advance + user.salary.bonus + user.salary.allowance} triệu</span>
                </div>

            </div>
        </div>
    );
}
