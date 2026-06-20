import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/login'
import ForgetPassword from './pages/forgetPassword'
import ProtectedRoute from './utils/protectedRoute'
import { Role } from './types/enums'
import TripList from './pages/TripList/TripList'
import FleetManagerDashboard from './pages/fleetManager/fleetManagerDashboard'
import AdminDashboard from './pages/adminDashBoard/adminDashboard';
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
import CarList from './pages/cars/carsList'
import CarDetails from './pages/cars/carDetails'
import EditCar from './pages/cars/EditCar'
import AddCar from './pages/cars/addCar'
import Reports from './pages/Reports/Reports'
import DriverPerformanceReportDataEntry from './pages/DriverPerformanceReportDataEntry/DriverPerformanceReportDataEntry'
import DriverPerformanceReport from './pages/DriverPerformanceReport/DriverPerformanceReport'
import EmergencyPerformanceReport from './pages/emergencyPerformanceReport'

let router = createBrowserRouter([
    { path: '/', element: <Login /> },
    { path: '/forget-password', element: <ForgetPassword /> },

    {
        path: "/",
        element: <ProtectedRoute allowedRoles={[Role.ADMIN, Role.FLEET_MANAGER]} />,
        children: [
            {
                element: <Layout />,
                children: [

                    // shared routes (both roles)
                    {
                        path: "trips",
                        children: [
                            { index: true, element: <TripList /> },
                            { path: ":tripId", element: <TripDetails /> }
                        ]
                    },

                    {
                        path: 'towing-requests',
                        children: [
                            { index: true, element: <TowingRequestList /> },
                            { path: ':id', element: <TowingRequestList /> }
                        ]
                    },

                    {
                        path: 'emergency-service-requests',
                        children: [
                            { index: true, element: <EmergencyRequestList /> },
                            { path: ':id', element: <EmergencyRequestList /> }
                        ]
                    },

                    { path: "alert-list", element: <AlertList /> },
                    { path: "alert-list/:id", element: <AlertDetails /> },
                    { path: "guidance-list", element: <GuidanceList /> },

                    { path: "cars-list", element: <CarList />, handle: { title: "Cars List" } },
                    { path: "carDetails/:engineId", element: <CarDetails />, handle: { title: "Car Details" } },

                ]
            }
        ]
    },

    {
        path: 'fleet-manager',
        element: <ProtectedRoute allowedRoles={[Role.FLEET_MANAGER]}></ProtectedRoute>,
        children: [
            {
                element: <Layout />, children: [
                    {
                        path: 'towing-requests',
                        children: [
                            { index: true, element: <TowingRequestList />, handle: { title: "Towing Requests" } },
                            { path: ':id', element: <TowingRequestList />, handle: { title: "Towing Request Details" } }
                        ]
                    },
                    {
                        path: 'emergency-service-requests',
                        children: [
                            { index: true, element: <EmergencyRequestList />, handle: { title: "Emergency Requests" } },
                            { path: ':id', element: <EmergencyRequestList />, handle: { title: "Emergency Request Details" } }
                        ]
                    },
                    { path: 'dashboard', element: <FleetManagerDashboard />, handle: { title: "Dashboard" } },
                ]
            }
        ]
    },

    {
        path: 'admin',
        element: <ProtectedRoute allowedRoles={[Role.ADMIN]} />,
        children: [
            {
                element: <Layout />,
                children: [

                    { path: 'dashboard', element: <AdminDashboard />, handle: { title: "Admin Dashboard" } },

                    { path: 'drivers/add', element: <AddDriver />, handle: { title: "Add New Driver" } },
                    { path: 'admins/add', element: <AddAdmin />, handle: { title: "Add New Admin" } },
                    { path: 'fleet-managers/add', element: <AddFleetManager />, handle: { title: "Add New Fleet Manager" } },

                    { path: 'bands-list', element: <BandsList />, handle: { title: "Bands List" } },

                    { path: 'bands-list/:id', element: <BandDetails />, handle: { title: "Band Details" } },

                    { path: "cars/:engineId/edit", element: <EditCar />, handle: { title: "Edit Car" } },
                    { path: "cars/add", element: <AddCar />, handle: { title: "Add new Car" } },

                    {
                        path: 'reports',
                        children: [
                            { index: true, element: <Reports />, handle: { title: "Reports" } },
                            {
                                path: 'drivers',
                                children: [
                                    { index: true, element: <DriverPerformanceReportDataEntry />, handle: { title: "Driver Performance" } },
                                    { path: ':id', element: <DriverPerformanceReport />, handle: { title: "Driver Performance Report" } }
                                ]
                            },
                            {
                                path: 'emergency-performance',
                                element: <EmergencyPerformanceReport />,
                                handle: { title: "Emergency Performance" }
                            },
                        ]
                    },
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