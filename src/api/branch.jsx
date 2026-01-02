const API_URL = "http://127.0.0.1:8000";

export async function createBranch(data) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/branches/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Không thêm được chi nhánh");
    }

    return res.json();
}

export async function deleteBranch(ma_chi_nhanh) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/branches/${ma_chi_nhanh}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Không xóa được chi nhánh");
    }

    return true;
}

export async function getBranches() {
    const token = localStorage.getItem("token");

    const headers = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/branches/`, { headers });

    if (!res.ok) {
        throw new Error("Không lấy được danh sách chi nhánh");
    }

    return res.json();
}

export async function searchBranch(ma_chi_nhanh,data) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/branches/${ma_chi_nhanh}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Không tìm được chi nhánh");
    }

    return res.json();
}

export async function updateBranch(ma_chi_nhanh,data) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/branches/${ma_chi_nhanh}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Không cập nhật được chi nhánh");
    }

    return res.json();
}
