import React from "react";
import styles from "./BHXH.module.css";

export default function BHXH() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>THEO DÕI ĐÓNG BHXH THÁNG 10-2025</div>
                <table>
                    <thead>
                    <tr>
                        <th>MÃ NV</th>
                        <th>TÊN NV</th>
                        <th>MÃ BHXH</th>
                        <th>CHI NHÁNH</th>
                        <th>PHÒNG BAN</th>
                        <th>LƯƠNG</th>
                        <th>PHẦN TRĂM</th>
                        <th>SỐ TIỀN ĐÓNG</th>
                    </tr>
                    </thead>
                </table>
            </div>
            <div className={styles.container1}>
                <div className={styles.func}>
                    <div className={styles.search}>
                        <b>Tìm Kiếm</b>
                        <div className={styles.row}>
                            <input type="text" placeholder="Chi nhánh" />
                            <input type="text" placeholder="Phòng ban" />
                        </div>

                        <div className={styles.row}>
                            <input
                                className={styles.fullInput}
                                type="text"
                                placeholder="Tìm kiếm theo tên, mã nhân viên"
                            />
                            <button>Tìm</button>
                        </div>
                    </div>
                </div>

                <div className={styles.other}>
                    <h3>Tùy chọn khác</h3>
                    <div className={styles.action}>
                        <div>Xuất ra Excel</div>
                        <button>Xuất</button>
                    </div>
                    <div className={styles.action}>
                        <button>Cập Nhật</button>
                    </div>
                </div>
            </div>
        </div>
    );
}