import React, { useEffect, useState } from "react";
import "./css/hoso.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function HoSo() {
    const navigate = useNavigate();
    const { ma_nhan_vien } = useParams();

    const [formData, setFormData] = useState({});
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("access_token");

                const res = await axios.get(
                    "http://127.0.0.1:8000/employee/profile",
                    {
                        params: { username: ma_nhan_vien },
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                setFormData({
                    ma_nhan_vien: res.data.ma_nhan_vien || "",
                    ho_ten: res.data.ho_ten || "",
                    email: res.data.email || "",
                    phong_ban_id: res.data.phong_ban_id || "",
                    chuc_vu_id: res.data.chuc_vu_id || "",
                    chinhanh_id: res.data.chinhanh_id || "",
                    trang_thai: res.data.trang_thai || "",
                    ngay_vao_lam: res.data.ngay_vao_lam || "",
                    avatar: require("./css/ava1.png"),
                });

            } catch (error) {
                console.log("Lỗi khi lấy dữ liệu nhân viên:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [ma_nhan_vien]);

    if (loading) return <h2>Đang tải thông tin...</h2>;
    if (!formData?.ma_nhan_vien) return <h2>Không tìm thấy nhân viên</h2>;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("access_token");

            const payload = {
                ho_ten: formData.ho_ten || null,
                email: formData.email || null,
                phong_ban_id: formData.phong_ban_id || null,
                trang_thai: formData.trang_thai || null,
            };

            await axios.put(
                "http://127.0.0.1:8000/employee/profile",
                payload,
                {
                    params: { username: ma_nhan_vien },
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            alert("Cập nhật thành công!");
            setEditing(false);

        } catch (error) {
            console.error("Lỗi cập nhật:", error.response?.data || error);
            alert("Lỗi khi cập nhật hồ sơ.");
        }
    };

    return (
        <div className="hs-container">
            <div className="hs-header">
                <button
                    className="email-back"
                    onClick={() => navigate(`/employee/${ma_nhan_vien}`)}
                >
                    ← Quay lại
                </button>

                <h2>Hồ sơ của bạn</h2>

                <div className="hs-buttons">
                    <button className="hs-update" onClick={handleUpdate}>Cập nhật</button>
                    <button className="hs-edit" onClick={() => setEditing(true)}>Chỉnh sửa</button>
                </div>
            </div>

            <div className="hs-form-box">
                <div className="hs-grid">
                    <div className="hs-left">
                        <label>Mã nhân viên:</label>
                        <input value={formData.ma_nhan_vien} disabled />

                        <label>Họ và tên:</label>
                        <input
                            name="ho_ten"
                            value={formData.ho_ten}
                            disabled={!editing}
                            onChange={handleChange}
                        />

                        <label>Email:</label>
                        <input
                            name="email"
                            value={formData.email}
                            disabled={!editing}
                            onChange={handleChange}
                        />

                        <label>Phòng ban ID:</label>
                        <input
                            name="phong_ban_id"
                            value={formData.phong_ban_id}
                            disabled={!editing}
                            onChange={handleChange}
                        />

                        <label>Chức vụ ID:</label>
                        <input value={formData.chuc_vu_id} disabled />

                        <label>Ngày vào làm:</label>
                        <input value={formData.ngay_vao_lam} disabled />

                        <label>Trạng thái:</label>
                        <input
                            name="trang_thai"
                            value={formData.trang_thai}
                            disabled={!editing}
                            onChange={handleChange}
                        />

                        <label>Chi nhánh ID:</label>
                        <input value={formData.chinhanh_id} disabled />
                    </div>

                    <div className="hs-right">
                        <img
                            src={formData.avatar}
                            alt="avatar"
                            className="hs-avatar"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
