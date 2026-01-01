import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {useEffect} from "react";
import OverView from "./pages/OverView/OverView";
import BranchManagement from "./pages/BranchManagement/BranchManagement";
import DepartmentManagement from "./pages/DepartmentManagement/DepartmentManagement";
import EmployeeManagement from "./pages/EmployeeManagement/EmployeeManagement";
import SalaryStatistics from "./pages/SalaryStatistics/SalaryStatistics";

import BHXH from "./pages/Insurance/BHXH/BHXH";
import BHYT from "./pages/Insurance/BHYT/BHYT";
import CT from "./pages/CongTac/CongTac";
import KPI from "./pages/KPI/KPI";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";


export default function App() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const roleFromUrl = params.get("role");

        if (roleFromUrl) {
            localStorage.setItem("role", roleFromUrl);
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/overview" element={<OverView />} />
                    <Route path="/branches"
                           element={
                               <ProtectedRoute allowRoles={["tonggiamdoc"]}>
                                   <BranchManagement />
                               </ProtectedRoute>
                           }
                    />
                    <Route path="/departments"
                           element={
                               <ProtectedRoute allowRoles={["tonggiamdoc", "giamdoc_cn"]}>
                                   <DepartmentManagement />
                               </ProtectedRoute>
                           }
                    />
                    <Route path="/employees"
                           element={
                               <ProtectedRoute allowRoles={["tonggiamdoc", "giamdoc_cn", "truongphong"]}>
                                   <EmployeeManagement />
                               </ProtectedRoute>
                           }
                    />
                    <Route path="/salaries" element={<SalaryStatistics />} />
                    <Route path="/bhxh" element={<BHXH/>} />
                    <Route path="/bhyt" element={<BHYT/>} />
                    <Route path="/congtac" element={<CT/>} />
                    <Route path="/kpi" element={<KPI/>} />
                </Route>
            </Routes>
        </Router>
    );
}