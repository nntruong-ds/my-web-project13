const API_URL = "http://127.0.0.1:8000";

export async function searchEmployee(ma_nhan_vien) {
    const token = localStorage.getItem("token");

    const headers = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/employees/`, { headers });

    if (!res.ok) {
        throw new Error("Không tìm được nhân viên");
    }

    return res.json();
}
export async function getEmployee() {
    const token = localStorage.getItem("token");

    const headers = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/employees/`, { headers });

    if (!res.ok) {
        throw new Error("Không lấy được danh sách nhân viên");
    }

    return res.json();
}

export async function updateEmployee(ma_nhan_vien,data) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/employees/${ma_nhan_vien}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Không cập nhật được nhân viên");
    }

    return res.json();
}

export async function deleteEmployee(ma_nhan_vien) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/employees/${ma_nhan_vien}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Không xóa được nhân viên");
    }

    return true;
}

export async function createEmployee(data) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/employees/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Không thêm được nhân viên");
    }

    return res.json();
}

export async function importEmployee(file) {
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/employees/import-excel`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const err = await res.json();
        throw err;
    }

    return await res.json(); // hoặc text()
}
