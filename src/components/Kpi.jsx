import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/kpi.css";

export default function KPI() {
    const navigate = useNavigate();

    const [month, setMonth] = useState(12);
    const [year, setYear] = useState(2024);
    const [kpis, setKpis] = useState([]);
    const [datThuong, setDatThuong] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const renderStatus = (status) => {
        switch (status) {
            case "dang_danh_gia":
                return <span className="kpi-status evaluating">Đang đánh giá</span>;
            case "khong_dat":
                return <span className="kpi-status fail">Không đạt</span>;
            case "dat":
                return <span className="kpi-status pass">Đạt</span>;
            default:
                return status;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchKPI = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    "http://127.0.0.1:8000/kpi/me",
                    {
                        params: { thang: month, nam: year },
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setKpis(res.data.data || []);
            } catch (err) {
                console.error("KPI error:", err);
                setKpis([]);
            } finally {
                setLoading(false);
            }
        };

        const fetchThuong = async () => {
            try {
                const res = await axios.get(
                    "http://127.0.0.1:8000/reward/me",
                    {
                        params: { thang: month, nam: year },
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setDatThuong(res.data.dat_kpi);
            } catch (err) {
                console.warn("Không lấy được trạng thái thưởng");
                setDatThuong(null);
            }
        };

        fetchKPI();
        fetchThuong();
    }, [month, year, navigate]);

    return (
        <div className="kpi-page">
            <div className="kpi-header">
                <button className="kpi-back" onClick={() => navigate(-1)}>←</button>

                <h2>BẢNG KPI CHI TIẾT</h2>

                <div className="kpi-month">
                    <span>Tháng</span>
                    <button onClick={prevMonth}>‹</button>
                    <span>{month} / {year}</span>
                    <button onClick={nextMonth}>›</button>
                </div>
            </div>

            {/* TRẠNG THÁI THƯỞNG */}
            {datThuong !== null && (
                <div className={`thuong-box ${datThuong ? "pass" : "fail"}`}>
                    {datThuong
                        ? "✅ Đạt điều kiện thưởng KPI"
                        : "❌ Không đạt điều kiện thưởng KPI"}
                </div>
            )}

            <div className="kpi-table-wrapper">
                <table className="kpi-table">
                    <thead>
                    <tr>
                        <th>TÊN KPI</th>
                        <th>MỤC TIÊU</th>
                        <th>THỰC TẾ</th>
                        <th>TỶ LỆ (%)</th>
                        <th>TRẠNG THÁI</th>
                        <th>ĐƠN VỊ</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="6" className="kpi-empty">
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                    ) : kpis.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="kpi-empty">
                                Không có KPI
                            </td>
                        </tr>
                    ) : (
                        kpis.map((kpi, i) => (
                            <tr key={i}>
                                <td>{kpi.ten_kpi}</td>
                                <td>{kpi.muc_tieu}</td>
                                <td>{kpi.thuc_te}</td>
                                <td>{kpi.ty_le_hoan_thanh}</td>
                                <td>{renderStatus(kpi.trang_thai)}</td>
                                <td>{kpi.don_vi_tinh}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
