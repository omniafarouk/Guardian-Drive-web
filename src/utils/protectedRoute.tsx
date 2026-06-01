// ProtectedRoute.tsx
import { Navigate } from 'react-router-dom'
import PagesLayout from '../layouts/pagesLayout'

export interface ProtectedRouteProps {
    allowedRoles: string[] // array for the access roles
    title: string
    page: React.ReactNode
}

function ProtectedRoute({ allowedRoles, title, page }: ProtectedRouteProps) {
    const role = localStorage.getItem("role")
    const token = localStorage.getItem("token")

    if (!role) throw Error("role is not set")

    if (!token) return <Navigate to="/" />
    if (!allowedRoles.includes(role!)) return <Navigate to="/" /> // wrong role --> return to login

    return <PagesLayout title={title} page={page} />
}

export default ProtectedRoute