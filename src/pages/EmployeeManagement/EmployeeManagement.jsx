import React from "react";
import styles from "./EmployeeManagement.module.css";

export default function EmployeeManagement() {
    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.container_ds}>
                    <div className={styles.title_ds}>Danh sách nhân viên</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Mã NV</th>
                            <th>Chức Vụ</th>
                            <th>Chi Nhánh</th>
                            <th>Phòng Ban</th>
                        </tr>
                    </thead>
                </table>
                <div className={styles.action}>
                    <h3>Chỉnh sửa thông tin</h3>
                    <div className={styles.buttonGroup}>
                        <button className={styles.button}>Thêm</button>
                        <button className={styles.button}>Sửa</button>
                        <button className={styles.button}>Xóa</button>
                    </div>
                </div>
                
                <div className={styles.search}>
                    <h3>Tìm kiếm</h3>
                    <select>
                        <option>Chọn CN</option>
                    </select>
                    <select>
                        <option>Chọn CV</option>
                    </select>
                    <select>
                        <option>Chọn PB</option>
                    </select>
                    <input type="text" placeholder={"Tìm kiếm"}/>
                    <button>Tìm</button>
                </div>
                <div className={styles.addFile}>
                    <h3>Thêm danh sách</h3>
                    <button className={styles.chooseFile}>Choose File</button>
                    <button className={styles.add}>Thêm</button>
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.header}>Thông tin</div>
                <form className={styles.form_infor}>
                    <label>ID:</label>
                    <input type="number"/>

                    <label>Họ và tên:</label>
                    <input type="text"/>
                    
                    <label>Ngày sinh:</label>
                    <input type="date"/>

                    <label>Giới tính:</label>
                    <input type="text"/>

                    <label>Địa chỉ:</label>
                    <input type="text"/>

                    <label>Email:</label>
                    <input type="email"/>

                    <div className={styles.form_row}>
                        <div className={styles.form_group}>
                            <label>CCCD:</label>
                            <input type="text"/>
                        </div>
                        <div className={styles.form_group}>
                            <label>SĐT:</label>
                            <input type="number"/>
                        </div>
                    </div>

                    <div className={styles.form_row}>
                        <div className={styles.form_group}>
                            <label>Trạng thái:</label>
                            <input type="text"/>
                        </div>
                        <div className={styles.form_group}>
                            <label>Ngày vào làm:</label>
                            <input type="date"/>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}