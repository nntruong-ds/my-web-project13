import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/congtac.css";

export default function CongTac() {
    const navigate = useNavigate();

    const [year, setYear] = useState(2024);
    const [allCongTac, setAllCongTac] = useState([]);
    const [loading, setLoading] = useState(false);

    const prevYear = () => setYear(y => y - 1);
    const nextYear = () => setYear(y => y + 1);

    useEffect(() => {
        const fetchCongTac = async () => {
            const token = localStorage.getItem("access_token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                setLoading(true);
                const res = await axios.get(
                    "http://127.0.0.1:8000/qua-trinh-cong-tac/me",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setAllCongTac(res.data.data || []);
            } catch (err) {
                console.error(err);
                setAllCongTac([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCongTac();
    }, [navigate]);

    // ✅ LỌC THEO NĂM
    const congTacTheoNam = useMemo(() => {
        return allCongTac.filter(ct => {
            if (!ct.tu_ngay) return false;
            return new Date(ct.tu_ngay).getFullYear() === year;
        });
    }, [allCongTac, year]);

    return (
        <div className="ct-page">
            <div className="ct-header">
                <button className="ct-back" onClick={() => navigate(-1)}>←</button>
                <h2>LỊCH CÔNG TÁC THEO NĂM</h2>
                <div className="ct-year">
                    <button onClick={prevYear}>‹</button>
                    <span>{year}</span>
                    <button onClick={nextYear}>›</button>
                </div>
            </div>

            <div className="ct-table-wrapper">
                <table className="ct-table">
                    <thead>
                    <tr>
                        <th>TỪ NGÀY</th>
                        <th>ĐẾN NGÀY</th>
                        <th>CHI NHÁNH</th>
                        <th>ĐỊA ĐIỂM</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan="4" className="ct-empty">
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                    ) : congTacTheoNam.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="ct-empty">
                                Không có lịch công tác năm {year}
                            </td>
                        </tr>
                    ) : (
                        congTacTheoNam.map((ct, i) => (
                            <tr key={i}>
                                <td>{ct.tu_ngay}</td>
                                <td>{ct.den_ngay}</td>
                                <td>{ct.chi_nhanh}</td>
                                <td>{ct.dia_diem}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
