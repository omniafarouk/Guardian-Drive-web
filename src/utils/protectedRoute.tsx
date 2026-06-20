// // ProtectedRoute.tsx
// import { Navigate } from 'react-router-dom'
// import PagesLayout from '../layouts/pagesLayout'

// export interface ProtectedRouteProps {
//     allowedRoles: string[] // array for the access roles
//     title: string
//     page: React.ReactNode
// }

// function ProtectedRoute({ allowedRoles, title, page }: ProtectedRouteProps) {
//     const role = localStorage.getItem("role")
//     const token = localStorage.getItem("token")

//     if (!role) throw Error("role is not set")

//     if (!token) return <Navigate to="/" />
//     if (!allowedRoles.includes(role!)) return <Navigate to="/" /> // wrong role --> return to login

//     return <PagesLayout title={title} page={page} />
// }

// export default ProtectedRoute


import { Navigate, Outlet } from "react-router-dom";
import { Role } from "../types/enums";

type Props = {
    allowedRoles: Role[];
};

const ProtectedRoute = ({ allowedRoles }: Props) => {
    const token = localStorage.getItem("token"); // or auth context
    const userRole = localStorage.getItem("role") as Role;

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;