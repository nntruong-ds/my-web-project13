import React from "react";
import styles from "./Khen.module.css";

export default function Khen() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>DANH SACH KHEN THƯỞNG</div>
                <table>
                    <thead>
                    <tr>
                        <th>MÃ NV</th>
                        <th>TÊN NV</th>
                        <th>Ngày</th>
                        <th>Hình Thức</th>
                        <th>Lý Do</th>
                        <th>Số Tiền</th>
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