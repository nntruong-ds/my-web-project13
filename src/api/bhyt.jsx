const API_URL = "http://127.0.0.1:8000";
export async function getBHYT(filters = {}) {
    const token = localStorage.getItem("token");

    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    const params = new URLSearchParams();

    Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
    });

    const res = await fetch(
        `${API_URL}/health-insurance/filter?${params.toString()}`,
        { headers }
    );

    if (!res.ok) throw new Error("Lỗi tải danh sách BHXH");

    return res.json();
}

export async function exportBHYT(filters = {}) {
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

    const url = `${API_URL}/health-insurance/export?${params.toString()}`;

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

export async function updateBHYT(data) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(
        `${API_URL}/health-insurance/update`,
        {
            method: "PUT",
            headers,
            body: JSON.stringify(data)
        }
    );

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
    }

    return res.json();
}
export async function createBHYT(data) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(
        `${API_URL}/health-insurance/`,
        {
            method: "POST",
            headers,
            body: JSON.stringify(data)
        }
    );

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
    }

    return res.json();
}
