import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OverView from "./pages/OverView/OverView";
import UpdateInfor from "./pages/UpdateInfor/UpdateInfor";
import SendMail from "./pages/SendMail/SendMail";
import BranchManagement from "./pages/BranchManagement/BranchManagement";
import DepartmentManagement from "./pages/DepartmentManagement/DepartmentManagement";
import EmployeeManagement from "./pages/EmployeeManagement/EmployeeManagement";
import SalaryStatistics from "./pages/SalaryStatistics/SalaryStatistics";

import BHXH from "./pages/Insurance/BHXH/BHXH";
import BHYT from "./pages/Insurance/BHYT/BHYT";
import Khen from "./pages/KhenThuong/Khen/Khen";
import Phat from "./pages/KhenThuong/Phat/Phat";
import CT from "./pages/CongTac/CongTac";
import HoSo from "./pages/HoSo/HoSo";
import Login from "./pages/Login/Login";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

export default function App() {
    const isLoginPage = window.location.pathname === "/"; // kiểm tra nếu đang ở /login
    return (
        <Router>
                    <Routes>
                        {/* Layout không Sidebar (login) */}
                        <Route element={<AuthLayout />}>
                            <Route path="/" element={<Login />} />
                        </Route>

                        <Route element={<MainLayout />}>
                            <Route path="/overview" element={<OverView />} />
                            <Route path="/hoso" element={<HoSo />} />
                            <Route path="/update" element={<UpdateInfor />} />
                            <Route path="/sendmail" element={<SendMail />} />
                            <Route path="/branches" element={<BranchManagement />} />
                            <Route path="/departments" element={<DepartmentManagement />} />
                            <Route path="/employees" element={<EmployeeManagement />} />
                            <Route path="/salaries" element={<SalaryStatistics />} />
                            <Route path="/bhxh" element={<BHXH/>} />
                            <Route path="/bhyt" element={<BHYT/>} />
                            <Route path="/thuong" element={<Khen/>} />
                            <Route path="/kiluat" element={<Phat/>} />
                            <Route path="/congtac" element={<CT/>} />
                        </Route>
                    </Routes>
        </Router>
    );
}