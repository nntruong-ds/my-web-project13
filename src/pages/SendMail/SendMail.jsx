import React from 'react'
import styles from './SendMail.module.css'

export default function SendMail() {
    return (
        <div>
            <h2 className={styles.tittle}>Gửi Email</h2>
            <hr/>
            <div className="form-container">
                <form className={styles.form}>
                    <label htmlFor="diachi">Địa chỉ người nhận: <span className={styles.star}>*</span></label>
                    <input type="email" id="diachi" name="diachi"/>

                    <label htmlFor="tieude">Tiêu đề:</label>
                    <input type="text" id="tieude" name="tieude"/>

                    <label htmlFor="noidung">Nội Dung: <span className={styles.star}>*</span></label>
                    <input type="text" id="noidung" name="noidung" style={{width:'97%', height:'200px'}}/>

                    <button type="submit">Gửi</button>
                </form>
            </div>
        </div>
    );
}