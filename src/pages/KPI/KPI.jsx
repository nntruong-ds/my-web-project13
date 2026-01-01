import React, { useEffect, useState } from "react";
import styles from "../KPI/KPI.module.css";
import {getKPI, exportKPI, updateKpi, createKpi, getKpi1} from "../../api/kpi";

export default function KPI(){
    const [kpiList, setKpiList] = useState([]);
    const [kpiDetail, setKpiDetail] = useState([]);

    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchDept, setSearchDept] = useState("");
    const [searchBranch, setSearchBranch] = useState("");

    const today = new Date();

    const [searchMonth, setSearchMonth] = useState(today.getMonth() + 1);
    const [searchYear, setSearchYear] = useState(today.getFullYear());

    const fetchKpi = async () => {
        try {
            const data = await getKPI({
                thang: searchMonth,
                nam: searchYear,
                mapb: searchDept,
                macn: searchBranch,
                keyword: searchKeyword
            });
            setKpiList(data);
        } catch (err) {
            console.error(err);
            setKpiList([]);
        }
    };

    useEffect(() => {
        fetchKpi();
    }, [searchMonth, searchYear, searchDept, searchBranch, searchKeyword]);

    const [selectedItem, setSelectedItem] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    const handleSelect = async (item) => {
        setSelectedItem(item);

        try {
            const data = await getKpi1(item.ma_nhan_vien, {
                thang: searchMonth,
                nam: searchYear
            });

            setKpiDetail(Array.isArray(data) ? data : []);
            setShowDetail(true);
        } catch (err) {
            console.error(err);
            setKpiDetail([]);
            setShowDetail(true);
        }

    };

    // Export
    const handleExport = async () => {
        try {
            const filters = {
                keyword: searchKeyword.trim(),
                thang: searchMonth ? Number(searchMonth) : null,
                nam: searchYear ? Number(searchYear) : null,
                mapb: searchDept.trim(),
                macn: searchBranch.trim()
            };

            const blob = await exportKPI(filters);

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "danh_sach_kpi.xlsx";
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error(err);
            alert("Xuất Excel thất bại");
        }
    };
    // Update
    const [showUpdate, setShowUpdate] = useState(false);
    const [updateData, setUpdateData] = useState({
        ma_nhan_vien: "",
        ten_kpi: "",
        ky_danh_gia: "",
        muc_tieu: "",
        thuc_te:"",
        don_vi_tinh:"",
        ghi_chu: "",
        trang_thai: ""
    });
    const handleUpdate = async () => {
        try {
            await updateKpi(
                updateData.ma_nhan_vien,
                updateData.ten_kpi,
                updateData.ky_danh_gia,
                {
                    muc_tieu: Number(updateData.muc_tieu),
                    thuc_te: Number(updateData.thuc_te),
                    don_vi_tinh: updateData.don_vi_tinh,
                    ghi_chu: updateData.ghi_chu,
                    trang_thai: updateData.trang_thai
                }
            );

            alert("Cập nhật KPI thành công");
            setShowUpdate(false);
            fetchKpi();

        } catch (err) {
            console.error(err);
            alert("Cập nhật KPI thất bại");
        }
    };

    // Create
    const [showCreate, setShowCreate] = useState(false);
    const [createData, setCreateData] = useState({
        ten_kpi: "",
        ky_danh_gia: "",
        muc_tieu: "",
        thuc_te: "",
        don_vi_tinh: "",
        ghi_chu: "",
        thang: searchMonth,
        nam: searchYear,
        ma_nhan_vien: ""
    });
    const handleCreate = async () => {
        try {
            await createKpi({
                ...createData,
                muc_tieu: Number(createData.muc_tieu),
                thuc_te: Number(createData.thuc_te),
                thang: Number(createData.thang),
                nam: Number(createData.nam)
            });

            alert("Thêm KPI thành công");
            setShowCreate(false);
            fetchKpi();

        } catch (err) {
            console.error(err);
            alert("Thêm KPI thất bại");
        }
    };


    return(
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

                    KPI THÁNG {searchMonth}-{searchYear}

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
                            <th>Mã nhân viên</th>
                            <th>Tên nhân viên</th>
                            <th>Tên phòng ban</th>
                            <th>Tên chi nhánh</th>
                            <th>Tỉ lệ hoàn thành</th>
                            <th>Đánh giá</th>
                            <th>Số lượng tiêu chí</th>
                        </tr>
                        </thead>
                        <tbody>
                        {kpiList.map((item, index) => (
                            <tr key={`${item.ma_nhan_vien}-${index}`}
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
                                <td>{item.ten_phong_ban}</td>
                                <td>{item.ten_chi_nhanh}</td>
                                <td>{item.kpi_trung_binh}</td>
                                <td>{item.danh_gia_chung}</td>
                                <td>{item.so_luong_tieu_chi}</td>
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
                                placeholder="Phòng ban"
                                value={searchDept}
                                onChange={(e) => setSearchDept(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={styles.row}>
                        <input
                            type="text"
                            placeholder="Tìm kiếm"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                    </div>
                    <button onClick={fetchKpi}>Tìm</button>
                </div>
                <div className={styles.other}>
                    <h3>Tùy chọn khác</h3>
                    <div className={styles.action}>
                        <div>Xuất ra Excel</div>
                        <button onClick={handleExport}>Xuất</button>
                    </div>
                    <div className={styles.action}>
                        <div>Thêm</div>
                        <button onClick={() => setShowCreate(true)}>Thêm</button>

                    </div>
                </div>
            </div>

            {showDetail && (
                <div className={styles.overlay}>
                    <div className={styles.showBox}>
                        {kpiDetail.length > 0 && (
                            kpiDetail.map((item, index) => (
                                <div key={index}
                                     className={styles.kpiItem}
                                     onClick={() => setSelectedItem(item)}
                                >
                                    <input value={item.ten_kpi || ""} readOnly placeholder="Tên KPI" />
                                    <input value={item.ky_danh_gia || ""} readOnly placeholder="Kỳ đánh giá" />
                                    <input value={item.muc_tieu ?? ""} readOnly placeholder="Mục tiêu" />
                                    <input value={item.thuc_te ?? ""} readOnly placeholder="Thực tế" />
                                    <input value={item.ty_le_hoan_thanh ?? ""} readOnly placeholder="Tỷ lệ hoàn thành (%)" />
                                    <input value={item.trang_thai || ""} readOnly placeholder="Trạng thái" />
                                    <input value={item.don_vi_tinh || ""} readOnly placeholder="Đơn vị tính" />

                                </div>
                            ))
                        )}

                        <div className={styles.actions}>
                            <button
                                onClick={() => {
                                    if (!selectedItem) {
                                        alert("Vui lòng chọn 1 KPI");
                                        return;
                                    }

                                    setUpdateData({
                                        ma_nhan_vien: selectedItem.ma_nhan_vien,
                                        ten_kpi: selectedItem.ten_kpi,
                                        ky_danh_gia: selectedItem.ky_danh_gia,
                                        muc_tieu: selectedItem.muc_tieu ?? "",
                                        thuc_te: selectedItem.thuc_te ?? "",
                                        don_vi_tinh: selectedItem.don_vi_tinh ?? "",
                                        ghi_chu: selectedItem.ghi_chu ?? "",
                                        trang_thai: selectedItem.trang_thai ?? ""
                                    });

                                    setShowUpdate(true);
                                }}
                            >
                                Cập nhật
                            </button>

                            <button onClick={() => setShowDetail(false)}>Đóng</button>
                        </div>

                    </div>
                </div>
            )}
            {showUpdate && (
                <div className={styles.overlay}>
                    <div className={styles.updateBox}>
                        <h3>Cập nhật Kpi</h3>

                        <input
                            placeholder="Mã nhân viên"
                            value={updateData.ma_nhan_vien}
                            readOnly
                        />

                        <input
                            placeholder="Tên Kpi"
                            value={updateData.ten_kpi || ""}
                            readOnly
                        />

                        <input
                            placeholder="Kỳ đánh giá"
                            value={updateData.ky_danh_gia}
                            readOnly
                        />

                        <input
                            type="text"
                            placeholder="Mục Tiêu"
                            value={updateData.muc_tieu}
                            onChange={e => setUpdateData({...updateData, muc_tieu: e.target.value})}
                        />
                        <input type="number"
                               placeholder="Thực tế"
                               value={updateData.thuc_te}
                               onChange={e => setUpdateData({...updateData, thuc_te: e.target.value})}
                        />
                        <input type="text"
                            placeholder="Đơn vị"
                               value={updateData.don_vi_tinh}
                               onChange={e => setUpdateData({...updateData, don_vi_tinh: e.target.value})}
                        />
                        <input type="text"
                            placeholder="Ghi chú"
                               value={updateData.ghi_chu}
                               onChange={e => setUpdateData({...updateData, ghi_chu: e.target.value})}
                        />

                        <input type="text"
                            placeholder="dat hoặc khong_dat hoặc dang_danh_gia"
                               value={updateData.trang_thai}
                               onChange={e => setUpdateData({...updateData, trang_thai: e.target.value})}
                        />


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
                        <h3>Thêm KPI</h3>

                        <input
                            placeholder="Mã nhân viên"
                            value={createData.ma_nhan_vien}
                            onChange={e => setCreateData({...createData, ma_nhan_vien: e.target.value})}
                        />

                        <input
                            placeholder="Tên KPI"
                            value={createData.ten_kpi}
                            onChange={e => setCreateData({...createData, ten_kpi: e.target.value})}
                        />

                        <input
                            placeholder="Kỳ đánh giá"
                            value={createData.ky_danh_gia}
                            onChange={e => setCreateData({...createData, ky_danh_gia: e.target.value})}
                        />

                        <input
                            type="number"
                            placeholder="Mục tiêu"
                            value={createData.muc_tieu}
                            onChange={e => setCreateData({...createData, muc_tieu: e.target.value})}
                        />

                        <input
                            type="number"
                            placeholder="Thực tế"
                            value={createData.thuc_te}
                            onChange={e => setCreateData({...createData, thuc_te: e.target.value})}
                        />

                        <input
                            placeholder="Đơn vị tính"
                            value={createData.don_vi_tinh}
                            onChange={e => setCreateData({...createData, don_vi_tinh: e.target.value})}
                        />

                        <input
                            placeholder="Ghi chú"
                            value={createData.ghi_chu}
                            onChange={e => setCreateData({...createData, ghi_chu: e.target.value})}
                        />
                        <input
                            placeholder="Tháng"
                            value={createData.thang}
                            onChange={e => setCreateData({...createData, thang: e.target.value})}
                        />
                        <input
                            placeholder="Năm"
                            value={createData.nam}
                            onChange={e => setCreateData({...createData, nam: e.target.value})}
                        />

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