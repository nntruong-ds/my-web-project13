import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./css/bang_cong.css";
import axios from "axios";

export default function BangCong() {
    const { ma_nhan_vien } = useParams();
    const navigate = useNavigate();

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(12);
    const [year, setYear] = useState(2024);
    const [showDetail, setShowDetail] = useState(false);
    const [checking, setChecking] = useState(false);

    // 🔑 GIỜ CHECK-IN / CHECK-OUT THỰC
    const [checkInTime, setCheckInTime] = useState(null);
    const [checkOutTime, setCheckOutTime] = useState(null);

    const token = localStorage.getItem("access_token");

    /* ================= LOAD BẢNG CÔNG ================= */
    const loadBangCong = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                "http://127.0.0.1:8000/cham-cong",
                {
                    params: {
                        ma_nhan_vien,
                        thang: month,
                        nam: year,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = res.data.data || [];
            setRecords(data);

            // ===== LẤY DÒNG HÔM NAY =====
            const today = new Date().toISOString().slice(0, 10); // yyyy-mm-dd
            const todayRecord = data.find((r) => r.ngay === today);

            if (todayRecord) {
                setCheckInTime(todayRecord.gio_vao || null);
                setCheckOutTime(todayRecord.gio_ra || null);
            } else {
                setCheckInTime(null);
                setCheckOutTime(null);
            }
        } catch (err) {
            console.error("Lỗi tải bảng công:", err);
            setRecords([]);
            setCheckInTime(null);
            setCheckOutTime(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (ma_nhan_vien) loadBangCong();
    }, [month, year, ma_nhan_vien]);

    /* ================= CHECK-IN ================= */
    const handleCheckIn = async () => {
        try {
            setChecking(true);
            const res = await axios.post(
                "http://127.0.0.1:8000/cham-cong/check-in",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert(res.data.message || "Check-in thành công");
            loadBangCong(); // 🔴 LOAD LẠI ĐỂ LẤY GIỜ THỰC
        } catch (err) {
            alert(err.response?.data?.detail || "Check-in thất bại");
        } finally {
            setChecking(false);
        }
    };

    /* ================= CHECK-OUT ================= */
    const handleCheckOut = async () => {
        try {
            setChecking(true);
            const res = await axios.post(
                "http://127.0.0.1:8000/cham-cong/check-out",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert(
                `${res.data.message}
Giờ làm: ${res.data.so_gio_lam}
Tăng ca: ${res.data.so_gio_tang_ca}`
            );
            loadBangCong(); // 🔴 LOAD LẠI ĐỂ LẤY GIỜ RA
        } catch (err) {
            alert(err.response?.data?.detail || "Check-out thất bại");
        } finally {
            setChecking(false);
        }
    };

    if (loading) return <h2>Đang tải dữ liệu...</h2>;

    /* ================= SUMMARY ================= */
    const workDays = records.length;
    const overtime = records.reduce((s, r) => s + (r.so_gio_tang_ca || 0), 0);
    const late = records.reduce(
        (s, r) => s + (r.so_lan_di_muon_ve_som || 0),
        0
    );

    return (
        <div className="bc-page">
            {/* HEADER */}
            <div className="bc-header">
                <button onClick={() => navigate(`/employee/${ma_nhan_vien}`)}>
                    ←
                </button>
                <h2>BẢNG CÔNG</h2>

                <div className="bc-month">
                    <button
                        onClick={() => {
                            if (month === 1) {
                                setMonth(12);
                                setYear((y) => y - 1);
                            } else setMonth((m) => m - 1);
                        }}
                    >
                        ‹
                    </button>
                    <span>
                        {month} / {year}
                    </span>
                    <button
                        onClick={() => {
                            if (month === 12) {
                                setMonth(1);
                                setYear((y) => y + 1);
                            } else setMonth((m) => m + 1);
                        }}
                    >
                        ›
                    </button>
                </div>
            </div>

            {/* SUMMARY */}
            <div className="bc-summary">
                <div>
                    <b>{workDays}</b>
                    <p>
                        Tổng công
                        <br />
                        (ngày)
                    </p>
                </div>
                <div>
                    <b>{overtime.toFixed(2)}</b>
                    <p>
                        Làm thêm
                        <br />
                        (giờ)
                    </p>
                </div>
                <div>
                    <b>{late}</b>
                    <p>
                        Đi muộn /
                        <br />
                        Về sớm
                    </p>
                </div>
                <div>
                    <b>0</b>
                    <p>
                        Nghỉ
                        <br />
                        (ngày)
                    </p>
                </div>
            </div>

            {/* CHECK-IN / CHECK-OUT */}
            <div className="bc-check">
                <div className="bc-check-row">
                    <div className="bc-check-left">
                        🕘 Bạn đã chấm công đầu lúc{" "}
                        <b>{checkInTime || "--:--"}</b>
                    </div>
                    <button
                        className="btn-checkin"
                        onClick={handleCheckIn}
                        disabled={checking || !!checkInTime}
                    >
                        {checkInTime ? "Đã check-in" : "Check-in"}
                    </button>
                </div>

                <div className="bc-check-row">
                    <div className="bc-check-left">
                        🕔 Bạn đã chấm công về lúc{" "}
                        <b>{checkOutTime || "--:--"}</b>
                    </div>
                    <button
                        className="btn-checkout"
                        onClick={handleCheckOut}
                        disabled={checking || !checkInTime || !!checkOutTime}
                    >
                        {checkOutTime ? "Đã check-out" : "Check-out"}
                    </button>
                </div>

                <div className="bc-check-footer">
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
                    </div>

                    <div className="bc-employee">{ma_nhan_vien}</div>

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
                                    <td>
                                        {r.so_gio_lam?.toFixed(2) || 0}
                                    </td>
                                    <td>
                                        {r.so_gio_tang_ca?.toFixed(2) || 0}
                                    </td>
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
