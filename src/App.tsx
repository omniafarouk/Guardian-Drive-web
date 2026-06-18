import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/login'
import ForgetPassword from './pages/forgetPassword'
import ProtectedRoute from './utils/protectedRoute'
import { Role } from './types/enums'
import TripList from './pages/TripList/TripList'
import FleetManagerDashboard from './pages/fleetManager/fleetManagerDashboard'
import AdminDashboard from './pages/admin/adminDashboard';
import Layout from './pages/Layout/Layout'
import AlertList from './pages/alertList';
import AlertDetails from './pages/alertDetails'
import GuidanceList from './pages/guidanceList'
import TripDetails from './pages/TripDetails/TripDetails'


let router = createBrowserRouter([
    { path: '/', element: <Login /> },
    { path: '/forget-password', element: <ForgetPassword /> },
    //unauthorized
    //protected routes
    // protected layout (must be logged in)
    {
        path: "/",
        element: <ProtectedRoute allowedRoles={[Role.ADMIN, Role.FLEET_MANAGER]} />,
        children: [
            {
                element: <Layout />,
                children: [
                    // shared routes (both roles)
                    {
                        path: "trips", children: [
                            { index: true, element: <TripList /> },
                            { path: ":tripId", element: <TripDetails /> }
                        ]
                    },

                    { path: "alert-list", element: <AlertList /> },
                    { path: "alert-list/:id", element: <AlertDetails /> },
                    { path: "guidance-list", element: <GuidanceList /> },
                ],
            },
        ],
    },
    //only fleet
    {
        path: 'fleet-manager', element: <ProtectedRoute allowedRoles={[Role.FLEET_MANAGER]}></ProtectedRoute>, children: [
            { path: 'dashboard', element: <FleetManagerDashboard></FleetManagerDashboard> }
        ]
    },
    //only admin
    {
        path: 'admin', element: <ProtectedRoute allowedRoles={[Role.ADMIN]}></ProtectedRoute>, children: [
            { path: 'dashboard', element: <AdminDashboard></AdminDashboard> }
        ]
    }

])
export default function App() {
    return (
        <RouterProvider router={router}></RouterProvider>
    )
}
