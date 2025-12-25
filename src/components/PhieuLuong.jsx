import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/phieuluong.css";

export default function PhieuLuong() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [month, setMonth] = useState(12);
    const [year, setYear] = useState(2024);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("access_token");

    const loadSalary = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                "http://127.0.0.1:8000/salary",
                {
                    params: {
                        ma_nhan_vien: id,
                        thang: month,
                        nam: year
                    },
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setData(res.data);
        } catch (err) {
            console.log(err);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    // ✅ TỰ LOAD KHI THÁNG / NĂM ĐỔI
    useEffect(() => {
        loadSalary();
    }, [month, year]);

    // ⬅️ THÁNG TRƯỚC
    const prevMonth = () => {
        if (month === 1) {
            setMonth(12);
            setYear(y => y - 1);
        } else {
            setMonth(m => m - 1);
        }
    };

    // ➡️ THÁNG SAU
    const nextMonth = () => {
        if (month === 12) {
            setMonth(1);
            setYear(y => y + 1);
        } else {
            setMonth(m => m + 1);
        }
    };

    if (loading) {
        return <h3 style={{ textAlign: "center" }}>Đang tải phiếu lương...</h3>;
    }

    if (!data) {
        return <h3 style={{ textAlign: "center" }}>Không tìm thấy phiếu lương</h3>;
    }

    // ✅ TÍNH TOÁN
    const tongThuNhap =
        data.luong_co_ban * data.he_so_luong +
        data.phu_cap +
        data.thuong;

    const tongKhoanTru =
        data.bhyt +
        data.bhxh +
        data.phat;

    const thucLinh =
        tongThuNhap -
        tongKhoanTru +
        data.luong_no_thang_truoc;

    return (
        <div className="pl-wrapper">
            {/* HEADER */}
            <div className="pl-header">
                <button onClick={() => navigate(`/employee/${id}`)}>←</button>
                <h2>Phiếu lương</h2>

                <div className="pl-month">
                    <button onClick={prevMonth}>‹</button>
                    <span>{month} / {year}</span>
                    <button onClick={nextMonth}>›</button>
                </div>
            </div>

            {/* TABLE */}
            <table className="pl-table">
                <tbody>
                <tr><th colSpan="2">Thông tin nhân viên</th></tr>
                <tr><td>Họ và tên</td><td>{data.ho_ten || "—"}</td></tr>
                <tr><td>Mã NV</td><td>{data.ma_nhan_vien}</td></tr>
                <tr><td>Chức vụ</td><td>{data.chuc_vu || "—"}</td></tr>

                <tr><th colSpan="2">Các khoản thu nhập</th></tr>
                <tr><td>Lương cơ bản</td><td>{data.luong_co_ban.toLocaleString()}</td></tr>
                <tr><td>Phụ cấp</td><td>{data.phu_cap.toLocaleString()}</td></tr>
                <tr><td>Thưởng</td><td>{data.thuong.toLocaleString()}</td></tr>
                <tr className="bold">
                    <td>Tổng thu nhập (1)</td>
                    <td>{tongThuNhap.toLocaleString()}</td>
                </tr>

                <tr><th colSpan="2">Các khoản trừ</th></tr>
                <tr><td>BHYT</td><td>{data.bhyt.toLocaleString()}</td></tr>
                <tr><td>BHXH</td><td>{data.bhxh.toLocaleString()}</td></tr>
                <tr><td>Phạt</td><td>{data.phat.toLocaleString()}</td></tr>
                <tr className="bold">
                    <td>Tổng các khoản trừ (2)</td>
                    <td>{tongKhoanTru.toLocaleString()}</td>
                </tr>

                <tr>
                    <td>Lương thiếu tháng trước (3)</td>
                    <td>{data.luong_no_thang_truoc.toLocaleString()}</td>
                </tr>

                <tr className={`final ${thucLinh < 0 ? "negative" : ""}`}>
                    <td>THỰC LĨNH = (1) - (2) + (3)</td>
                    <td>{thucLinh.toLocaleString()}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}
