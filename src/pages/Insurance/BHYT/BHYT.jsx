import React, {useEffect, useState} from "react";
import styles from "./BHYT.module.css";
import {getBHYT, updateBHYT, exportBHYT, createBHYT} from "../../../api/bhyt";

export default function BHYT() {
    const [bhytList, setBhytList] = useState([]);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchDept, setSearchDept] = useState("");
    const [searchBranch, setSearchBranch] = useState("");

    const today = new Date();

    const [searchMonth, setSearchMonth] = useState(today.getMonth() + 1);
    const [searchYear, setSearchYear] = useState(today.getFullYear());

    const fetchBHYT = async () => {
        try {
            const data = await getBHYT({
                keyword: searchKeyword,
                thang: searchMonth,
                nam: searchYear,
                mapb: searchDept,
                macn: searchBranch
            });
            setBhytList(data);
        } catch (err) {
            console.error(err);
            setBhytList([]);
        }
    };

    useEffect(() => {
        fetchBHYT();
    }, []);

    useEffect(() => {
        fetchBHYT();
    }, [searchKeyword, searchMonth, searchYear, searchDept, searchBranch]);

    const [showUpdate, setShowUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({
        ma_nhan_vien: "",
        so_the_bhyt: "",
        thang_nam: "",
        thang: "",
        trang_thai: ""
    });
    const [selectedItem, setSelectedItem] = useState(null);

    const handleSelect = (item) => {
        setSelectedItem(item);

        setUpdateData({
            ma_nhan_vien: item.ma_nhan_vien,
            so_the_bhyt: item.so_the_bhyt || "",
            thang_nam: item.thang_nam?.slice(0, 10) || "",
            thang: item.thang || "",
            trang_thai: item.trang_thai || ""
        });
    };

    const handleExport = async () => {
        try {
            const filters = {
                keyword: searchKeyword.trim(),
                thang: searchMonth ? Number(searchMonth) : null,
                nam: searchYear ? Number(searchYear) : null,
                mapb: searchDept.trim(),
                macn: searchBranch.trim()
            };

            const blob = await exportBHYT(filters);

            // Tạo link download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "danh_sach_bhyt.xlsx";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error(err);
            alert("Xuất Excel thất bại");
        }
    };

    const handleUpdate = async () => {
        try {
            const payload = {
                ma_nhan_vien: updateData.ma_nhan_vien,
                so_the_bhyt: updateData.so_the_bhyt,
                thang_nam: updateData.thang_nam,
                thang: Number(updateData.thang),
                trang_thai: updateData.trang_thai
            };

            await updateBHYT(payload);

            alert("Cập nhật BHYT thành công");
            setShowUpdate(false);
            fetchBHYT();

        } catch (err) {
            console.error(err);
            alert("Cập nhật BHYT thất bại");
        }
    };

    const [createData, setCreateData] = useState({
        ma_nhan_vien: "",
        so_the_bhyt: "",
        trang_thai: ""
    });

    const [showCreate, setShowCreate] = useState(false);
    const handleCreate = async () => {
        try {
            const payload = {
                ma_nhan_vien: createData.ma_nhan_vien,
                so_the_bhyt: createData.so_the_bhyt,
                thang_nam: createData.thang_nam,
                thang: Number(createData.thang),
                trang_thai: createData.trang_thai
            };

            await createBHYT(payload);

            alert("Tạo BHYT thành công");

            setCreateData({
                ma_nhan_vien: "",
                so_the_bhyt: "",
                trang_thai: ""
            });

            fetchBHYT();

        } catch (err) {
            console.error(err);
            alert("Tạo BHYT thất bại");
        }
    }

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

                    THEO DÕI ĐÓNG BHYT THÁNG {searchMonth}-{searchYear}

                    <button  className={styles.navBtn}
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
                            <th>MÃ BHYT</th>
                            <th>CHI NHÁNH</th>
                            <th>PHÒNG BAN</th>
                            <th>Tháng/Năm</th>
                            <th>Trạng Thái</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bhytList.map((item) => (
                            <tr
                                key={item.ma_nhan_vien + item.thang_nam}
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
                                <td>{item.so_the_bhyt}</td>
                                <td>{item.ten_chi_nhanh}</td>
                                <td>{item.ten_phong_ban}</td>
                                <td>{item.thang_nam}</td>
                                <td>{item.trang_thai}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
                <div className={styles.container1}>
                    <div className={styles.func}>
                        <div className={styles.search}>
                            <b>Tìm Kiếm</b>
                            <div className={styles.row}>
                                <input
                                    type="text"
                                    placeholder="Chi nhánh"
                                    value={searchBranch}
                                    onChange={(e) => setSearchBranch(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Phòng ban"
                                    value={searchDept}
                                    onChange={(e) => setSearchDept(e.target.value)}
                                />
                            </div>

                            <div className={styles.row}>
                                <input
                                    className={styles.fullInput}
                                    type="text"
                                    placeholder="Tìm theo tên, mã NV"
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                />
                                <button onClick={fetchBHYT}>Tìm</button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.other}>
                        <h3>Tùy chọn khác</h3>
                        <div className={styles.action}>
                            <div>Xuất ra Excel</div>
                            <button onClick={handleExport}>Xuất</button>
                        </div>
                        <div className={styles.action}>
                            <button
                                onClick={() => {
                                    if (!selectedItem) {
                                        alert("Vui lòng chọn 1 dòng để cập nhật");
                                        return;
                                    }
                                    setShowUpdate(true);
                                }}
                            >
                                Cập Nhật
                            </button>
                            <button onClick={() => setShowCreate(true)}>Thêm</button>
                        </div>
                    </div>
                </div>
            {showUpdate && (
                <div className={styles.overlay}>
                    <div className={styles.updateBox}>
                        <h3>Cập nhật BHYT</h3>

                        <input value={updateData.ma_nhan_vien} disabled />

                        <input
                            value={updateData.so_the_bhyt} disabled />
                        />

                        <input
                            value={updateData.thang_nam}
                            disabled />

                        <input
                            value={updateData.thang}
                            disabled/>

                        <select
                            value={updateData.trang_thai}
                            onChange={e => setUpdateData({...updateData, trang_thai: e.target.value})}
                        >
                            <option value="">-- Trạng thái --</option>
                            <option value="hoat_dong">hoat_dong</option>
                            <option value="het_han">het_han</option>
                        </select>

                        <div className={styles.actions}>
                            <button onClick={handleUpdate}>Lưu</button>
                            <button onClick={() => setShowUpdate(false)}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
            {showCreate && (
                <div className={styles.overlay}>
                    <div className={styles.updateBox}>
                        <h3>Thêm BHXH</h3>

                        <input
                            placeholder="Mã nhân viên"
                            value={createData.ma_nhan_vien}
                            onChange={e =>
                                setCreateData({...createData, ma_nhan_vien: e.target.value})
                            }
                        />

                        <input
                            placeholder="Mã BHYT"
                            value={createData.so_the_bhyt}
                            onChange={e =>
                                setCreateData({...createData, so_the_bhyt: e.target.value})
                            }
                        />

                        <input
                            type="date"
                            value={createData.thang_nam}
                            onChange={e => setCreateData({...createData, thang_nam: e.target.value})}
                        />
                        <input
                            type="number"
                            placeholder="Tháng"
                            value={createData.thang}
                            onChange={e => setCreateData({...createData, thang: e.target.value})}
                        />

                        <select
                            value={createData.trang_thai}
                            onChange={e =>
                                setCreateData({...createData, trang_thai: e.target.value})
                            }
                        >
                            <option value="">-- Trạng thái --</option>
                            <option value="hoat_dong">Hoạt động</option>
                            <option value="het_han">Hết hạn</option>
                        </select>

                        <div className={styles.actions}>
                            <button onClick={handleCreate}>Lưu</button>
                            <button onClick={() => setShowCreate(false)}>Hủy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}