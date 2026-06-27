import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/login'
import ForgetPassword from './pages/forgetPassword'
import ProtectedRoute from './utils/protectedRoute'
import { Role } from './types/enums'
import TripList from './pages/Trips/TripList/TripList'
import FleetManagerDashboard from './pages/fleetManager/fleetManagerDashboard'
import AdminDashboard from './pages/adminDashBoard/adminDashboard';
import Layout from './pages/Layout/Layout'
import AlertList from './pages/alertList';
import AlertDetails from './pages/alertDetails'
import GuidanceList from './pages/guidanceList'
import TripDetails from './pages/Trips/TripDetails/TripDetails'
import { BandsList } from './pages/Bands/bandsList'
import { BandDetails } from './pages/Bands/bandDetails'
import EmergencyRequestList from './pages/EmergencyRequest/EmergencyRequestList'
import CarList from './pages/cars/carsList'
import CarDetails from './pages/cars/carDetails'
import EditCar from './pages/cars/EditCar'
import AddCar from './pages/cars/addCar'
import Reports from './pages/Reports/Reports'
import DriverPerformanceReport from './pages/DriverPerformanceReport/DriverPerformanceReport'
import EmergencyPerformanceReport from './pages/emergencyPerformanceReport'
import CreateTrip from './pages/Trips/CreateTrip/CreateTrip'
import { UsersList } from './pages/users/ListofUsers'
import { DriversList } from './pages/users/ListofDrivers'
import { ManagersList } from './pages/users/ListofFleetManagers'
import { AdminsList } from './pages/users/ListofAdmins'
import ViewMedicalInfo from './pages/medicalInfo/viewMedicalInfo'
import AlertInfo from './pages/HandleAlert/AlertInfo'
import HandleAlertLayout from './pages/HandleAlert/HandleAlertLayout'
import EmergencyRequestInfo from './pages/HandleAlert/EmergencyRequestInfo'
import TowingRequestInfo from './pages/HandleAlert/TowingRequestInfo'
import DriverPerformanceReportDataEntry from './pages/DriverPerformanceReport/DriverPerformanceReportDataEntry';

import HealthEvents from './pages/HealthEvents/viewHealthEvent'
import AddWearableBand from './pages/Bands/addBand'
import UserDetails from './pages/users/userDetails'
import AddUser from './pages/users/addUser'
import ViewAvgHealthReadings from './pages/Avghealthreadings/ViewAvgHealthReadings'
import DriverOnboarding from './pages/users/driverOnBoarding'
import NotFound404 from './pages/Errors/NotFound404'
import Forbidden403 from './pages/Errors/Forbidden403'
import EmergencyRequestDetails from './pages/EmergencyRequest/EmergencyRequestDetails'
import TowingRequestList from './pages/TowingRequest/TowingRequestList'
import TowingRequestDetails from './pages/TowingRequest/TowingRequestDetails'
let router = createBrowserRouter([
    { path: '/', element: <Login /> },
    { path: '/forget-password', element: <ForgetPassword /> },
    // { path: '/unauthorized', element: <Forbidden403 /> },
    {
        //  path: "/",
        element: <ProtectedRoute allowedRoles={[Role.ADMIN, Role.FLEET_MANAGER]} />,
        children: [
            {
                element: <Layout />,
                children: [
                    { path: 'unauthorized', element: <Forbidden403 />, handle: { title: "Access Denied" } },
                    // shared routes (both roles)
                    {
                        path: "trips",
                        children: [
                            { index: true, element: <TripList /> },
                            { path: ":tripId", element: <TripDetails /> }
                        ], handle: { title: "Trips List" }
                    },

                    {
                        path: 'towing-requests',
                        children: [
                            { index: true, element: <TowingRequestList />, handle: { title: "Towing Requests List" } },
                            { path: ':id', element: <TowingRequestDetails />, handle: { title: "Towing Request Details" } }
                        ]
                    },

                    {
                        path: 'emergency-service-requests',
                        children: [
                            {
                                index: true, element: <EmergencyRequestList />,
                                handle: { title: "Emergency Service Requests List" }
                            },
                            {
                                path: ':id', element: <EmergencyRequestDetails />,
                                handle: { title: "Emergency Service Request Details" }
                            }
                        ]
                    },

                    { path: "alert-list", element: <AlertList />, handle: { title: "Alerts" } },
                    { path: "alert-list/:id", element: <AlertDetails />, handle: { title: "Alert Details" } },
                    { path: "guidance-list", element: <GuidanceList />, handle: { title: "Guidance List" } },

                    { path: "cars-list", element: <CarList />, handle: { title: "Cars List" } },
                    { path: "carDetails/:engineId", element: <CarDetails />, handle: { title: "Car Details" } },
                    { path: "drivers-list", element: <DriversList />, handle: { title: "Drivers List" } },
                    { path: "user-details/:id", element: <UserDetails />, handle: { title: "User Details" } },
                    { path: "medical-info/:id", element: <ViewMedicalInfo />, handle: { title: "Medical Information" } },
                    { path: "avg-health-readings/:id", element: <ViewAvgHealthReadings />, handle: { title: "Average Health Readings" } },
                    { path: "health-events/:id", element: <HealthEvents />, handle: { title: "Health Events" } },





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

                    { path: 'dashboard', element: <FleetManagerDashboard />, handle: { title: "Dashboard" } },

                    {
                        path: 'trips',
                        children: [

                            { path: 'create', element: <CreateTrip />, handle: { title: "Create Trip" } }
                        ]
                    },
                    {
                        path: 'alerts',
                        children: [

                            {
                                path: ':alertId/handle-alert', element: <HandleAlertLayout />, handle: { title: "Handle Alert" },

                                children: [
                                    { index: true, element: <AlertInfo /> },
                                    { path: 'emergency-request', element: <EmergencyRequestInfo />, },
                                    { path: 'towing-request', element: <TowingRequestInfo /> }
                                ]

                            }
                        ]
                    },


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


                    { path: 'add-user', element: <AddUser />, handle: { title: "Add New User" } },
                    { path: 'driver-onboarding/:driverId', element: <DriverOnboarding />, handle: { title: "Driver Information" } },




                    { path: 'bands-list', element: <BandsList />, handle: { title: "Bands List" } },
                    { path: 'add-band', element: <AddWearableBand />, handle: { title: "Add New Band" } },


                    { path: 'bands-list/:id', element: <BandDetails />, handle: { title: "Band Details" } },

                    { path: "cars/:engineId/edit", element: <EditCar />, handle: { title: "Edit Car" } },
                    { path: "cars/add", element: <AddCar />, handle: { title: "Add new Car" } },
                    { path: "users-list", element: <UsersList />, handle: { title: "Users List" } },
                    { path: "fleet-managers-list", element: <ManagersList />, handle: { title: "Fleet Managers List" } },
                    { path: "admins-list", element: <AdminsList />, handle: { title: "Admins List" } },


                    {
                        path: 'reports',
                        children: [
                            { index: true, element: <Reports />, handle: { title: "Reports" } },
                            {
                                path: 'drivers',
                                children: [
                                    { index: true, element: <DriverPerformanceReportDataEntry />, handle: { title: "Driver Performance Report" } },
                                    { path: ':id', element: <DriverPerformanceReport />, handle: { title: "Driver Performance Report" } }
                                ]
                            },
                            {
                                path: 'emergency-performance',
                                element: <EmergencyPerformanceReport />,
                                handle: { title: "Emergency Performance Report" }
                            },
                        ]
                    },
                ]
            }
        ]
    },
    // {
    //     path: "*",
    //     element: <NotFound404 />
    // },
    {
        element: <ProtectedRoute allowedRoles={[Role.ADMIN, Role.FLEET_MANAGER]} />,
        children: [
            {
                element: <Layout />,
                children: [
                    { path: "*", element: <NotFound404 />, handle: { title: "Page Not Found" } }
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