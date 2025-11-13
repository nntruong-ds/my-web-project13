import React, { useState } from "react";
import "./css/hoso.css";
import {useNavigate, useParams} from "react-router-dom";
import employees from "../data/employees";

export default function HoSo() {
    const navigate = useNavigate();
    const { id } = useParams();
    const user = employees.find(u => u.id === Number(id));
    if (!user) return <h2>Không tìm thấy nhân viên</h2>;

    return (
        <div className="hs-container">

            {/* HEADER */}
            <div className="hs-header">
                <button className="email-back" onClick={() => navigate(`/employee/${id}`)}>
                    ← Quay lại
                </button>
                <h2>Hồ sơ của bạn</h2>

                <div className="hs-buttons">
                    <button className="hs-update">Cập nhật</button>
                    <button className="hs-edit">Chỉnh sửa</button>
                </div>
            </div>

            {/* FORM */}
            <div className="hs-form-box">
                <h3 className="hs-title">Thông tin</h3>

                <div className="hs-grid">

                    {/* LEFT FORM */}
                    <div className="hs-left">
                        <label>ID:</label>
                        <input type="text" value={user.id} disabled />

                        <label>Họ và tên:</label>
                        <input type="text" value={user.name} disabled />

                        <label>Ngày sinh:</label>
                        <input type="text" value={user.birthday} disabled />

                        <label>Giới tính:</label>
                        <input type="text" value={user.sex} disabled />

                        <label>Địa chỉ:</label>
                        <input type="text" value={user.address} disabled />

                        <label>Email:</label>
                        <input type="text" value={user.email} disabled />

                        <div className="hs-row">
                            <div className="hs-col">
                                <label>CCCD:</label>
                                <input type="text" value="0123456789" readOnly />
                            </div>

                            <div className="hs-col">
                                <label>SDT:</label>
                                <input type="text" value="0987654321" readOnly />
                            </div>
                        </div>

                        <div className="hs-row">
                            <div className="hs-col">
                                <label>Trạng thái:</label>
                                <input type="text" value="Đang làm việc" readOnly />
                            </div>

                            <div className="hs-col">
                                <label>Ngày vào làm:</label>
                                <input type="text" value="01/01/2024" readOnly />
                            </div>
                        </div>
                    </div>
                    <div className="hs-right">
                        <img src={user.avatar} alt="avatar" className="hs-avatar" />
                    </div>
                </div>
            </div>
        </div>
    );
}
