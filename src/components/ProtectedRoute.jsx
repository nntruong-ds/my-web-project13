import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ allowRoles, children }) {
    const role = localStorage.getItem("role");

    if (!role) {
        return <Navigate to="/login" replace />;
    }

    if (allowRoles && !allowRoles.includes(role)) {
        return <Navigate to="/overview" replace />;
    }

    return children;
}
