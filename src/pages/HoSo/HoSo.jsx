import React from "react";
import styles from "./HoSo.module.css";

export default function HoSo(){
    return (
        <div className={styles.container}>
            <div className={styles.title}>
                <h3 className={styles.titleTable}>Hồ Sơ Của Bạn</h3>
                <div className={styles.btn}>
                    <button>Cập Nhật</button>
                    <button>Chỉnh Sửa</button>
                </div>
            </div>
            <div className={styles.table}>
                <h3 className={styles.titleTable1}>Thông tin</h3>
                <div className={styles.content}>
                    <div className={styles.left}>
                        <form action="">
                            <label htmlFor="">ID:</label>
                            <input type="number"/>

                            <label htmlFor="">Họ và tên:</label>
                            <input type="text"/>

                            <label htmlFor="">Ngày sinh:</label>
                            <input type="date"/>

                            <label htmlFor="">Giới tính:</label>
                            <input type="text"/>

                            <label htmlFor="">Địa chỉ:</label>
                            <input type="text"/>

                            <label htmlFor="">Email:</label>
                            <input type="email"/>

                            <div className={styles.row}>
                                <div className={styles.col}>
                                    <label htmlFor="">CCCD:</label>
                                    <input type="number"/>
                                </div>
                                <div className={styles.col}>
                                    <label htmlFor="">SĐT:</label>
                                    <input type="number"/>
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.col}>
                                    <label htmlFor="">Trạng thái:</label>
                                    <input type="number"/>
                                </div>
                                <div className={styles.col}>
                                    <label htmlFor="">Ngày vào làm:</label>
                                    <input type="date"/>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className={styles.right}>
                        <img src="/image/download.jpg" alt=""/>
                    </div>
                </div>
            </div>
        </div>
    );
}