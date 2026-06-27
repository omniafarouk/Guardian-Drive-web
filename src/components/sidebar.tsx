import React from "react";
import { NavLink } from "react-router-dom";
import { getRole } from "../utils/storage";
import logo from "../assets/logo.png";
import "../styles/sidebar.css";
import { Role } from "../types/enums";
import { useNavigate } from "react-router-dom";
import { logout } from '../services/AuthService';

export default function Sidebar() {
    const navigate = useNavigate();
    const role = getRole();
    const handleLogout = () => {
        logout();
        navigate("/");
        alert("successfully logged out");
    }
    return (
        <nav className="sidebar">


            {/* LOGO */}
            <div className="w-100 d-flex justify-content-center py-3">
                {getRole() === Role.FLEET_MANAGER ?
                    <NavLink to="/fleet-manager/dashboard">
                        <img src={logo} alt="Logo" width={70} />
                    </NavLink> :
                    <NavLink to="/admin/dashboard">
                        <img src={logo} alt="Logo" width={70} />
                    </NavLink>}
                {/* <NavLink to="/">
                    <img src={logo} alt="Logo" width={70} />
                </NavLink> */}
            </div>

            <ul className="nav flex-column w-100 px-3">

                <div className="accordion accordion-flush" id="sidebarAccordion">

                    {/* USERS */}
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#usersCollapse"
                                aria-controls="usersCollapse"
                            >
                                Users
                            </button>
                        </h2>

                        <div
                            id="usersCollapse"
                            className="accordion-collapse collapse"
                            data-bs-parent="#sidebarAccordion"
                        >
                            {(role === Role.ADMIN) && <>
                                <div className="accordion-body">
                                    <NavLink to="/admin/users-list">
                                        All Users
                                    </NavLink>
                                </div>



                                <div className="accordion-body">
                                    <NavLink to="/admin/fleet-managers-list">
                                        Fleet Managers
                                    </NavLink>
                                </div>

                                <div className="accordion-body">
                                    <NavLink to="/admin/admins-list">
                                        Admins
                                    </NavLink>
                                </div>
                            </>}

                            <div className="accordion-body">
                                <NavLink to="/drivers-list">
                                    Drivers
                                </NavLink>
                            </div>
                        </div>
                    </div>


                    {/* ALERTS */}
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#alertsCollapse"
                                aria-controls="alertsCollapse"
                            >
                                Alerts
                            </button>
                        </h2>

                        <div
                            id="alertsCollapse"
                            className="accordion-collapse collapse"
                            data-bs-parent="#sidebarAccordion"
                        >
                            <div className="accordion-body">
                                <NavLink to="/alert-list">
                                    Alert List
                                </NavLink>

                            </div>
                            <div className="accordion-body">
                                <NavLink to="/towing-requests">
                                    Towing Requests
                                </NavLink>

                            </div>
                            <div className="accordion-body">
                                <NavLink to="/emergency-service-requests">
                                    Emergency Service Requests
                                </NavLink>

                            </div>
                        </div>
                    </div>

                    {/* CARS */}
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#carsCollapse"
                                aria-controls="carsCollapse"
                            >
                                Cars
                            </button>
                        </h2>

                        <div
                            id="carsCollapse"
                            className="accordion-collapse collapse"
                            data-bs-parent="#sidebarAccordion"
                        >
                            <div className="accordion-body">
                                <NavLink to="/cars-list">
                                    Cars List
                                </NavLink>

                            </div>
                            {(role === Role.ADMIN) && <div className="accordion-body">
                                <NavLink to="/admin/cars/add">
                                    Add New Car
                                </NavLink>

                            </div>}


                        </div>

                    </div>

                    {/* Medical Information */}
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#medicalinfoCollapse"
                                aria-controls="medicalinfoCollapse"
                            >
                                Medical Information
                            </button>
                        </h2>

                        <div
                            id="medicalinfoCollapse"
                            className="accordion-collapse collapse"
                            data-bs-parent="#sidebarAccordion"
                        >
                            <div className="accordion-body">
                                <NavLink to="/medical-info-list">
                                    Medical Information List
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    {/* Health Events */}
                    <div className="accordion-item">
                        <h2 className="accordion-header">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#eventsCollapse"
                                aria-controls="eventsCollapse"
                            >
                                Health Events                            </button>
                        </h2>

                        <div
                            id="eventsCollapse"
                            className="accordion-collapse collapse"
                            data-bs-parent="#sidebarAccordion"
                        >
                            <div className="accordion-body">
                                <NavLink to="/health-events-list">
                                    Health Events List
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NORMAL LINKS */}
                <li className="nav-item">
                    <NavLink to="/trips" className="nav-link text-black">
                        Trips
                    </NavLink>
                </li>
                <li className="nav-item">
                    <NavLink to="/guidance-list" className="nav-link text-black">
                        First Aid Guidances
                    </NavLink>
                </li>
                {(role === Role.ADMIN) && <li className="nav-item">
                    <NavLink to="/admin/reports" className="nav-link text-black">
                        Reports
                    </NavLink>
                </li>}

                {role === Role.ADMIN && (
                    <li className="nav-item mb-2">
                        <NavLink to="/admin/bands-list" className="nav-link text-black"> Bands
                            {/* <span>
                            <i className="bi bi-smartwatch me-2 align-items-center"></i> Bands
                        </span>
                        <i className='bi bi-chevron-down'></i> */}

                        </NavLink>
                    </li>
                )}

                {/* <li className="nav-item">
                    <NavLink to="/" className="nav-link text-danger" onClick={handleLogout()}>
                        Logout
                    </NavLink>
                </li> */}
                <li className="nav-item d-flex justify-content-center">
                    <button
                        className="nav-link text-danger border-0 bg-transparent"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </li>
            </ul>
        </nav>
    );
}