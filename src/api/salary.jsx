const API_URL = "http://127.0.0.1:8000";
export async function getSalary(filters = {}) {
    const token = localStorage.getItem("token");

    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const params = new URLSearchParams();

    Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
    });

    const res = await fetch(
        `${API_URL}/salary/list?${params.toString()}`,
        { headers }
    );

    if (!res.ok) throw new Error("Lỗi tải danh sách lương");

    return res.json();
}