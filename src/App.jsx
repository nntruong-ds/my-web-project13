import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OverView from "./pages/OverView/OverView";
import UpdateInfor from "./pages/UpdateInfor/UpdateInfor";
import SendMail from "./pages/SendMail/SendMail";
import BranchManagement from "./pages/BranchManagement/BranchManagement";
import DepartmentManagement from "./pages/DepartmentManagement/DepartmentManagement";
import EmployeeManagement from "./pages/EmployeeManagement/EmployeeManagement";
import SalaryStatistics from "./pages/SalaryStatistics/SalaryStatistics";
import SideBar from "./components/SideBar";
import BHXH from "./pages/Insurance/BHXH/BHXH";
import BHYT from "./pages/Insurance/BHYT/BHYT";
import Khen from "./pages/KhenThuong/Khen/Khen";
import Phat from "./pages/KhenThuong/Phat/Phat";
import CT from "./pages/CongTac/CongTac";
import HoSo from "./pages/HoSo/HoSo";
import Login from "./pages/Login/Login";

export default function App() {
    const isLoginPage = window.location.pathname === "/"; // kiểm tra nếu đang ở /login
    return (
        <Router>
            <div style={{ display: "flex" }}>
                <SideBar />
                <div style={{ flex: 1, padding: "20px" }}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
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
                    </Routes>
                </div>
            </div>
        </Router>
    );
}