import React from "react";
import { Link } from "react-router-dom";
import "../pages/SideBar.css"

export default function SideBar() {
    return (
        <nav className="sidebar">
            <div className="logo">
                <img src="/image/LogoCompany.webp" alt="Logo" />
            </div>
            <ul>
                <li>
                    <img src="/image/OverView.png" alt=""/>
                    <Link to="/overview">Tổng quan</Link>
                </li>
                <li>
                    <img src="/image/UpdateInfor.png" alt=""/>
                    <Link to="/update">Cập nhật thông tin</Link>
                </li>
                <li>
                    <img src="/image/SendMail.png" alt=""/>
                    <Link to="/sendmail">Gửi Email</Link>
                </li>
                <li>
                    <img src="/image/BranchManagement.png" alt=""/>
                    <Link to="/branches">Quản lí chi nhánh</Link>
                </li>
                <li>
                    <img src="/image/DepartmentManagement.png" alt=""/>
                    <Link to="/departments">Quản lý phòng ban</Link>
                </li>
                <li>
                    <img src="/image/EmployeeManagement.png" alt=""/>
                    <Link to="/employees">Quản lý nhân viên</Link>
                </li>
                <li>
                    <img src="/image/SalaryStatistics.png" alt=""/>
                    <Link to="/salaries">Thống kê tiền lương</Link>
                </li>
            </ul>
        </nav>
    );
}