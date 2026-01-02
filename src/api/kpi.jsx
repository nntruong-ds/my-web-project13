const API_URL = "http://127.0.0.1:8000";

export async function getKPI(filters = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const params = new URLSearchParams();

    Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
            params.append(key, filters[key]);
        }
    });

    const url = `${API_URL}/kpi/overview/?${params.toString()}`;

    console.log("CALL API:", url);

    const res = await fetch(url, { headers });

    if (!res.ok) {
        throw new Error("Không lấy được danh sách kpi");
    }

    return res.json();
}

export async function exportKPI(filters = {}) {
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

    const url = `${API_URL}/kpi/export-overview?${params.toString()}`;

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

export async function updateKpi(
    ma_nhan_vien,
    ten_kpi,
    ky_danh_gia,
    data
) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : undefined
    };

    const res = await fetch(
        `${API_URL}/kpi/update` +
        `?ma_nhan_vien=${encodeURIComponent(ma_nhan_vien)}` +
        `&ten_kpi=${encodeURIComponent(ten_kpi)}` +
        `&ky_danh_gia=${encodeURIComponent(ky_danh_gia)}`,
        {
            method: "PUT",
            headers,
            body: JSON.stringify(data),
        }
    );

    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function createKpi(data) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(
        `${API_URL}/kpi/`,
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
export async function getKpi1(ma_nhan_vien, { thang, nam }) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(
        `${API_URL}/kpi/detail/${ma_nhan_vien}?thang=${thang}&nam=${nam}`,
        {
            method: "GET",
            headers,
        }
    );

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
    }

    return res.json();
}