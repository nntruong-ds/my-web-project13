import React, { useState } from "react";
import styles from "./BranchManagement.module.css";

export default function BranchManagement() {
    const [branches] = useState([
        { macn: "CN01", name: "Chi nhánh Hà Nội", address: "123 Trần Duy Hưng", phone: "0123456789", email: "hanoi@company.com", id_gd: "001", trangthai: "Hoạt động", ngaytl: "2005-11-18", sl: 2 },
        { macn: "CN02", name: "Chi nhánh TP.HCM", address: "456 Nguyễn Huệ", phone: "0987654321", email: "hcm@company.com", id_gd: "002", trangthai: "Tạm ngưng", ngaytl: "2010-03-15", sl: 4 },
        { macn: "CN03", name: "Chi nhánh Đà Nẵng", address: "789 Bạch Đằng", phone: "0999888777", email: "danang@company.com", id_gd: "003", trangthai: "Hoạt động", ngaytl: "2015-06-20", sl: 3 },
    ]);

    // Chi nhánh đang chọn
    const [selectedBranch, setSelectedBranch] = useState(null);

    // Khi click 1 dòng
    const handleSelectBranch = (branch) => {
        setSelectedBranch(branch);
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
                        {branches.map((branch) => (
                            <tr
                                key={branch.macn}
                                onClick={() => handleSelectBranch(branch)}
                                style={{
                                    cursor: "pointer",
                                    backgroundColor:
                                        selectedBranch?.macn === branch.macn
                                            ? "#d0ebff"
                                            : "white",
                                }}
                            >
                                <td>{branch.macn}</td>
                                <td>{branch.name}</td>
                                <td>{branch.address}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.search}>
                    <label>Tìm kiếm</label>
                    <select className={styles.select}>
                        <option>Chọn CN</option>
                        <option>Hà Nội</option>
                        <option>HCM</option>

                    </select>
                    <input className={styles.input} placeholder="Tìm kiếm" />
                    <button className={styles.button}>Tìm</button>
                </div>

                <div className={styles.action}>
                    <label className={styles.actionLabel}>Tùy chọn chi nhánh</label>
                    <div className={styles.buttonGroup}>
                        <button className={styles.button}>Thêm</button>
                        <button className={styles.button}>Sửa</button>
                        <button className={styles.button}>Xóa</button>
                    </div>
                </div>
            </div>

            {/*THÔNG TIN CHI NHÁNH */}
            {selectedBranch && (
                <div className={styles.right}>
                    <div className={styles.container_Infor}>
                        <div className={styles.header}>Thông tin Chi Nhánh</div>
                        <form className={styles.form_CN}>
                            <label>Mã CN</label>
                            <input
                                type="text"
                                value={selectedBranch?.macn || ""}
                                readOnly
                            />

                            <label>Tên CN</label>
                            <input
                                type="text"
                                value={selectedBranch?.name || ""}
                                readOnly
                            />

                            <label>Địa chỉ CN</label>
                            <input
                                type="text"
                                value={selectedBranch?.address || ""}
                                readOnly
                            />

                            <label>SĐT</label>
                            <input
                                type="text"
                                value={selectedBranch?.phone || ""}
                                readOnly
                            />

                            <label>Email</label>
                            <input
                                type="email"
                                value={selectedBranch?.email || ""}
                                readOnly
                            />

                            <label>ID GD</label>
                            <input
                                type="text"
                                value={selectedBranch?.id_gd || ""}
                                readOnly
                            />

                            <label>Trạng thái</label>
                            <input
                                type="text"
                                value={selectedBranch?.trangthai || ""}
                                readOnly
                            />

                            <label>Ngày thành lập</label>
                            <input
                                type="date"
                                value={selectedBranch?.ngaytl || ""}
                                readOnly
                            />

                            <label>Số lượng</label>
                            <input
                                type="number"
                                value={selectedBranch?.sl || ""}
                                readOnly
                            />
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}