import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../pages/SideBar.css";
import LogoCompany from "../image/LogoCompany.webp";
import Overview from "../image/OverView.png";
import Branch from "../image/BranchManagement.png"
import Depart from "../image/DepartmentManagement.png"
import employ from "../image/EmployeePiture.png"
import Salary from "../image/SalaryStatistics.png"
import BH from "../image/BaoHiem.png"
import BHXH from "../image/BHXH.png"
import BHYT from "../image/BHYT.png"
import TP from "../image/ThuongPhat.png"
import Khen from "../image/Khen.jpg"
import Phat from "../image/kiluat.jpg"
import CT from "../image/CongTac.png"
import KPI from "../image/KPI.png"











export default function SideBar() {
    const [openBaoHiem, setOpenBaoHiem] = useState(false);
    const [openThuongPhat, setOpenThuongPhat] = useState(false);
    const role = localStorage.getItem("role");
    const isAdmin = role === "tonggiamdoc";
    const isBranch = role === "giamdoc_cn";
    return (
        <nav className="sidebar">
            <div className="logo">
                <img src={LogoCompany} alt="Logo" />
            </div>

            <ul>
                <li>
                    <img src={Overview} alt="" />
                    <Link to="/overview">Tổng quan</Link>
                </li>


                {isAdmin && (
                    <li>
                        <img src={Branch} alt="" />
                        <Link to="/branches">Quản lí chi nhánh</Link>
                    </li>
                )}

                {(isAdmin || isBranch) && (
                    <li>
                        <img src={Depart} alt="" />
                        <Link to="/departments">Quản lý phòng ban</Link>
                    </li>
                )}

                <li>
                    <img src={employ} alt="" />
                    <Link to="/employees">Quản lý nhân viên</Link>
                </li>
                <li>
                    <img src={Salary} alt="" />
                    <Link to="/salaries">Thống kê tiền lương</Link>
                </li>

                <ul>
                    <li
                        className="menu-parent"
                        onClick={() => setOpenBaoHiem(!openBaoHiem)}
                        style={{ cursor: "pointer" }}
                    >
                        <img src={BH} alt="" />
                        <span>Bảo Hiểm</span>
                    </li>

                    {openBaoHiem && (
                        <ul className="submenu">
                            <li>
                                <img src={BHXH} alt="" />
                                <Link to="/bhxh">BHXH</Link>
                            </li>
                            <li>
                                <img src={BHYT} alt="" />
                                <Link to="/bhyt">BHYT</Link>
                            </li>
                        </ul>
                    )}
                </ul>
                <ul>
                    <li
                        className="menu-parent"
                        onClick={() => setOpenThuongPhat(!openThuongPhat)}
                        style={{ cursor: "pointer" }}
                    >
                        <img src={TP} alt="" />
                        <span>Khen Thưởng</span>
                    </li>

                    {openThuongPhat && (
                        <ul className="submenu">
                            <li>
                                <img src={Khen} alt="" />
                                <Link to="/thuong">Khen Thưởng</Link>
                            </li>
                            <li>
                                <img src={Phat} alt="" />
                                <Link to="/kiluat">Kỉ Luật</Link>
                            </li>
                        </ul>
                    )}
                </ul>
                <li>
                    <img src={CT} alt="" />
                    <Link to="/congtac">Công Tác</Link>
                </li>
                <li>
                    <img src={KPI} alt=""/>
                    <Link to="/kpi">KPI</Link>
                </li>
            </ul>
        </nav>
    );
}
