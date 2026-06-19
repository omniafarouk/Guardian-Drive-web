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
import AddDriver from './pages/driver/addDriver'
import AddAdmin from './pages/admin/addAdmin'
import AddFleetManager from './pages/admin/addFleetMang'
import { BandsList } from './pages/bandsList'
import { BandDetails } from './pages/bandDetails'
import TowingRequestList from './pages/TowingRequestList/TowingRequestList'
import EmergencyRequestList from './pages/EmergencyRequestList/EmergencyRequestList'



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
                    {
                        path: 'towing-requests', children: [
                            { index: true, element: <TowingRequestList /> },
                            { path: ':id', element: <TowingRequestList /> }
                        ]
                    },
                    {
                        path: 'emergency-service-requests', children: [
                            { index: true, element: <EmergencyRequestList /> },
                            { path: ':id', element: <EmergencyRequestList /> }
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
            { path: 'dashboard', element: <FleetManagerDashboard></FleetManagerDashboard> },

        ]
    },
    //only admin
 {
    
        path: 'admin',
        element: <ProtectedRoute allowedRoles={[Role.ADMIN]} />,
        children: [
            {
                element: <Layout />,
                children: [
                    { path: 'dashboard', element: <AdminDashboard />, handle: { title: "Admin Dashboard" } },

                    { path: 'drivers/add', element: <AddDriver />, handle: { title: "Add New Driver" } },
                    { path: 'admins/add', element: <AddAdmin />, handle: { title: "Add New Admin" }},
                    { path: 'fleet-managers/add', element: <AddFleetManager />, handle: { title: "Add New Fleet Manager" } },

                    { path: 'bands-list', element: <BandsList />,  handle: { title: "Bands List" } },

                    { path: 'bands-list/:id', element: <BandDetails />, handle: { title: "Band Details" } },
                ]
            }
        ]
    }


])
export default function App() {
    return (
        <RouterProvider router={router}></RouterProvider>
    )
}
