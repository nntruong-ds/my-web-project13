import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#22c55e", "#8b5cf6"];

export default function OverView() {
    const [employeeData, setEmployeeData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);

    useEffect(() => {
        async function fetchBranches() {
            try {
                const res = await fetch("http://127.0.0.1:8000/branches/");
                const data = await res.json();

                const empData = data.map(item => ({
                    name: item.ten_chi_nhanh,
                    value: item.so_luong_nhan_vien
                }));
                const depData = data.map(item => ({
                    name: item.ten_chi_nhanh,
                    value: item.so_luong_phong_ban
                }));

                setEmployeeData(empData);
                setDepartmentData(depData);
            } catch (err) {
                console.error("Lỗi load chi nhánh", err);
            }
        }

        fetchBranches();
    }, []);

    return (
        <div style={{ padding: 24, maxWidth: 1200 }}>
            <h2>Thống kê theo chi nhánh</h2>

            <div style={{ display: "flex", gap: 32 }}>
                {/* BIỂU ĐỒ NHÂN VIÊN */}
                <div style={{ flex: 1 }}>
                    <h3>Số lượng nhân viên</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={employeeData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                label
                            >
                                {employeeData.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* BIỂU ĐỒ PHÒNG BAN */}
                <div style={{ flex: 1 }}>
                    <h3>Số lượng phòng ban</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={departmentData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                label
                            >
                                {departmentData.map((_, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
