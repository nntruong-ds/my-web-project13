// src/branchmanager/branchSummaryReport.service.js
const pool = require("../config/dbb");

async function getBranchSummaryReport(
  userId,
  period = null,
  showSalary = false
) {
  try {
    const normalizedId = userId.toUpperCase();

    // 1. Lấy chi nhánh của GDCN
    const [userRows] = await pool.query(
      `SELECT chinhanh_id FROM nhan_vien WHERE ma_nhan_vien = ? LIMIT 1`,
      [normalizedId]
    );

    if (userRows.length === 0 || !userRows[0].chinhanh_id) return null;

    const chiNhanhId = userRows[0].chinhanh_id;

    // 2. Thống kê tổng quan nhân sự
    const [overviewRows] = await pool.query(
      `SELECT
         COUNT(*) AS totalEmployees,
         COUNT(DISTINCT nv.phong_ban_id) AS totalDepartments
       FROM nhan_vien nv
       WHERE nv.chinhanh_id = ? AND nv.trang_thai = 'Đang làm'`,
      [chiNhanhId]
    );

    const overview = overviewRows[0] || {
      totalEmployees: 0,
      totalDepartments: 0,
    };

    // Xử lý period để dùng cho đi muộn và KPI
    let reportMonth = null; // dùng cho đi muộn
    let kpiPeriod = null; // dùng cho KPI

    let matchRows = [];

    if (period) {
      if (typeof period === "number") {
        reportMonth = period;

        const [rows] = await pool.query(
          `SELECT ky_danh_gia
       FROM kpi_nhan_vien
       WHERE ma_nhan_vien IN (
         SELECT ma_nhan_vien FROM nhan_vien WHERE chinhanh_id = ?
       )
       AND ky_danh_gia LIKE ?
       ORDER BY ky_danh_gia DESC
       LIMIT 1`,
          [chiNhanhId, `%-${String(period).padStart(2, "0")}`]
        );

        matchRows = rows;
        kpiPeriod = rows.length > 0 ? rows[0].ky_danh_gia : null;
      } else if (typeof period === "string") {
        kpiPeriod = period;

        const monthMatch = period.match(/-(\d{2})$/);
        if (monthMatch) {
          reportMonth = Number(monthMatch[1]);
        }
      }
    }

    // Nếu không có period → dùng tháng hiện tại
    if (!reportMonth) {
      reportMonth = new Date().getMonth() + 1;
    }

    // 3. Phòng kỷ luật tốt nhất (ít đi muộn nhất – dùng reportMonth)
    const [bestDisciplineRows] = await pool.query(
      `SELECT
        pb.ten_phong AS tenPhong,
        COALESCE(SUM(emp.late_count), 0) AS totalLate
      FROM (
        -- Lấy MAX so_lan_di_muon_ve_som của từng nhân viên trong tháng
        SELECT
          nv.phong_ban_id,
          MAX(cc.so_lan_di_muon_ve_som) AS late_count
        FROM nhan_vien nv
        INNER JOIN cham_cong cc
          ON nv.ma_nhan_vien = cc.ma_nhan_vien
          AND cc.thang = ?
        WHERE nv.chinhanh_id = ?
          AND nv.trang_thai = 'Đang làm'
        GROUP BY nv.ma_nhan_vien, nv.phong_ban_id
      ) emp
      INNER JOIN phong_ban pb ON emp.phong_ban_id = pb.mapb
      GROUP BY pb.mapb, pb.ten_phong
      ORDER BY totalLate ASC
       LIMIT 1`,
      [reportMonth, chiNhanhId]
    );

    const bestDiscipline =
      bestDisciplineRows.length > 0 ? bestDisciplineRows[0] : null;

    // 4. Top KPI (dùng kpiPeriod nếu có, không thì kỳ gần nhất)
    // Nếu có kỳ → lấy top 3
    let topKpi = [];
    if (kpiPeriod) {
      const [topKpiRows] = await pool.query(
        `SELECT
          nv.ho_ten AS ten,
          nv.ma_nhan_vien AS ma,
          pb.ten_phong AS tenPhong,
          AVG(k.ty_le_hoan_thanh) AS avgTyLe
        FROM kpi_nhan_vien k
        JOIN nhan_vien nv ON k.ma_nhan_vien = nv.ma_nhan_vien
        LEFT JOIN phong_ban pb ON nv.phong_ban_id = pb.mapb
        WHERE nv.chinhanh_id = ?
          AND k.ky_danh_gia = ?
        GROUP BY nv.ma_nhan_vien, nv.ho_ten, pb.ten_phong
        ORDER BY avgTyLe DESC
        LIMIT 3`,
        [chiNhanhId, kpiPeriod]
      );
      topKpi = topKpiRows.map((row) => ({
        ten: row.ten,
        ma: row.ma,
        tenPhong: row.tenPhong || "Chưa phân phòng",
        tyLe: Number(row.avgTyLe).toFixed(2),
      }));
    }

    // 5. Tổng lương từng phòng (lương hiện tại - không phụ thuộc period)
    let salaryByDepartment = [];
    let totalSalaryAll = 0;

    if (showSalary) {
      const [salaryRows] = await pool.query(
        `SELECT
           pb.ten_phong AS tenPhong,
           COALESCE(SUM(luong_latest.tong_luong), 0) AS totalSalary
         FROM phong_ban pb
         LEFT JOIN nhan_vien nv ON pb.mapb = nv.phong_ban_id
         LEFT JOIN (
           SELECT ma_nhan_vien, tong_luong
           FROM luong l1
           WHERE (nam, thang) = (
             SELECT nam, thang
             FROM luong l2
             WHERE l2.ma_nhan_vien = l1.ma_nhan_vien
             ORDER BY nam DESC, thang DESC
             LIMIT 1
           )
         ) luong_latest ON nv.ma_nhan_vien = luong_latest.ma_nhan_vien
         WHERE nv.chinhanh_id = ?
           AND nv.trang_thai = 'Đang làm'
         GROUP BY pb.mapb, pb.ten_phong
         ORDER BY totalSalary DESC`,
        [chiNhanhId]
      );

      salaryByDepartment = salaryRows;
      totalSalaryAll = salaryRows.reduce(
        (sum, r) => sum + Number(r.totalSalary),
        0
      );
    }

    return {
      chiNhanhId,
      period, // truyền lại period người dùng hỏi
      reportMonth, // tháng dùng cho kỷ luật
      kpiPeriod, // kỳ dùng cho KPI
      overview,
      topKpi,
      bestDiscipline,
      salaryByDepartment,
      totalSalaryAll,
      showSalary,
    };
  } catch (err) {
    console.error("Lỗi báo cáo tổng hợp chi nhánh:", err);
    return null;
  }
}

module.exports = { getBranchSummaryReport };
