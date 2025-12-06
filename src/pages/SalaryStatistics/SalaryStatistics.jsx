import React from "react";
import styles from "./SalaryStatistics.module.css";

export default function SalaryStatistics() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>Danh Sách Lương Nhân Viên</div>
                <table>
                    <thead>
                        <tr>
                            <th>MÃ NV</th>
                            <th>TÊN NV</th>
                            <th>Chức Vụ</th>
                            <th>Phụ Cấp</th>
                            <th>Tăng ca</th>
                            <th>Bảo Hiểm</th>
                            <th>Tổng Lương</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div className={styles.func}>
                <div className={styles.search}>
                    <b>Tìm Kiếm</b>
                    <div className={styles.row}>
                        <div className={styles.group}>
                            <input type="text" placeholder="Chi nhánh"/>
                        </div>
                        <div className={styles.group}>
                            <input type="text" placeholder="Chức vụ"/>
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.group}>
                            <input type="text" placeholder="Phòng ban"/>
                        </div>
                        <div className={styles.group}>
                            <input type="text" placeholder="Tìm kiếm"/>
                        </div>
                    </div>
                    <button type="submit">Tìm</button>
                </div>
                <div className={styles.other}>
                    <h3>Tùy chọn khác</h3>
                    <div className={styles.action}>
                        <div>Xuất ra Excel</div>
                        <button>Xuất</button>
                    </div>
                    <div className={styles.action}>
                        <div>Tổng lương</div>
                        <button>Xem tổng</button>
                    </div>
                </div>
            </div>
        </div>
    );
}