import React from 'react'
import styles from './UpdateInfor.module.css'

export default function UpdateInfor() {
    return (
        <div>
            <h2 className={styles.title}>Cập Nhật Thông Tin</h2>
            <hr/>
            <div className={styles.form_container}>
                <div className={styles.tittle_form}>Thông tin mới</div>
                <form>
                    <div className={styles.form_row}>
                        <div className={styles.form_group}>
                            <label htmlFor="hoten">Họ và tên</label>
                            <input type="name" id="hoten" name="hoten"/>
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor="manv">Mã nhân viên</label>
                            <input type="text" id="manv" name="manv"/>
                        </div>
                    </div>

                    <div className={styles.form_row}>
                        <div className={styles.form_group}>
                            <label htmlFor="gt">Giới tính</label>
                            <input type="text" id="gt" name="gt"/>
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor="cccd">CCCD</label>
                            <input type="number" id="cccd" name="cccd"/>
                        </div>
                    </div>

                    <div className={styles.form_row}>
                        <div className={styles.form_group}>
                            <label htmlFor="ngsinh">Ngày sinh</label>
                            <input type="date" id="ngsinh" name="ngsinh"/>
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor="sđt">SĐT</label>
                            <input type="number" id="sđt" name="sđt"/>
                        </div>
                    </div>

                    <div className={styles.form_row}>
                        <div className={styles.form_group}>
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email"/>
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor="diachi">Địa chỉ</label>
                            <input type="text" id="diachi" name="diachi"/>
                        </div>
                    </div>

                    <div className={styles.form_row}>
                        <div className={styles.form_group}>
                            <label htmlFor="mapb">Mã PB</label>
                            <input type="number" id="mapb" name="mapb"/>
                        </div>
                        <div className={styles.form_group}>
                            <label htmlFor="macn">Mã CN</label>
                            <input type="number" id="macn" name="macn"/>
                        </div>
                    </div>

                    <button type="submit">Cập Nhật</button>
                </form>
                </div>
        </div>
    );
}