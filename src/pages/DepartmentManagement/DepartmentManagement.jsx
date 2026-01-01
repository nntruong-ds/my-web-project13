import React, { useEffect, useState } from "react";
import styles from "./DepartmentManagement.module.css";
import {getDepartment, searchDepartment, deleteDepartment, updateDepartment, createDepartment} from "../../api/department";
import {deleteBranch, getBranches, updateBranch} from "../../api/branch";

export default function DepartmentManagement() {
    const [departments, setDepartments] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const [isSearchingByApi, setIsSearchingByApi] = useState(false);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(""); // ma_cn

    const [searchCode, setSearchCode] = useState(""); // mapb

    const [isAdding, setIsAdding] = useState(false);
    const [newDepart, setNewDepart] = useState({
        mapb: "",
        ten_phong: "",
        ma_cn: "",
        truong_phong_id: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [formDepart, setFormDepart] = useState({
        ten_phong: "",
        truong_phong_id: "",
        ngay_tao: "",
        ma_cn: ""
    });
    // Tìm kiếm bằng Effect
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const data = await getDepartment();
                setDepartments(data);
                setFilteredDepartments(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDepartments();
    }, []);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const data = await getBranches();
                setBranches(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchBranches();
    }, []);

    useEffect(() => {
        if (isSearchingByApi) return;
        if (!selectedBranch) {
            setFilteredDepartments(departments);
        } else {
            setFilteredDepartments(
                departments.filter(dep => String(dep.ma_cn) === String(selectedBranch))
            );
        }
        setSelectedDepartment(null);
    }, [selectedBranch, departments, isSearchingByApi]);
    useEffect(() => {
        if (!searchCode.trim()) {
            setIsSearchingByApi(false);
        }
    }, [searchCode]);

    const handleSelectDepartment = (mapb) => {
        const dep = filteredDepartments.find(d => String(d.mapb) === String(mapb));
        if (!dep) return;
        setSelectedDepartment(dep);
    };

    const handleSearch = async () => {
        if (!searchCode.trim()) return;

        try {
            setIsSearchingByApi(true);
            const dep = await searchDepartment(searchCode);

            if (selectedBranch && String(dep.ma_cn) !== String(selectedBranch)) {
                setFilteredDepartments([]);
                setSelectedDepartment(null);
                return;
            }

            setFilteredDepartments([dep]);
            setSelectedDepartment(dep);

        } catch (err) {
            setFilteredDepartments([]);
            setSelectedDepartment(null);
        }
    };
    // ADD
    const handleAddDepartment = async () => {
        try {
            if (!newDepart.mapb || !newDepart.ten_phong || !newDepart.ma_cn) {
                return alert("Vui lòng nhập đầy đủ thông tin, bao gồm cả chi nhánh!");
            }
            const payload = {
                mapb: newDepart.mapb,
                ten_phong: newDepart.ten_phong,
                ma_cn: Number(newDepart.ma_cn),
                truong_phong_id: newDepart.truong_phong_id
            };
            const created = await createDepartment(payload);

            setDepartments([...departments, created]);
            if (!selectedBranch || String(selectedBranch) === String(created.ma_cn)) {
                setFilteredDepartments([...filteredDepartments, created]);
            }
            setSelectedDepartment(created);
            setIsAdding(false);
            setNewDepart({
                mapb: "",
                ten_phong: "",
                ma_cn: "",
                truong_phong_id: "",
            });

            alert("Thêm phòng ban thành công!");

        } catch (err) {
            console.error(err);
            alert("Thêm phòng ban thất bại!");
        }
    };

    // DELETE
    const handleDeleteDepartment = async () => {
        if (!selectedDepartment) return alert("Vui lòng chọn phòng ban cần xóa");
        if (!window.confirm("Bạn có chắc muốn xóa phòng ban này?")) return;

        try {
            await deleteDepartment(selectedDepartment.mapb);
            setDepartments(
                departments.filter((b) => b.mapb !== selectedDepartment.mapb)
            );
            setSelectedDepartment(null);
            alert("Xóa thành công!");
        } catch (err) {
            console.error(err);
            alert("Xóa thất bại!");
        }
    }
    // UPDATE
    const handleUpdateDepartment = async () => {
        if (!selectedDepartment) return;
        try {
            await updateDepartment(selectedDepartment.mapb, formDepart);

            setDepartments(
                departments.map((b) =>
                    b.mapb === selectedDepartment.mapb
                        ? { ...b, ...formDepart }
                        : b
                )
            );

            setSelectedDepartment({ ...selectedDepartment, ...formDepart });
            setIsEditing(false);
            alert("Cập nhật thành công!");
        } catch (err) {
            console.error(err);
            alert("Cập nhật thất bại!");
        }
    }

    return (
        <div className={styles.container}>
            {/* ===== LEFT ===== */}
            <div className={styles.left}>
                <div className={styles.container_dspb}>
                    <h3 className={styles.title_DS}>Danh sách phòng ban</h3>
                    <div className={styles.table_wrapper}>
                        <table>
                            <thead>
                            <tr>
                                <th className={styles.row}>Mã CN</th>
                                <th>Tên CN</th>
                                <th className={styles.row}>Mã PB</th>
                                <th>Tên PB</th>
                                <th>Ngày tạo</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredDepartments.map(dep => (
                                <tr
                                    key={dep.mapb}
                                    onClick={() => handleSelectDepartment(dep.mapb)}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor:
                                            selectedDepartment?.mapb === dep.mapb
                                                ? "#d0ebff"
                                                : "white",
                                    }}
                                >
                                    <td>{dep.ma_cn}</td>
                                    <td>{dep.ten_chi_nhanh}</td>
                                    <td>{dep.mapb}</td>
                                    <td>{dep.ten_phong}</td>
                                    <td>{dep.ngay_tao}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                </div>

                {/* ===== SEARCH ===== */}
                <div className={styles.search}>
                    <select
                        className={styles.search_group}
                        value={selectedBranch}
                        onChange={(e) => {
                            setSelectedBranch(e.target.value)
                            setIsSearchingByApi(false);
                    }}
                    >
                        <option value="">Chọn CN</option>
                        {branches.map(b => (
                            <option key={b.ma_chi_nhanh} value={b.ma_chi_nhanh}>
                                {b.ten_chi_nhanh}
                            </option>
                        ))}
                    </select>

                    {/* Nhập mã PB */}
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Nhập mã phòng ban"
                        value={searchCode}
                        onChange={(e) => setSearchCode(e.target.value)}
                    />

                    <button className={styles.button} onClick={handleSearch}>
                        Tìm
                    </button>
                </div>
            </div>

            {/* ===== RIGHT (FORM CŨ) ===== */}
            {selectedDepartment && !isAdding && !isEditing && (
                <div className={styles.right}>
                    <div className={styles.container_Infor}>
                        <div className={styles.header}>Thông tin trưởng phòng</div>

                        <form className={styles.form_trPB}>
                            <label>Tên phòng:</label>
                            <input type="text" value={selectedDepartment.ten_phong} readOnly />

                            <label>ID phòng:</label>
                            <input type="text" value={selectedDepartment.mapb} readOnly />

                            <div className={styles.form_row}>
                                <div className={styles.form_group}>
                                    <label>ID trưởng phòng</label>
                                    <input
                                        type="text"
                                        value={selectedDepartment.truong_phong_id || ""}
                                        readOnly
                                    />
                                </div>

                                <div className={styles.form_group}>
                                    <label>Số lượng nhân viên:</label>
                                    <input
                                        type="number"
                                        value={selectedDepartment.so_luong_nhan_vien || ""}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className={styles.form_row}>
                                <div className={styles.form_group}>
                                    <label>Ngày tạo:</label>
                                    <input
                                        type="text"
                                        value={selectedDepartment.ngay_tao}
                                        readOnly
                                    />
                                </div>

                                <div className={styles.form_group}>
                                    <label>Mã CN:</label>
                                    <input
                                        type="text"
                                        value={selectedDepartment.ma_cn}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    <div className={styles.action}>
                        <button
                            type="button"
                            className={styles.button}
                            onClick={() => {
                                setIsAdding(true);
                                setSelectedDepartment(null);
                            }}
                        >
                            Thêm
                        </button>

                        <button type="button" className={styles.button}
                            onClick={() =>{
                                setIsEditing(true);
                                setFormDepart({
                                    ten_phong: selectedDepartment.ten_phong,
                                    truong_phong_id: selectedDepartment.truong_phong_id,
                                    ngay_tao: selectedDepartment.ngay_tao,
                                    ma_cn: selectedDepartment.ma_cn
                                })
                            }}
                        >
                            Sửa
                        </button>
                        <button type="button" className={styles.button} onClick={handleDeleteDepartment}>Xóa</button>
                    </div>
                </div>
            )}

            {isAdding && (
                <div className={styles.right}>
                    <div className={styles.container_Infor}>
                        <div className={styles.header}>Thêm phòng ban</div>

                        <form className={styles.form_trPB}>
                            <label>Mã phòng ban</label>
                            <input
                                value={newDepart.mapb}
                                onChange={(e) =>
                                    setNewDepart({ ...newDepart, mapb: e.target.value })
                                }
                            />

                            <label>Tên phòng</label>
                            <input
                                value={newDepart.ten_phong}
                                onChange={(e) =>
                                    setNewDepart({ ...newDepart, ten_phong: e.target.value })
                                }
                            />

                            <label>Chi nhánh</label>
                            <input
                                type="number"
                                value={newDepart.ma_cn}
                                onChange={(e) =>
                                    setNewDepart({
                                        ...newDepart,
                                        ma_cn: Number(e.target.value)
                                    })
                                }
                            />


                            <label>ID trưởng phòng</label>
                            <input
                                value={newDepart.truong_phong_id}
                                onChange={(e) =>
                                    setNewDepart({
                                        ...newDepart,
                                        truong_phong_id: e.target.value
                                    })
                                }
                            />
                        </form>

                        <div className={styles.action}>
                            <button
                                type="button"
                                className={styles.button}
                                onClick={handleAddDepartment}
                            >
                                Lưu
                            </button>

                            <button
                                type="button"
                                className={styles.button}
                                onClick={() => setIsAdding(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isEditing && (
                <div className={styles.right}>
                    <div className={styles.container_Infor}>
                        <div className={styles.header}>Sửa phòng ban</div>

                        <form className={styles.form_trPB}>
                            <label>Tên phòng</label>
                            <input
                                value={formDepart.ten_phong}
                                onChange={(e) =>
                                    setFormDepart({ ...formDepart, ten_phong: e.target.value })
                                }
                            />

                            <label>ID trưởng phòng</label>
                            <input
                                value={formDepart.truong_phong_id}
                                onChange={(e) =>
                                    setFormDepart({ ...formDepart, truong_phong_id: e.target.value })
                                }
                            />

                            <label>Chi nhánh</label>
                            <input
                                type="number"
                                value={formDepart.ma_cn}
                                onChange={(e) =>
                                    setFormDepart({ ...formDepart, ma_cn: Number(e.target.value) })
                                }
                            />
                        </form>

                        <div className={styles.action}>
                            <button
                                type="button"
                                className={styles.button}
                                onClick={handleUpdateDepartment}
                            >
                                Lưu
                            </button>

                            <button
                                type="button"
                                className={styles.button}
                                onClick={() => setIsEditing(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}
