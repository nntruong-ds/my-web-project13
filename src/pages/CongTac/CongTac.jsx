import React, { useEffect, useState } from "react";
import styles from "./CongTac.module.css";
import { getWorkTrips, createWorkTrip, exportWorkTrips, updateCT} from "../../api/congtac";
import {updateBHXH} from "../../api/bhxh";
export default function CongTac() {
    const [workTrips, setWorkTrips] = useState([]);

    const [searchKeyword, setSearchKeyword] = useState(""); // keyword - Tên hoặc Mã NV
    const [searchBranch, setSearchBranch] = useState(""); // chi_nhanh
    const [searchDept, setSearchDept] = useState(""); // phong_ban_id
    const [searchMonth, setSearchMonth] = useState(""); // thang
    const [searchYear, setSearchYear] = useState(""); // nam


    const fetchTrips = async () => {
        try {
            const data = await getWorkTrips({
                keyword: searchKeyword,
                thang: searchMonth,
                nam: searchYear,
                phong_ban_id: searchDept,
                chi_nhanh: searchBranch
            });

            setWorkTrips(data);
        } catch (err) {
            console.error(err);
            setWorkTrips([]);
        }
    };
    useEffect(() => {
        fetchTrips();
    }, []);
    useEffect(() => {
        fetchTrips();
    }, [searchKeyword, searchMonth, searchYear, searchDept, searchBranch]);

    const [selectedItem, setSelectedItem] = useState(null);
    const handleSelect = (item) => {
        setSelectedItem(item);

        setUpdateData({
            ma_nv: item.ma_nhan_vien,
            pb_id: item.phong_ban_id || "",
            cv_id: item.chuc_vu_id || "",
            tu_ngay: item.tu_ngay?.slice(0,10),
            den_ngay: item.den_ngay?.slice(0,10),
            chi_nhanh: item.chi_nhanh || "",
            dia_diem: item.dia_diem || "",
            thang: item.thang || "",
        });
    };

    const [showUpdate, setShowUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({
        ma_nv: "",
        pb_id: "",
        cv_id: "",
        tu_ngay: "",
        den_ngay: "",
        chi_nhanh: "",
        dia_diem: "",
        thang: "",
    });

    const handleUpdate = async () => {
        try {
            await updateCT({
                ma_nv: updateData.ma_nv,
                pb_id: updateData.pb_id,
                cv_id: updateData.cv_id,
                tu_ngay: updateData.tu_ngay,

                data: {
                    den_ngay: updateData.den_ngay ,
                    chi_nhanh: updateData.chi_nhanh ,
                    dia_diem: updateData.dia_diem,
                    thang: Number(updateData.thang)
                }

            });
            alert("Cập nhật danh sách công tác thành công");
            setShowUpdate(false);
            fetchTrips();
        } catch (err) {
            console.error(err);
            alert("Cập nhật danh sách công tác thất bại");
        }
    };


    const [createData, setCreateData] = useState({
        ma_nhan_vien: "",
        phong_ban_id: "",
        chuc_vu_id: "",
        tu_ngay: "",
        den_ngay: "",
        chi_nhanh: "",
        dia_diem: "",
        thang: ""
    });

    const [showCreate, setShowCreate] = useState(false);
    const handleCreate = async () => {
        try {
            const payload = {
                ma_nhan_vien: createData.ma_nhan_vien.trim(),
                phong_ban_id: createData.phong_ban_id.trim(),
                chuc_vu_id: createData.chuc_vu_id.trim(),
                tu_ngay: createData.tu_ngay,
                den_ngay: createData.den_ngay || null,
                chi_nhanh: createData.chi_nhanh || null,
                dia_diem: createData.dia_diem || null,
                thang: Number(createData.thang)
            };
            await createWorkTrip(payload);
            alert("Thêm công tác thành công");
            await fetchTrips();

            // reset form
            setCreateData({
                ma_nhan_vien: "",
                phong_ban_id: "",
                chuc_vu_id: "",
                tu_ngay: "",
                den_ngay: "",
                chi_nhanh: "",
                dia_diem: "",
                thang: ""
            });

        } catch (err) {
            console.error(err);
            alert("Thêm công tác thất bại");
        }
    };

    const handleExport = async () => {
        try {
            const filters = {
                keyword: searchKeyword.trim(),
                thang: searchMonth ? Number(searchMonth) : null,
                nam: searchYear ? Number(searchYear) : null,
                phong_ban_id: searchDept.trim(),
                chi_nhanh: searchBranch.trim()
            };

            const blob = await exportWorkTrips(filters);

            // Tạo link download
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "danh_sach_cong_tac.xlsx";
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
                <div className={styles.header}>DANH SÁCH CÔNG TÁC</div>
                <div className={styles.table_wrapper}>
                    <table>
                        <thead>
                        <tr>
                            <th>MÃ NV</th>
                            <th>TÊN NV</th>
                            <th>Phòng Ban</th>
                            <th>Chi Nhánh</th>
                            <th>Chức Vụ</th>
                            <th>Địa Điểm</th>
                            <th>Từ Ngày</th>
                            <th>Đến Ngày</th>
                            <th>Tháng</th>
                        </tr>
                        </thead>
                        <tbody>
                        {workTrips.map((ct) => (
                            <tr
                                key={ct.ma_nhan_vien + ct.tu_ngay}
                                onClick={() => handleSelect(ct)}
                                style={{
                                    cursor: "pointer",
                                    backgroundColor:
                                        selectedItem?.ma_nhan_vien === ct.ma_nhan_vien
                                            ? "#d0ebff"
                                            : "white",
                                }}
                            >
                                <td>{ct.ma_nhan_vien}</td>
                                <td>{ct.ten_nhan_vien}</td>
                                <td>{ct.ten_phong_ban}</td>
                                <td>{ct.chi_nhanh}</td>
                                <td>{ct.ten_chuc_vu}</td>
                                <td>{ct.dia_diem}</td>
                                <td>{ct.tu_ngay}</td>
                                <td>{ct.den_ngay}</td>
                                <td>{ct.thang}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SEARCH */}
            <div className={styles.container1}>
                <div className={styles.func}>
                    <div className={styles.search}>
                        <b>Tìm Kiếm</b>

                        <div className={styles.row}>
                            <input
                                placeholder="Chi nhánh"
                                value={searchBranch}
                                onChange={e => setSearchBranch(e.target.value)}
                            />
                            <input
                                placeholder="Phòng ban"
                                value={searchDept}
                                onChange={e => setSearchDept(e.target.value)}
                            />
                        </div>

                        <div className={styles.row}>
                            <input
                                type="number"
                                placeholder="Tháng"
                                value={searchMonth}
                                onChange={e => setSearchMonth(Number(e.target.value))}
                            />
                            <input
                                type="number"
                                placeholder="Năm"
                                value={searchYear}
                                onChange={e => setSearchYear(Number(e.target.value))}
                            />
                        </div>

                        <div className={styles.row}>
                            <input
                                className={styles.fullInput}
                                placeholder="Tên hoặc mã nhân viên"
                                value={searchKeyword}
                                onChange={e => setSearchKeyword(e.target.value)}
                            />
                            <button onClick={fetchTrips}>Tìm</button>
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
                    <div className={styles.createBox}>
                        <h3>Cập Nhật công tác</h3>

                        <input
                            placeholder="Mã NV"
                            value={updateData.ma_nv}
                            readOnly
                        />

                        <input
                            type="text"
                            placeholder="Phòng ban id"
                            value={updateData.pb_id}
                            onChange={e => setUpdateData({...updateData, pb_id: e.target.value})}
                        />

                        <input
                            type="text"
                            placeholder="Chức vụ id"
                            value={updateData.cv_id}
                            onChange={e => setUpdateData({...updateData, cv_id: e.target.value})}
                        />

                        <input
                            type="date"
                            value={updateData.tu_ngay}
                            readOnly
                        />


                        <input type="date"
                               value={updateData.den_ngay}
                               onChange={e => setUpdateData({...updateData, den_ngay: e.target.value})}
                        />

                        <input placeholder="Chi nhánh"
                               value={updateData.chi_nhanh}
                               onChange={e => setUpdateData({...updateData, chi_nhanh: e.target.value})}
                        />

                        <input placeholder="Địa điểm"
                               value={updateData.dia_diem}
                               onChange={e => setUpdateData({...updateData, dia_diem: e.target.value})}
                        />

                        <input type="number" placeholder="Tháng"
                               value={updateData.thang}
                               onChange={e => setUpdateData({...updateData, thang: e.target.value})}
                        />

                        <button onClick={handleUpdate}>Cập Nhật</button>
                        <button
                            className={styles.cancelBtn}
                            onClick={() => {
                                setShowUpdate(false);
                            }}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}
            {showCreate && (
                <div className={styles.overlay}>
                    <div className={styles.createBox}>
                        <h3>Thêm công tác</h3>

                        <input placeholder="Mã NV"
                               value={createData.ma_nhan_vien}
                               onChange={e => setCreateData({...createData, ma_nhan_vien: e.target.value})}
                        />

                        <input placeholder="Phòng ban ID"
                               value={createData.phong_ban_id}
                               onChange={e => setCreateData({...createData, phong_ban_id: e.target.value})}
                        />

                        <input placeholder="Chức vụ ID"
                               value={createData.chuc_vu_id}
                               onChange={e => setCreateData({...createData, chuc_vu_id: e.target.value})}
                        />

                        <input type="date"
                               value={createData.tu_ngay}
                               onChange={e => setCreateData({...createData, tu_ngay: e.target.value})}
                        />

                        <input type="date"
                               value={createData.den_ngay}
                               onChange={e => setCreateData({...createData, den_ngay: e.target.value})}
                        />

                        <input placeholder="Chi nhánh"
                               value={createData.chi_nhanh}
                               onChange={e => setCreateData({...createData, chi_nhanh: e.target.value})}
                        />

                        <input placeholder="Địa điểm"
                               value={createData.dia_diem}
                               onChange={e => setCreateData({...createData, dia_diem: e.target.value})}
                        />

                        <input type="number" placeholder="Tháng"
                               value={createData.thang}
                               onChange={e => setCreateData({...createData, thang: e.target.value})}
                        />

                        <button onClick={handleCreate}>Thêm</button>
                        <button
                            className={styles.cancelBtn}
                            onClick={() => {
                                setShowCreate(false);
                                setCreateData({
                                    ma_nhan_vien: "",
                                    phong_ban_id: "",
                                    chuc_vu_id: "",
                                    tu_ngay: "",
                                    den_ngay: "",
                                    chi_nhanh: "",
                                    dia_diem: "",
                                    thang: ""
                                });
                            }}
                        >
                            Hủy
                        </button>
                    </div>
                </div>

                )}
        </div>
    );

}