import React, { useEffect, useState } from "react";
import styles from "./BranchManagement.module.css";
import {createBranch, searchBranch, updateBranch, deleteBranch, getBranches} from "../../api/branch";
export default function BranchManagement() {
    const [branches, setBranches] = useState([]);
    const [filteredBranches, setFilteredBranches] = useState([]);

    const [nameFiltered, setNameFiltered] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [searchCode, setSearchCode] = useState("");

    //Add
    const [isAdding, setIsAdding] = useState(false);
    const [newBranch, setNewBranch] = useState({
        ten_chi_nhanh: "",
        dia_chi: "",
        so_dien_thoai: "",
        email: "",
        ngay_thanh_lap: "",
        id_gdoc: "",
    });

    //update
    const [isEditing, setIsEditing] = useState(false);
    const [formBranch, setFormBranch] = useState({
        ten_chi_nhanh: "",
        dia_chi: "",
        so_dien_thoai: "",
        email: "",
        ngay_thanh_lap: "",
        id_gdoc: "",
    });


    // Chi nhánh đang chọn
    const [selectedBranch, setSelectedBranch] = useState(null);
    useEffect(() => {
        const fetchBranches = async () => {
            const data = await getBranches();
            setBranches(data);
            setFilteredBranches(data);
        };
        fetchBranches();
    }, []);

    useEffect(() => {
        if (!searchName.trim()) {
            setNameFiltered(branches);
            setFilteredBranches(branches);
            return;
        }

        const filtered = branches.filter(b =>
            b.ten_chi_nhanh.toLowerCase().includes(searchName.toLowerCase())
        );
        setNameFiltered(filtered);
        setFilteredBranches(filtered);
    }, [searchName, branches]);


    const handleSearch = async () => {
        if (!searchCode.trim())
            return;

        try {
            const branch = await searchBranch(searchCode);

            const exists = nameFiltered.some(
                b => b.ma_chi_nhanh === branch.ma_chi_nhanh
            );

            if (!exists) {
                setFilteredBranches([]);
                setSelectedBranch(null);
                return;
            }
            setFilteredBranches([branch]);
            setSelectedBranch(branch);

        } catch (err) {
            setFilteredBranches([]);
            setSelectedBranch(null);
        }
    };


    const handleSelectBranch = async (ma_chi_nhanh) => {
        const branch = branches.find(
            (b) => b.ma_chi_nhanh === ma_chi_nhanh
        );
        setSelectedBranch(branch);
        setFormBranch({ ...branch });
        setIsEditing(false);
    };

    const handleAddBranch = async () => {
        try {
            const payload = {
                ma_chi_nhanh: newBranch.ma_chi_nhanh,
                ten_chi_nhanh: newBranch.ten_chi_nhanh,
                dia_chi: newBranch.dia_chi,
                so_dien_thoai: newBranch.so_dien_thoai,
                email: newBranch.email,
                ngay_thanh_lap: newBranch.ngay_thanh_lap,
                id_gdoc: Number(newBranch.id_gdoc)
            };
            const created = await createBranch(payload);
            setBranches([...branches, created]);
            setNewBranch({
                ma_chi_nhanh: "",
                ten_chi_nhanh: "",
                dia_chi: "",
                so_dien_thoai: "",
                email: "",
                ngay_thanh_lap: "",
                id_gdoc: "",
            });
            setIsAdding(false);
            alert("Thêm chi nhánh thành công!");
        } catch (err) {
            console.error(err);
            alert("Thêm chi nhánh thất bại!");
        }
    };

    const handleSaveBranch = async () => {
        if (!selectedBranch) return;
        try {
            await updateBranch(selectedBranch.ma_chi_nhanh, formBranch);

            setBranches(
                branches.map((b) =>
                    b.ma_chi_nhanh === selectedBranch.ma_chi_nhanh
                        ? { ...b, ...formBranch }
                        : b
                )
            );

            setSelectedBranch({ ...selectedBranch, ...formBranch });
            setIsEditing(false);
            alert("Cập nhật thành công!");
        } catch (err) {
            console.error(err);
            alert("Cập nhật thất bại!");
        }
    };

    const handleDeleteBranch = async () => {
        if (!selectedBranch) return alert("Vui lòng chọn chi nhánh cần xóa");
        if (!window.confirm("Bạn có chắc muốn xóa chi nhánh này?")) return;

        try {
            await deleteBranch(selectedBranch.ma_chi_nhanh);
            setBranches(
                branches.filter((b) => b.ma_chi_nhanh !== selectedBranch.ma_chi_nhanh)
            );
            setSelectedBranch(null);
            alert("Xóa thành công!");
        } catch (err) {
            console.error(err);
            alert("Xóa thất bại!");
        }
    };

    return (
        <div className={styles.container}>
            {/*DANH SÁCH */}
            <div className={styles.left}>
                <div className={styles.container_DS}>
                    <h3 className={styles.title_DS}>Danh Sách Chi Nhánh</h3>
                    <table>
                        <thead>
                        <tr>
                            <th>Mã</th>
                            <th>Tên CN</th>
                            <th>Địa chỉ</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredBranches.map((branch) => (
                            <tr
                                key={branch.ma_chi_nhanh}
                                onClick={() => handleSelectBranch(branch.ma_chi_nhanh)}
                                style={{
                                    cursor: "pointer",
                                    backgroundColor:
                                        selectedBranch?.ma_chi_nhanh === branch.ma_chi_nhanh
                                            ? "#d0ebff"
                                            : "white",
                                }}
                            >
                                <td>{branch.ma_chi_nhanh}</td>
                                <td>{branch.ten_chi_nhanh}</td>
                                <td>{branch.dia_chi}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.search}>
                    <label>Tìm kiếm</label>
                    <select
                        className={styles.select}
                        value={searchName}
                        onChange={(e) =>{
                            setSearchName(e.target.value)
                            }}

                    >
                        <option value="">Chọn CN</option>
                        {branches.map(branch => (
                            <option
                                key={branch.ma_chi_nhanh}
                                value={branch.ten_chi_nhanh}
                            >
                                {branch.ten_chi_nhanh}
                            </option>
                        ))}
                    </select>

                    <input
                        className={styles.input}
                        placeholder="Tìm kiếm"
                        value={searchCode}
                        onChange={(e) => {
                            setSearchCode(e.target.value);
                        }}
                    />

                    <button className={styles.button} onClick={handleSearch}>Tìm</button>
                </div>

                <div className={styles.action}>
                    <label className={styles.actionLabel}>Tùy chọn chi nhánh</label>
                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.button}
                            onClick={() => {
                                setIsAdding(true);
                                setSelectedBranch(null);
                                setIsEditing(false);
                            }}
                        >
                            Thêm
                        </button>
                        <button
                            className={styles.button}
                            onClick={() => {
                                if (selectedBranch) {
                                    setIsEditing(true);
                                } else {
                                    alert("Vui lòng chọn chi nhánh cần sửa");
                                }
                            }}
                        >
                            Sửa
                        </button>
                        <button className={styles.button} onClick={handleDeleteBranch}>Xóa</button>
                    </div>
                </div>
            </div>
            {isAdding && (
                <div className={styles.container_Infor}>
                    <div className={styles.header}>Thêm Chi Nhánh</div>
                    <div className={styles.table_wrapper}>
                        <form className={styles.form_CN}>
                            <label>Mã CN</label>
                            <input
                                type="number"
                                value={newBranch.ma_chi_nhanh}
                                onChange={e => setNewBranch({ ...newBranch, ma_chi_nhanh: e.target.value })}
                            />
                            <label>Tên CN</label>
                            <input
                                type="text"
                                value={newBranch.ten_chi_nhanh}
                                onChange={e => setNewBranch({ ...newBranch, ten_chi_nhanh: e.target.value })}
                            />
                            <label>Địa chỉ</label>
                            <input
                                type="text"
                                value={newBranch.dia_chi}
                                onChange={e => setNewBranch({ ...newBranch, dia_chi: e.target.value })}
                            />
                            <label>SĐT</label>
                            <input
                                type="text"
                                value={newBranch.so_dien_thoai}
                                onChange={e => setNewBranch({ ...newBranch, so_dien_thoai: e.target.value })}
                            />
                            <label>Email</label>
                            <input
                                type="text"
                                value={newBranch.email}
                                onChange={e => setNewBranch({ ...newBranch, email: e.target.value })}
                            />
                            <label>Ngày thành lập</label>
                            <input
                                type="date"
                                value={newBranch.ngay_thanh_lap}
                                onChange={e => setNewBranch({ ...newBranch, ngay_thanh_lap: e.target.value })}
                            />
                            <label>ID GD</label>
                            <input
                                type="text"
                                value={newBranch.id_gdoc}
                                onChange={e => setNewBranch({ ...newBranch, id_gdoc: e.target.value })}
                            />

                            <div className={styles.buttonGroup}>
                                <button type="button" className={styles.button} onClick={handleAddBranch}>
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
                        </form>
                    </div>
                </div>
            )}


            {selectedBranch && !isAdding && (
                <div className={styles.right}>
                    <div className={styles.container_Infor}>
                        <div className={styles.header}>Thông tin Chi Nhánh</div>
                        <div className={styles.table_wrapper}>
                            <form className={styles.form_CN}>
                                <label>Mã CN</label>
                                <input type="number" value={selectedBranch?.ma_chi_nhanh || ""} readOnly />

                                <label>Tên CN</label>
                                <input
                                    type="text"
                                    value={formBranch.ten_chi_nhanh}
                                    onChange={e => setFormBranch({ ...formBranch, ten_chi_nhanh: e.target.value })}
                                    readOnly={!isEditing}
                                />

                                <label>Địa chỉ CN</label>
                                <input
                                    type="text"
                                    value={formBranch.dia_chi}
                                    onChange={e => setFormBranch({ ...formBranch, dia_chi: e.target.value })}
                                    readOnly={!isEditing}
                                />

                                <label>SĐT</label>
                                <input
                                    type="text"
                                    value={formBranch.so_dien_thoai}
                                    onChange={e => setFormBranch({ ...formBranch, so_dien_thoai: e.target.value })}
                                    readOnly={!isEditing}
                                />

                                <label>Email</label>
                                <input
                                    type="text"
                                    value={formBranch.email}
                                    onChange={e => setFormBranch({ ...formBranch, email: e.target.value })}
                                    readOnly={!isEditing}
                                />

                                <label>Ngày thành lập</label>
                                <input
                                    type="date"
                                    value={formBranch.ngay_thanh_lap}
                                    onChange={e => setFormBranch({ ...formBranch, ngay_thanh_lap: e.target.value })}
                                    readOnly={!isEditing}
                                />

                                <label>ID GD</label>
                                <input
                                    type="text"
                                    value={formBranch.id_gdoc}
                                    onChange={e => setFormBranch({ ...formBranch, id_gdoc: e.target.value })}
                                    readOnly={!isEditing}
                                />

                                <label>Tên giám đốc</label>
                                <input type="text" value={selectedBranch?.ten_giam_doc || ""} readOnly />

                                <label>Số lượng phòng ban</label>
                                <input type="number" value={selectedBranch?.so_luong_phong_ban || ""} readOnly />

                                <label>Số lượng nhân viên</label>
                                <input type="number" value={selectedBranch?.so_luong_nhan_vien || ""} readOnly />

                                {isEditing && (
                                    <div className={styles.buttonGroup}>
                                        <button type="button" className={styles.button} onClick={handleSaveBranch}>
                                            Lưu
                                        </button>
                                        <button
                                            type="button"
                                            className={styles.button}
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormBranch({ ...selectedBranch });
                                            }}
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}