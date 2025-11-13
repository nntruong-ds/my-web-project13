import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OverView from "./pages/OverView";
import UpdateInfor from "./pages/UpdateInfor/UpdateInfor";
import SendMail from "./pages/SendMail/SendMail";
import BranchManagement from "./pages/BranchManagement/BranchManagement";
import DepartmentManagement from "./pages/DepartmentManagement/DepartmentManagement";
import EmployeeManagement from "./pages/EmployeeManagement/EmployeeManagement";
import SalaryStatistics from "./pages/SalaryStatistics";
import SideBar from "./components/SideBar";

export default function App() {
    return (
        <Router>
            <div style={{ display: "flex" }}>
                <SideBar />
                <div style={{ flex: 1, padding: "20px" }}>
                    <Routes>
                        <Route path="/overview" element={<OverView />} />
                        <Route path="/update" element={<UpdateInfor />} />
                        <Route path="/sendmail" element={<SendMail />} />
                        <Route path="/branches" element={<BranchManagement />} />
                        <Route path="/departments" element={<DepartmentManagement />} />
                        <Route path="/employees" element={<EmployeeManagement />} />
                        <Route path="/salaries" element={<SalaryStatistics />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}