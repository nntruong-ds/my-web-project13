// src/employee/manager/departmentKpi.service.js
const pool = require("../config/dbb");

async function getDepartmentKpiStat(
  managerId,
  period = null,
  employeeCode = null
) {
  try {
    const normalizedManagerId = managerId.toUpperCase();

    // 1. Lấy phòng ban của Trưởng Phòng
    const [managerRows] = await pool.query(
      `SELECT phong_ban_id
       FROM nhan_vien
       WHERE ma_nhan_vien = ?
       LIMIT 1`,
      [normalizedManagerId]
    );

    if (managerRows.length === 0 || !managerRows[0].phong_ban_id) {
      return null;
    }

    const departmentId = managerRows[0].phong_ban_id;

    // Nếu không có kỳ → lấy kỳ gần nhất
    if (!period) {
      const [latestRows] = await pool.query(
        `SELECT ky_danh_gia
         FROM kpi
         WHERE ma_nhan_vien IN (
           SELECT ma_nhan_vien FROM nhan_vien WHERE phong_ban_id = ?
         )
         ORDER BY ky_danh_gia DESC
         LIMIT 1`,
        [departmentId]
      );

      if (latestRows.length > 0) {
        period = latestRows[0].ky_danh_gia;
      } else {
        return { period: "không có dữ liệu", totalEmployees: 0, employees: [] };
      }
    }

    let query, params;

    if (employeeCode) {
      const normalizedCode = employeeCode.toUpperCase();

      query = `
        SELECT ten_kpi, muc_tieu, thuc_te, don_vi_tinh, ty_le_hoan_thanh, trang_thai, ghi_chu
        FROM kpi_nhan_vien
        WHERE ma_nhan_vien = ?
          AND ky_danh_gia = ?
        ORDER BY ten_kpi`;
      params = [normalizedCode, period];
    } else {
      query = `
        SELECT
          nv.ma_nhan_vien AS ma,
          nv.ho_ten AS ten,
          AVG(k.ty_le_hoan_thanh) AS avgCompletion,
          COUNT(CASE WHEN k.trang_thai = 'dat' THEN 1 END) AS achievedCount,
          COUNT(*) AS totalKpiCount
        FROM nhan_vien nv
        LEFT JOIN kpi_nhan_vien k ON nv.ma_nhan_vien = k.ma_nhan_vien AND k.ky_danh_gia = ?
        WHERE nv.phong_ban_id = ?
          AND nv.trang_thai = 'Đang làm'
        GROUP BY nv.ma_nhan_vien, nv.ho_ten
        ORDER BY avgCompletion DESC, achievedCount DESC, nv.ho_ten`;
      params = [period, departmentId];
    }

    const [rows] = await pool.query(query, params);

    if (rows.length === 0) {
      return employeeCode
        ? { notFound: true }
        : { period, totalEmployees: 0, employees: [] };
    }

    if (employeeCode) {
      return {
        period,
        employeeCode,
        kpis: rows.map((r) => ({
          tenKpi: r.ten_kpi,
          mucTieu: r.muc_tieu,
          thucTe: r.thuc_te,
          donVi: r.don_vi_tinh,
          tyLe: r.ty_le_hoan_thanh,
          trangThai: r.trang_thai,
          ghiChu: r.ghi_chu || "",
        })),
      };
    } else {
      const totalAchieved = rows.filter(
        (r) => r.achievedCount === r.totalKpiCount
      ).length;

      return {
        period,
        totalEmployees: rows.length,
        totalAchieved,
        highestAvg: rows[0]?.avgCompletion || 0,
        employees: rows.map((r) => ({
          ma: r.ma,
          ten: r.ten,
          avgCompletion: Math.round(r.avgCompletion),
          achieved: r.achievedCount,
          total: r.totalKpiCount,
          status: r.achievedCount === r.totalKpiCount ? "Đạt" : "Chưa đạt",
        })),
      };
    }
  } catch (err) {
    console.error("Lỗi lấy KPI phòng:", err);
    return null;
  }
}

module.exports = { getDepartmentKpiStat };
