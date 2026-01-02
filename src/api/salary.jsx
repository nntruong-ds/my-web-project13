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

export async function exportSalary(filters = {}) {
    const token = localStorage.getItem("token");

    const headers = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const params = new URLSearchParams();

    Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
            params.append(key, filters[key]);
        }
    });

    const url = `${API_URL}/salary/export?${params.toString()}`;

    console.log("EXPORT API:", url);

    const res = await fetch(url, {
        method: "GET",
        headers
    });

    if (!res.ok) {
        throw new Error("Xuất Excel thất bại");
    }

    return res.blob();
}