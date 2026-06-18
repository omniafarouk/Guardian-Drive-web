import { Outlet, useMatches } from "react-router-dom";
import CustomNavbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";

export default function Layout() {
    const matches = useMatches();

    const title =
        ([...matches]
            .reverse()
            .find((m) => (m.handle as any)?.title)?.handle as any)?.title || "";

    return (
        <>
            <Sidebar />
           <div style={{ marginLeft: "250px" }}>
    <CustomNavbar title={title} />
    <Outlet />
</div>
        </>
    );
}