import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./components/Login";
import QuenPass from "./components/QuenPass";
import Employee from "./components/Employee";
import SinhNhat from "./components/SinhNhat";
import HoSo from "./components/HoSo";
import PhieuLuong from "./components/PhieuLuong";
import BangCong from "./components/BangCong";
import GuiEmail from "./components/GuiEmail";
import ResetPass from "./components/ResetPass";
import Kpi from "./components/Kpi";
import CongTac from "./components/CongTac";
function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/forgot" element={<QuenPass />} />

                {/* Trang nhân viên */}
                <Route path="/employee/:ma_nhan_vien" element={<Employee />} />

                {/* Các tính năng */}
                <Route path="/employee/:ma_nhan_vien/sinhnhat" element={<SinhNhat />} />
                <Route path="/employee/:ma_nhan_vien/hoso" element={<HoSo />} />
                <Route path="/employee/:ma_nhan_vien/phieuluong" element={<PhieuLuong />} />
                <Route path="/employee/:ma_nhan_vien/bangcong" element={<BangCong />} />
                <Route path="/employee/:ma_nhan_vien/email" element={<GuiEmail />} />
                <Route path="/employee/:ma_nhan_vien/kpi" element={<Kpi />} />
                <Route path="/employee/:ma_nhan_vien/congtac" element={<CongTac />}/>
                <Route path="/reset-password" element={<ResetPass />} />
            </Routes>
        </Router>
    );
}

export default App;
