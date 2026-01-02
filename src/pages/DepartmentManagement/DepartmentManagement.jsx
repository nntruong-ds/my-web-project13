import React from "react";
import styles from "./DepartmentManagement.module.css";

export default function DepartmentManagement() {
    return (
        <div className={styles.container}>
            {/*Danh Sách phòng ban*/}
            <div className={styles.left}>
                <div className={styles.container_dspb}>
                    <h3 className={styles.title_DS}>Danh sách phòng ban</h3>
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

                        </tbody>
                    </table>
                </div>
                <div className={styles.search}>
                    <select className={styles.search_group}>
                        <option>Chọn CN</option>
                    </select>
                    <select className={styles.search_group}>
                        <option>Chọn PB</option>
                    </select>
                    <input className={styles.input} type="text" placeholder={"Tìm kiếm"}/>
                    <button className={styles.button}>Tìm</button>
                </div>
            </div>

            {/* Thông tin */}
            <div className={styles.right}>
                <div className={styles.container_Infor}>
                    <div className={styles.header}>Thông tin trưởng phòng</div>
                    <form className={styles.form_trPB}>
                        <label>Tên phòng:</label>
                        <input type="text"/>
                        
                        <label>ID phòng:</label>
                        <input type="number"/>

                        <div className={styles.form_row}>
                            <div className={styles.form_group}>
                                <label>ID trưởng phòng</label>
                                <input type="number"/>
                            </div>
                            <div className={styles.form_group}>
                                <label>Số lượng nhân viên:</label>
                                <input type="number"/>
                            </div>
                        </div>
                        <div className={styles.form_row}>
                            <div className={styles.form_group}>
                                <label>Ngày tạo:</label>
                                <input type="date"/>
                            </div>
                            <div className={styles.form_group}>
                                <label>Mã CN:</label>
                                <input type="number"/>
                            </div>
                        </div>
                    </form>
                </div>
                <div className={styles.action}>
                    <button className={styles.button}>Thêm</button>
                    <button className={styles.button}>Sửa</button>
                    <button className={styles.button}>Xóa</button>
                </div>
            </div>
        </div>
    );
}