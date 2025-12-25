import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./css/bang_cong.css";
import axios from "axios";

export default function BangCong() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(12);
    const [year, setYear] = useState(2024);
    const [showDetail, setShowDetail] = useState(false);

    const token = localStorage.getItem("access_token");

    const loadBangCong = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                "http://127.0.0.1:8000/cham-cong",
                {
                    params: {
                        ma_nhan_vien: id,
                        thang: month,
                        nam: year
                    },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setRecords(res.data.data || []);
        } catch (err) {
            console.error("Lỗi tải bảng công:", err);
            setRecords([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBangCong();
    }, []);

    if (loading) return <h2>Đang tải dữ liệu...</h2>;

    // ================= SUMMARY =================
    const workDays = records.length;
    const overtime = records.reduce((s, r) => s + (r.so_gio_tang_ca || 0), 0);
    const late = records.reduce((s, r) => s + (r.so_lan_di_muon_ve_som || 0), 0);

    return (
        <div className="bc-page">

            {/* HEADER */}
            <div className="bc-header">
                <button onClick={() => navigate(`/employee/${id}`)}>←</button>
                <h2>BẢNG CÔNG</h2>

                <div className="bc-month">
                    <button onClick={() => setMonth(m => m - 1)}>‹</button>
                    <span>{month} / {year}</span>
                    <button onClick={() => setMonth(m => m + 1)}>›</button>
                </div>
            </div>

            {/* SUMMARY BOX */}
            <div className="bc-summary">
                <div>
                    <b>{workDays}</b>
                    <p>Tổng công<br />(ngày)</p>
                </div>
                <div>
                    <b>{overtime.toFixed(2)}</b>
                    <p>Làm thêm<br />(giờ)</p>
                </div>
                <div>
                    <b>{late}</b>
                    <p>Đi muộn /<br />Về sớm</p>
                </div>
                <div>
                    <b>0</b>
                    <p>Nghỉ<br />(ngày)</p>
                </div>
            </div>

            {/* CHECK INFO */}
            <div className="bc-check">
                <p>🕘 Bạn đã chấm công đầu lúc <b>08:00</b></p>
                <p>🕔 Bạn đã chấm công về lúc <b>17:00</b></p>

                {/* 👉 CHỮ CHI TIẾT Ở TRANG ĐẦU */}
                <button
                    className="btn-detail"
                    onClick={() => {
                        setShowDetail(true);
                        setTimeout(() => {
                            document
                                .getElementById("bc-detail")
                                ?.scrollIntoView({ behavior: "smooth" });
                        }, 100);
                    }}
                >
                    CHI TIẾT
                </button>
            </div>

            <p className="bc-note">
                Bảng chấm công tự động cập nhật 10:00, 12:00, 15:15, 17:00
            </p>

            {/* ================= CHI TIẾT ================= */}
            {showDetail && (
                <div className="bc-detail" id="bc-detail">
                    <div className="bc-detail-header">
                        <button onClick={() => setShowDetail(false)}>←</button>
                        <h3>BẢNG CÔNG CHI TIẾT</h3>

                        <div className="bc-month">
                            <button onClick={() => setMonth(m => m - 1)}>‹</button>
                            <span>{month} / {year}</span>
                            <button onClick={() => setMonth(m => m + 1)}>›</button>
                        </div>
                    </div>

                    <div className="bc-employee">
                        {id}
                    </div>

                    <table className="bc-table">
                        <thead>
                        <tr>
                            <th>NGÀY</th>
                            <th>THỨ</th>
                            <th>TỪ</th>
                            <th>ĐẾN</th>
                            <th>GIỜ LÀM</th>
                            <th>TĂNG CA</th>
                            <th>TRẠNG THÁI</th>
                        </tr>
                        </thead>
                        <tbody>
                        {records.length === 0 ? (
                            <tr>
                                <td colSpan="7">Không có dữ liệu</td>
                            </tr>
                        ) : (
                            records.map((r, i) => (
                                <tr key={i}>
                                    <td>{r.ngay}</td>
                                    <td>{r.thu || "-"}</td>
                                    <td>{r.gio_vao || "-"}</td>
                                    <td>{r.gio_ra || "-"}</td>
                                    <td>{r.so_gio_lam?.toFixed(2) || 0}</td>
                                    <td>{r.so_gio_tang_ca?.toFixed(2) || 0}</td>
                                    <td>{r.trang_thai}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
