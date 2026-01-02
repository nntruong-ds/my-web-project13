import React from "react";
import {useState, useEffect} from "react";
import styles from "./SalaryStatistics.module.css";
import {exportSalary, getSalary} from "../../api/salary";

export default function SalaryStatistics() {
    const role = localStorage.getItem("role");
    const [salaryList, setSalaryList] = useState([]);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchDept, setSearchDept] = useState("");
    const [searchBranch, setSearchBranch] = useState("");
    const [searchCv, setSearchCv] = useState("");

    const today = new Date();

    const [searchMonth, setSearchMonth] = useState(today.getMonth() + 1);
    const [searchYear, setSearchYear] = useState(today.getFullYear());
    const fetchSalary = async () => {
        try {
            const data = await getSalary({
                thang: searchMonth,
                nam: searchYear,
                mapb: searchDept,
                macn: searchBranch,
                macv: searchCv,
                keyword: searchKeyword
            });
            let filtered = data;

            if (role === "truongphong") {
                filtered = data.filter(
                    item =>
                        item.ten_chuc_vu !== "Tổng Giám đốc" &&
                        item.ten_chuc_vu !== "Giám đốc Chi nhánh"
                );
            }

            setSalaryList(filtered);
        } catch (err) {
            console.error(err);
            setSalaryList([]);
        }
    };
    useEffect(() => {
        fetchSalary();
    }, []);

    useEffect(() => {
        fetchSalary();
    }, [searchMonth, searchYear, searchDept, searchBranch, searchCv,searchKeyword]);

    const [selectedItem, setSelectedItem] = useState(null);

    const handleSelect = (item) => {
        setSelectedItem(item);

    };

    const handleExport = async () => {
        try {
            const filters = {
                keyword: searchKeyword.trim(),
                thang: searchMonth ? Number(searchMonth) : null,
                nam: searchYear ? Number(searchYear) : null,
                mapb: searchDept.trim(),
                macn: searchBranch.trim(),
                macv: searchCv.trim()
            };

            const blob = await exportSalary(filters);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "danh_sach_luong.xlsx";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error(err);
            alert("Xuất Excel thất bại");
        }
    };
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <button className={styles.navBtn}
                            onClick={() => {
                                if (searchMonth === 1) {
                                    setSearchMonth(12);
                                    setSearchYear(y => y - 1);
                                } else setSearchMonth(m => m - 1);
                            }}
                    >◀</button>

                    Danh Sách Lương Nhân Viên THÁNG {searchMonth}-{searchYear}

                    <button className={styles.navBtn}
                            onClick={() => {
                                if (searchMonth === 12) {
                                    setSearchMonth(1);
                                    setSearchYear(y => y + 1);
                                } else setSearchMonth(m => m + 1);
                            }}
                    >▶</button>

                </div>
                <div className={styles.table_wrapper}>
                    <table>
                        <thead>
                        <tr>
                            <th>MÃ NV</th>
                            <th>TÊN NV</th>
                            <th>Chức Vụ</th>
                            <th>Phụ Cấp</th>
                            <th>Tăng Ca</th>
                            <th>Bảo Hiểm Y Tế</th>
                            <th>Bảo Hiểm Xã Hội</th>
                            <th>Tổng Lương</th>
                        </tr>
                        </thead>
                        <tbody>
                        {salaryList.map(item => (
                            <tr key={item.ma_nhan_vien}
                                onClick={() => handleSelect(item)}
                                style={{
                                    cursor: "pointer",
                                    backgroundColor:
                                        selectedItem?.ma_nhan_vien === item.ma_nhan_vien
                                            ? "#d0ebff"
                                            : "white",
                                }}
                            >
                                <td>{item.ma_nhan_vien}</td>
                                <td>{item.ten_nhan_vien}</td>
                                <td>{item.ten_chuc_vu}</td>
                                <td>{item.phu_cap}</td>
                                <td>{item.tien_tang_ca}</td>
                                <td>{item.bhyt}</td>
                                <td>{item.bhxh}</td>
                                <td>{item.tong_luong}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className={styles.func}>
                <div className={styles.search}>
                    <b>Tìm Kiếm</b>
                    <div className={styles.row}>
                        <div className={styles.group}>
                            <input
                                type="text"
                                placeholder="Chi nhánh"
                                value={searchBranch}
                                onChange={(e) => setSearchBranch(e.target.value)}
                            />
                        </div>
                        <div className={styles.group}>
                            <input
                                type="text"
                                placeholder="Chức vụ"
                                value={searchCv}
                                onChange={(e) => setSearchCv(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.group}>
                            <input
                                type="text"
                                placeholder="Phòng ban"
                                value={searchDept}
                                onChange={(e) => setSearchDept(e.target.value)}
                            />
                        </div>
                        <div className={styles.group}>
                            <input
                                type="text"
                                placeholder="Tìm kiếm"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button type="submit">Tìm</button>
                </div>
                {role !== "truongphong" && (
                <div className={styles.other}>
                    <h3>Tùy chọn khác</h3>
                        <div className={styles.action}>
                            <div>Xuất ra Excel</div>
                            <button onClick={handleExport}>Xuất</button>
                        </div>
                </div>
                )}
            </div>
        </div>
    );
}