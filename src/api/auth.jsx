const API_URL = "http://localhost:8000";

export async function loginApi(username, password) {
    const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Login failed");
    }

    return res.json();
}

export async function logoutApi(token) {
    const res = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return res.json();
}
