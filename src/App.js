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

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/forgot" element={<QuenPass />} />
                <Route path="/employee/:id" element={<Employee />} />
                {/* Các tính năng */}
                <Route path="/employee/:id/sinhnhat" element={<SinhNhat />} />
                <Route path="/employee/:id/hoso" element={<HoSo />} />
                <Route path="/employee/:id/phieuluong" element={<PhieuLuong />} />
                <Route path="/employee/:id/bangcong" element={<BangCong />} />
                <Route path="/employee/:id/email" element={<GuiEmail />} />
                <Route path="/reset-password" element={<ResetPass />} />
            </Routes>
        </Router>
    );
}

export default App;
