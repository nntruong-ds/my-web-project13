import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div style={{ display: "flex" }}>
            <SideBar />
            <div style={{ flex: 1, padding: "20px" }}>
                <Outlet />
            </div>
        </div>
    );
}