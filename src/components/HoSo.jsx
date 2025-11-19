import React, { useState } from "react";
import "./css/hoso.css";
import { useNavigate, useParams } from "react-router-dom";
import employeesData from "../data/employees";

export default function HoSo() {
    const navigate = useNavigate();
    const { id } = useParams();

    // Load từ localStorage
    const storedData = localStorage.getItem("employees");
    const employees = storedData ? JSON.parse(storedData) : employeesData;

    const user = employees.find(u => u.id === Number(id));

    // Hooks phải đặt trước return
    const [formData, setFormData] = useState(user || {});
    const [editing, setEditing] = useState(false);

    if (!user) return <h2>Không tìm thấy nhân viên</h2>;

    // Thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Upload avatar
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setFormData(prev => ({ ...prev, avatar: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    // Cập nhật và lưu localStorage
    const handleUpdate = () => {
        const newData = employees.map(emp =>
            emp.id === Number(id) ? formData : emp
        );

        localStorage.setItem("employees", JSON.stringify(newData));
        alert("Cập nhật thành công!");
        setEditing(false);
    };

    return (
        <div className="hs-container">

            {/* HEADER */}
            <div className="hs-header">
                <button className="email-back" onClick={() => navigate(`/employee/${id}`)}>
                    ← Quay lại
                </button>
                <h2>Hồ sơ của bạn</h2>

                <div className="hs-buttons">
                    <button className="hs-update" onClick={handleUpdate}>Cập nhật</button>
                    <button className="hs-edit" onClick={() => setEditing(true)}>Chỉnh sửa</button>
                </div>
            </div>

            {/* FORM */}
            <div className="hs-form-box">
                <h3 className="hs-title">Thông tin</h3>

                <div className="hs-grid">

                    {/* LEFT FORM */}
                    <div className="hs-left">
                        <label>ID:</label>
                        <input name="id" value={formData.id} disabled />

                        <label>Họ và tên:</label>
                        <input name="name" value={formData.name} disabled={!editing} onChange={handleChange} />

                        <label>Ngày sinh:</label>
                        <input name="birthday" value={formData.birthday} disabled={!editing} onChange={handleChange} />

                        <label>Giới tính:</label>
                        <input name="sex" value={formData.sex} disabled={!editing} onChange={handleChange} />

                        <label>Địa chỉ:</label>
                        <input name="address" value={formData.address} disabled={!editing} onChange={handleChange} />

                        <label>Email:</label>
                        <input name="email" value={formData.email} disabled={!editing} onChange={handleChange} />

                        <div className="hs-row">
                            <div className="hs-col">
                                <label>CCCD:</label>
                                <input name="cccd" value={formData.cccd  || ""} disabled={!editing} onChange={handleChange} />
                            </div>
                            <div className="hs-col">
                                <label>SĐT:</label>
                                <input name="phone" value={formData.phone || ""} disabled={!editing} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="hs-row">
                            <div className="hs-col">
                                <label>Trạng thái:</label>
                                <input name="status" value={formData.status || ""} disabled={!editing} onChange={handleChange} />
                            </div>
                            <div className="hs-col">
                                <label>Ngày vào làm:</label>
                                <input name="ngayvl" value={formData.ngayvl || ""} disabled={!editing} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT - AVATAR */}
                    <div className="hs-right">
                        <img
                            src={formData.avatar}
                            alt="avatar"
                            className="hs-avatar"
                            onClick={() => editing && document.getElementById("uploadAvatar").click()}
                            style={{ cursor: editing ? "pointer" : "default" }}
                        />

                        <input
                            id="uploadAvatar"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            disabled={!editing}
                            onChange={handleAvatarChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
