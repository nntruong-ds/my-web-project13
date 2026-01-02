const API_URL = "http://127.0.0.1:8000";

export async function getWorkTrips(filters = {}) {
    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    // Tạo query string từ filters
    const params = new URLSearchParams();

    Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== "") {
            params.append(key, filters[key]);
        }
    });

    const url = `${API_URL}/business-trips/filter/?${params.toString()}`;

    console.log("CALL API:", url);

    const res = await fetch(url, { headers });

    if (!res.ok) {
        throw new Error("Không lấy được danh sách công tác");
    }

    return res.json();
}

export async function createWorkTrip(payload) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/business-trips/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "Tạo công tác thất bại");
    }

    return res.json();
}
export async function exportWorkTrips(filters = {}) {
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

    const url = `${API_URL}/business-trips/export?${params.toString()}`;

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

export async function updateCT({ ma_nv, pb_id, cv_id, tu_ngay, data }) {
    const token = localStorage.getItem("token");

    const res = await fetch(
        `${API_URL}/business-trips/${ma_nv}/${pb_id}/${cv_id}/${tu_ngay}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }
    );

    if (!res.ok) {
        const err = await res.json();
        throw err;
    }

    return res.json();
}


