import React, {useEffect, useState} from "react";
import styles from "./EmployeeManagement.module.css";
import {getEmployee, deleteEmployee, updateEmployee, createEmployee, importEmployee} from "../../api/employee";
import Papa from "papaparse";


export default function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [isAdding, setIsAdding] = useState(false);
    const [newEmploy, setNewEmploy] = useState({
        ma_nhan_vien: "",
        ho_ten: "",
        email: "",
        chuc_vu_id: "",
        trang_thai: "Đang làm",
        chinhanh_id: "",
        phong_ban_id: "",
        ngay_vao_lam: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const fetchEmployees = async () => {
        try {
            const data = await getEmployee();
            setEmployees(data);
            setFilteredEmployees(data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (isEditing && selectedEmployee) {
            setFormEmployee({
                ho_ten: selectedEmployee.ho_ten || "",
                email: selectedEmployee.email || "",
                phong_ban_id: selectedEmployee.phong_ban_id || "",
                chuc_vu_id: selectedEmployee.chuc_vu_id || "",
                ngay_vao_lam: selectedEmployee.ngay_vao_lam || "",
                trang_thai: selectedEmployee.trang_thai || "Đang làm",
                chinhanh_id: selectedEmployee.chinhanh_id || "",

                ngay_sinh: selectedEmployee.ngay_sinh || "",
                gioi_tinh: selectedEmployee.gioi_tinh || "",
                dia_chi: selectedEmployee.dia_chi || "",
                so_dien_thoai: selectedEmployee.so_dien_thoai || "",
                cccd: selectedEmployee.cccd || "",
            });
        }
    }, [selectedEmployee, isEditing]);
    const handleSelectEmployee = (ma_nhan_vien) => {
        const em = filteredEmployees.find(d => String(d.ma_nhan_vien) === String(ma_nhan_vien));
        if (!em) return;
        setSelectedEmployee(em);

        setFormEmployee({
            ho_ten: em.ho_ten || "",
            email: em.email || "",
            phong_ban_id: em.phong_ban_id || "",
            chuc_vu_id: em.chuc_vu_id || "",
            chinhanh_id: em.chinhanh_id || "",
            ngay_vao_lam: em.ngay_vao_lam || "",
            trang_thai: em.trang_thai || "Đang làm",
            ngay_sinh: em.ngay_sinh || "",
            gioi_tinh: em.gioi_tinh || "",
            dia_chi: em.dia_chi || "",
            so_dien_thoai: em.so_dien_thoai || "",
            cccd: em.cccd || "",
        });
    };

    // CREATE
    const handleAddEmployee = async () => {
        try {
            const payload = {
                ma_nhan_vien: newEmploy.ma_nhan_vien,
                ho_ten: newEmploy.ho_ten,
                ngay_sinh: newEmploy.ngay_sinh,
                gioi_tinh: newEmploy.gioi_tinh,
                dia_chi: newEmploy.dia_chi,
                cccd: newEmploy.cccd,
                so_dien_thoai: newEmploy.so_dien_thoai,

                email: newEmploy.email,
                chuc_vu_id: newEmploy.chuc_vu_id,
                trang_thai: newEmploy.trang_thai,
                chinhanh_id: Number(newEmploy.chinhanh_id),
                phong_ban_id: newEmploy.phong_ban_id,
                ngay_vao_lam: newEmploy.ngay_vao_lam
            };
            const created = await createEmployee(payload);

            setEmployees([...employees, created]);
            setFilteredEmployees([...filteredEmployees, created]);
            setSelectedEmployee(created);
            setIsAdding(false);
            setNewEmploy({
                ma_nhan_vien: "",
                ho_ten: "",
                ngay_sinh: "",
                gioi_tinh: "",
                dia_chi: "",
                cccd: "",
                so_dien_thoai: "",

                email: "",
                chuc_vu_id: "",
                trang_thai: "",
                chinhanh_id: "",
                phong_ban_id: "",
                ngay_vao_lam: "",
            });

            alert("Thêm nhân viên thành công!");
        } catch (err) {
            console.error(err);
            alert("Thêm nhân viên thất bại!");
        }
    };

    const [formEmployee, setFormEmployee] = useState({
        ho_ten: "",
        email: "",
        phong_ban_id: "",
        chuc_vu_id: "",
        ngay_vao_lam: "",
        trang_thai: "Đang làm",
        chinhanh_id: "",

        ngay_sinh: "",
        gioi_tinh: "",
        dia_chi: "",
        so_dien_thoai: "",
        cccd: ""
    })
    //UPDATE
    const handleUpdateEmployee = async () => {
        if (!selectedEmployee) {
            alert("Chưa chọn nhân viên!");
            return;
        }
        const payload = {
            ho_ten: formEmployee.ho_ten.trim(),
            email: formEmployee.email?.trim() || "",
            chuc_vu_id: formEmployee.chuc_vu_id?.trim() || "",
            trang_thai: formEmployee.trang_thai || null,
            phong_ban_id: formEmployee.phong_ban_id?.trim() || "",
            gioi_tinh: formEmployee.gioi_tinh?.trim() || "",
            dia_chi: formEmployee.dia_chi?.trim() || "",
            so_dien_thoai: formEmployee.so_dien_thoai?.trim() || "",
            cccd: formEmployee.cccd?.trim() || "",

            // Xử lý số và ngày
            chinhanh_id: formEmployee.chinhanh_id ? Number(formEmployee.chinhanh_id) : 0,
            ngay_sinh: formEmployee.ngay_sinh || "",
            ngay_vao_lam: formEmployee.ngay_vao_lam || "",
        };
        try {
            await updateEmployee(selectedEmployee.ma_nhan_vien, payload);

            // Cập nhật state local
            const updatedEmployee = { ...selectedEmployee, ...payload };

            setEmployees(prev =>
                prev.map(e =>
                    e.ma_nhan_vien === selectedEmployee.ma_nhan_vien
                        ? updatedEmployee
                        : e
                )
            );

            setFilteredEmployees(prev =>
                prev.map(e =>
                    e.ma_nhan_vien === selectedEmployee.ma_nhan_vien
                        ? updatedEmployee
                        : e
                )
            );

            setSelectedEmployee(updatedEmployee);
            setIsEditing(false);

            alert("Cập nhật thành công!");
        }catch(err){
            console.error("Lỗi update:", err);
            alert(`Cập nhật thất bại`);
        }
    };

    const handleDeleteEmployee = async () => {
        if (!selectedEmployee) {
            alert("Vui lòng chọn nhân viên!");
            return;
        }

        if (!window.confirm('Bạn có chắc muốn xóa nhân viên ${selectedEmployee.ho_ten}?')) {
            return;
        }

        try {
            await deleteEmployee(selectedEmployee.ma_nhan_vien);
            setEmployees(
                employees.filter((b) => b.ma_nhan_vien !== selectedEmployee.ma_nhan_vien)
            );
            setSelectedEmployee(null);
            alert("Xóa thành công!");
        } catch (err) {
            console.error(err);
            alert("Xóa thất bại!");
        }
    };


    const [searchCode, setSearchCode] = useState(""); // Mã NV
    const [searchBranch, setSearchBranch] = useState(""); // CN
    const [searchCV, setSearchCV] = useState(""); // Chức vụ
    const [searchPB, setSearchPB] = useState(""); // Phòng ban

    const handleSearch = async () => {
        try {
            let data = [...employees];

            if (searchCode.trim()) { data = data.filter(e => String(e.ma_nhan_vien).includes(searchCode.trim()) ); }



            // Filter by branch, CV, PB
            data = data.filter(
                (e) =>
                    (!searchBranch || String(e.chinhanh_id) === String(searchBranch)) &&
                    (!searchCV || String(e.chuc_vu_id) === String(searchCV)) &&
                    (!searchPB || String(e.phong_ban_id) === String(searchPB))
            );

            setFilteredEmployees(data);
            setSelectedEmployee(null);
        } catch (err) {
            console.error(err);
            alert("Không tìm được nhân viên");
        }
    };
    useEffect(() => {
        if (!searchCode && !searchBranch && !searchCV && !searchPB) {
            setFilteredEmployees(employees);
            setSelectedEmployee(null);
        }
    }, [searchCode, searchBranch, searchCV, searchPB, employees]);

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };
    const handleImport = async () => {
        if (!selectedFile) {
            alert("Vui lòng chọn file Excel!");
            return;
        }

        try {
            await importEmployee(selectedFile);
            alert("Import Excel thành công!");
            setSelectedFile(null);
            await fetchEmployees();
        } catch (err) {
            console.error(err);
            alert("Import Excel thất bại!");
        }
    };



    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.container_ds}>
                    <div className={styles.title_ds}>Danh sách nhân viên</div>
                    <div className={styles.table_wrapper}>
                        <table>
                            <thead>
                            <tr>
                                <th>Mã NV</th>
                                <th>Chức Vụ</th>
                                <th>Chi Nhánh</th>
                                <th>Phòng Ban</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredEmployees.map(em => (
                                <tr
                                    key={em.ma_nhan_vien}
                                    onClick={() => handleSelectEmployee(em.ma_nhan_vien)}
                                    style={{
                                        cursor: "pointer",
                                        backgroundColor:
                                            selectedEmployee?.ma_nhan_vien === em.ma_nhan_vien
                                                ? "#d0ebff"
                                                : "white",
                                    }}
                                >
                                    <td>{em.ma_nhan_vien}</td>
                                    <td>{em.chuc_vu_id}</td>
                                    <td>{em.chinhanh_id}</td>
                                    <td>{em.phong_ban_id}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                </div>
                <div className={styles.action}>
                    <h3>Chỉnh sửa thông tin</h3>
                    <div className={styles.buttonGroup}>
                        <button
                            className={styles.button}
                            onClick={() => {
                                setIsAdding(true);
                                setSelectedEmployee(null);
                                setIsEditing(false);
                            }}
                        >
                            Thêm
                        </button>
                        <button
                            className={styles.button}
                            onClick={() => {
                                if (!selectedEmployee) {
                                    alert("Vui lòng chọn nhân viên!");
                                    return;
                                }
                                setIsEditing(true);
                                setFormEmployee({
                                    ho_ten: selectedEmployee.ho_ten || "",
                                    email: selectedEmployee.email || "",
                                    phong_ban_id: selectedEmployee.phong_ban_id || "",
                                    chuc_vu_id: selectedEmployee.chuc_vu_id || "",
                                    ngay_vao_lam: selectedEmployee.ngay_vao_lam || "",
                                    trang_thai: selectedEmployee.trang_thai || "Đang làm",
                                    chinhanh_id: selectedEmployee.chinhanh_id || "",
                                    ngay_sinh: selectedEmployee.ngay_sinh || "",
                                    gioi_tinh: selectedEmployee.gioi_tinh || "",
                                    dia_chi: selectedEmployee.dia_chi || "",
                                    so_dien_thoai: selectedEmployee.so_dien_thoai || "",
                                    cccd: selectedEmployee.cccd || "",
                                });
                            }}
                        >
                            Sửa
                        </button>
                        <button className={styles.button} onClick={handleDeleteEmployee}>Xóa</button>
                    </div>
                </div>

                <div className={styles.search}>
                    <h3>Tìm kiếm</h3>
                    <div className={styles.group}>
                        <select
                            className={styles.row}
                            value={searchBranch}
                            onChange={(e) => setSearchBranch(e.target.value)}
                        >
                            <option value="">Chọn CN</option>
                            {[...new Set(employees.map((e) => e.chinhanh_id))]
                                .filter(Boolean)
                                .map((cn) => (
                                    <option key={cn} value={cn}>
                                        CN {cn}
                                    </option>
                                ))}
                        </select>

                        <select
                            className={styles.row}
                            value={searchCV}
                            onChange={(e) => setSearchCV(e.target.value)}
                        >
                            <option value="">Chọn CV</option>
                            {[...new Set(employees.map((e) => e.chuc_vu_id))]
                                .filter(Boolean)
                                .map((cv) => (
                                    <option key={cv} value={cv}>
                                        {cv}
                                    </option>
                                ))}
                        </select>

                    </div>
                    <div className={styles.group}>
                        <select
                            className={styles.row}
                            value={searchPB}
                            onChange={(e) => setSearchPB(e.target.value)}
                        >
                            <option value="">Chọn PB</option>
                            {[...new Set(employees.map((e) => e.phong_ban_id))]
                                .filter(Boolean)
                                .map((pb) => (
                                    <option key={pb} value={pb}>
                                        {pb}
                                    </option>
                                ))}
                        </select>

                        <input className={styles.row} type="text" placeholder={"Tìm kiếm"}
                               value={searchCode}
                               onChange={(e) => setSearchCode(e.target.value)}
                        />

                    </div>
                    <button onClick={handleSearch}>Tìm</button>

                </div>
                <div className={styles.addFile}>
                    <h3>Thêm danh sách</h3>
                    <input
                        type="file"
                        accept=".csv, .xlsx"
                        onChange={handleFileChange}
                    />
                    <button onClick={handleImport}>Thêm</button>

                </div>
            </div>
            {isAdding && (
                <div className={styles.right}>
                    <div className={styles.container_Infor}>
                        <div className={styles.header}>Thêm nhân viên</div>
                        <div className={styles.table_wrapper1}>
                            <form className={styles.form_infor}>
                                <label>ID:</label>
                                <input
                                    type="text"
                                    value={newEmploy.ma_nhan_vien || ""}
                                    onChange={e =>
                                        setNewEmploy({ ...newEmploy, ma_nhan_vien: e.target.value })
                                    }
                                />

                                <label>Họ và tên:</label>
                                <input
                                    type="text"
                                    value={newEmploy.ho_ten || ""}
                                    onChange={e =>
                                        setNewEmploy({ ...newEmploy, ho_ten: e.target.value })
                                    }
                                />

                                <label>Ngày sinh:</label>
                                <input
                                    type="date"
                                    value={newEmploy.ngay_sinh || ""}
                                    onChange={e =>
                                        setNewEmploy({ ...newEmploy, ngay_sinh: e.target.value })
                                    }
                                />

                                <label>Giới tính:</label>
                                <input
                                    type="text"
                                    value={newEmploy.gioi_tinh || ""}
                                    onChange={e =>
                                        setNewEmploy({ ...newEmploy, gioi_tinh: e.target.value })
                                    }
                                />

                                <label>Địa chỉ:</label>
                                <input
                                    type="text"
                                    value={newEmploy.dia_chi || ""}
                                    onChange={e =>
                                        setNewEmploy({ ...newEmploy, dia_chi: e.target.value })
                                    }
                                />

                                <label>Email:</label>
                                <input
                                    type="text"
                                    value={newEmploy.email || ""}
                                    onChange={e =>
                                        setNewEmploy({ ...newEmploy, email: e.target.value })
                                    }
                                />

                                <div className={styles.form_row}>
                                    <div className={styles.form_group}>
                                        <label>CCCD:</label>
                                        <input
                                            type="text"
                                            value={newEmploy.cccd || ""}
                                            onChange={e =>
                                                setNewEmploy({ ...newEmploy, cccd: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className={styles.form_group}>
                                        <label>SĐT:</label>
                                        <input
                                            type="text"
                                            value={newEmploy.so_dien_thoai || ""}
                                            onChange={e =>
                                                setNewEmploy({ ...newEmploy, so_dien_thoai: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>
                                <div className={styles.form_row}>
                                    <div className={styles.form_group}>
                                        <label>Chi nhánh:</label>
                                        <input
                                            type="number"
                                            value={newEmploy.chinhanh_id || ""}
                                            onChange={e =>
                                                setNewEmploy({ ...newEmploy, chinhanh_id: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className={styles.form_group}>
                                        <label>Phòng Ban</label>
                                        <input
                                            type="text"
                                            value={newEmploy.phong_ban_id || ""}
                                            onChange={e =>
                                                setNewEmploy({ ...newEmploy, phong_ban_id: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className={styles.form_row}>
                                    <div className={styles.form_group}>
                                        <label>Chức vụ</label>
                                        <input
                                            type="text"
                                            value={newEmploy.chuc_vu_id || ""}
                                            onChange={e =>
                                                setNewEmploy({ ...newEmploy, chuc_vu_id: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className={styles.form_group}>
                                        <label>Trạng thái:</label>
                                        <input
                                            type="text"
                                            value={newEmploy.trang_thai || ""}
                                            onChange={e =>
                                                setNewEmploy({ ...newEmploy, trang_thai: e.target.value })
                                            }
                                        />
                                    </div>

                                </div>
                                <div className={styles.form_row}>
                                    <div className={styles.form_group}>
                                        <label>Ngày vào làm:</label>
                                        <input
                                            type="date"
                                            value={newEmploy.ngay_vao_lam || ""}
                                            onChange={e =>
                                                setNewEmploy({ ...newEmploy, ngay_vao_lam: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className={styles.buttonGroup}>
                                    <button type="button" onClick={handleAddEmployee}>
                                        Lưu
                                    </button>
                                    <button type="button" onClick={() => setIsAdding(false)}>
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
            {isEditing && (
                <div className={styles.right}>
                    <div className={styles.container_Infor}>
                        <div className={styles.header}>Cập Nhật Nhân Viên</div>

                        <div className={styles.table_wrapper1}>
                            <form className={styles.form_infor}>
                                <label>Họ và tên:</label>
                                <input
                                    value={formEmployee.ho_ten || ""}
                                    onChange={e =>
                                        setFormEmployee({ ...formEmployee, ho_ten: e.target.value })
                                    }
                                />

                                <label>Email:</label>
                                <input
                                    value={formEmployee.email || ""}
                                    onChange={e =>
                                        setFormEmployee({ ...formEmployee, email: e.target.value })
                                    }
                                />

                                <label>Ngày sinh:</label>
                                <input
                                    value={formEmployee.ngay_sinh || ""}
                                    onChange={e =>
                                        setFormEmployee({ ...formEmployee, ngay_sinh: e.target.value })
                                    }
                                />

                                <label>Giới tính:</label>
                                <input
                                    value={formEmployee.gioi_tinh || ""}
                                    onChange={e =>
                                        setFormEmployee({ ...formEmployee, gioi_tinh: e.target.value })
                                    }
                                />

                                <label>Địa chỉ:</label>
                                <input
                                    value={formEmployee.dia_chi || ""}
                                    onChange={e =>
                                        setFormEmployee({ ...formEmployee, dia_chi: e.target.value })
                                    }
                                />

                                <div className={styles.form_row}>
                                    <div className={styles.form_group}>
                                        <label>CCCD:</label>
                                        <input
                                            value={formEmployee.cccd || ""}
                                            onChange={e =>
                                                setFormEmployee({ ...formEmployee, cccd: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className={styles.form_group}>
                                        <label>SĐT:</label>
                                        <input
                                            value={formEmployee.so_dien_thoai || ""}
                                            onChange={e =>
                                                setFormEmployee({ ...formEmployee, so_dien_thoai: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className={styles.form_row}>
                                    <div className={styles.form_group}>
                                        <label>Chi nhánh:</label>
                                        <input
                                            type="number"
                                            value={formEmployee.chinhanh_id || ""}
                                            onChange={e =>
                                                setFormEmployee({
                                                    ...formEmployee,
                                                    chinhanh_id: Number(e.target.value)
                                                })
                                            }
                                        />
                                    </div>

                                    <div className={styles.form_group}>
                                        <label>Phòng Ban</label>
                                        <input
                                            value={formEmployee.phong_ban_id || ""}
                                            onChange={e =>
                                                setFormEmployee({ ...formEmployee, phong_ban_id: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className={styles.form_row}>
                                    <div className={styles.form_group}>
                                        <label>Chức vụ</label>
                                        <input
                                            value={formEmployee.chuc_vu_id || ""}
                                            onChange={e =>
                                                setFormEmployee({ ...formEmployee, chuc_vu_id: e.target.value })
                                            }
                                        />
                                    </div>

                                    <div className={styles.form_group}>
                                        <label>Trạng thái:</label>
                                        <input
                                            value={formEmployee.trang_thai || ""}
                                            onChange={e =>
                                                setFormEmployee({ ...formEmployee, trang_thai: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className={styles.form_row}>
                                    <div className={styles.form_group}>
                                        <label>Ngày vào làm:</label>
                                        <input
                                            value={formEmployee.ngay_vao_lam || ""}
                                            onChange={e =>
                                                setFormEmployee({ ...formEmployee, ngay_vao_lam: e.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <div className={styles.buttonGroup}>
                                    <button type="button" onClick={handleUpdateEmployee}>
                                        Lưu
                                    </button>
                                    <button type="button" onClick={() => setIsEditing(false)}>
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}





            {selectedEmployee && !isAdding && !isEditing && (
                <div className={styles.right}>
                    <div className={styles.container_Infor}>
                        <div className={styles.header}>Thông tin</div>
                        <div className={styles.table_wrapper1}>
                            <form className={styles.form_infor}>
                                <label>ID:</label>
                                <input type="text" value={selectedEmployee?.ma_nhan_vien || ""} readOnly/>

                                <label>Họ và tên:</label>
                                <input type="text" value={selectedEmployee?.ho_ten || ""} readOnly/>

                                <label>Ngày sinh:</label>
                                <input type="date" value={selectedEmployee?.ngay_sinh || ""} readOnly/>

                                <label>Giới tính:</label>
                                <input type="text" value={selectedEmployee?.gioi_tinh || ""} readOnly/>

                                <label>Địa chỉ:</label>
                                <input type="text" value={selectedEmployee?.dia_chi || ""} readOnly/>

                                <label>Email:</label>
                                <input type="text" value={selectedEmployee?.email || ""} readOnly/>

                                <div className={styles.form_row}>
                                    <div className={styles.form_group}>
                                        <label>CCCD:</label>
                                        <input type="text" value={selectedEmployee?.cccd || ""} readOnly/>
                                    </div>
                                    <div className={styles.form_group}>
                                        <label>SĐT:</label>
                                        <input type="text" value={selectedEmployee?.so_dien_thoai || ""} readOnly/>
                                    </div>
                                </div>

                                <div className={styles.form_row}>
                                    <div className={styles.form_group}>
                                        <label>Chi Nhánh:</label>
                                        <input type="number" value={selectedEmployee?.chinhanh_id || ""} readOnly/>
                                    </div>
                                    <div className={styles.form_group}>
                                        <label>Phòng Ban:</label>
                                        <input type="text" value={selectedEmployee?.phong_ban_id || ""} readOnly/>
                                    </div>
                                </div>

                                <div className={styles.form_row}>
                                    <div className={styles.form_group}>
                                        <label>Chức Vụ:</label>
                                        <input type="text" value={selectedEmployee?.chuc_vu_id || ""} readOnly/>
                                    </div>
                                    <div className={styles.form_group}>
                                        <label>Trạng thái:</label>
                                        <input type="text" value={selectedEmployee?.trang_thai || ""} readOnly/>
                                    </div>
                                </div>
                                <div className={styles.form_row}>
                                    <div className={styles.form_group}>
                                        <label>Ngày vào làm:</label>
                                        <input type="date" value={selectedEmployee?.ngay_vao_lam || ""} readOnly/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}