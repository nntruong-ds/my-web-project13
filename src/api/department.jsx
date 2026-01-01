const API_URL = "http://127.0.0.1:8000";

export async function getDepartment(){
    const token = localStorage.getItem("token");
    const headers = {};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}/departments/`, { headers });

    if (!res.ok) {
        throw new Error("Không lấy được danh sách phòng ban");
    }

    return res.json();
}
export async function createDepartment(data){
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/departments/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Không thêm được phòng ban");
    }

    return res.json();
}
export async function deleteDepartment(mapb) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/departments/${mapb}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Không xóa được phòng ban");
    }

    return true;
}


export async function searchDepartment(mapb,data) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/departments/${mapb}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Không cập nhật được phòng ban");
    }

    return res.json();
}

export async function updateDepartment(mapb,data) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/departments/${mapb}`, {
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
