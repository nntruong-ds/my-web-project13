import React from "react";
import { Link } from "react-router-dom";
import {useState} from "react";
import "../pages/SideBar.css"

export default function SideBar() {
    const [openBaoHiem, setOpenBaoHiem] = useState(false);
    const [openThuongPhat, setOpenThuongPhat] = useState(false);
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
                    <img src="/image/HoSo.png" alt=""/>
                    <Link to="/hoso">Hồ Sơ Của Bạn</Link>
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
                <ul>
                    <li className="menu-parent"
                        onClick={() => setOpenBaoHiem(!openBaoHiem)}
                        style={{ cursor: "pointer" }}>
                        <img src="/image/BaoHiem.png" alt=""/>
                        <span>Bảo Hiểm</span>
                    </li>
                    {openBaoHiem && (
                        <ul className="submenu">
                            <li>
                                <img src="/image/BHXH.png" alt="" />
                                <Link to="/bhxh">BHXH</Link>
                            </li>

                            <li>
                                <img src="/image/BHYT.png" alt="" />
                                <Link to="/bhyt">BHYT</Link>
                            </li>
                        </ul>
                    )}
                </ul>
                <ul>
                    <li className="menu-parent"
                        onClick={() => setOpenThuongPhat(!openThuongPhat)}
                        style={{ cursor: "pointer"}}>
                        <img src="/image/ThuongPhat.png" alt=""/>
                        <span>Khen Thưởng</span>
                    </li>
                    {openThuongPhat && (
                        <ul className="submenu">
                            <li>
                                <img src="/image/Khen.jpg" alt="" />
                                <Link to="/thuong">Khen Thưởng</Link>
                            </li>

                            <li>
                                <img src="/image/Phạt.jpg" alt="" />
                                <Link to="/kiluat">Kỉ Luật</Link>
                            </li>
                        </ul>
                    )}
                </ul>
                <li>
                    <img src="/image/CongTac.png" alt=""/>
                    <Link to="/congtac">Công Tác</Link>
                </li>
            </ul>
        </nav>
    );
}