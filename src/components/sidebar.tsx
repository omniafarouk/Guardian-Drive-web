import React from "react";
import { NavLink } from "react-router-dom";
import { getRole } from "../utils/storage";
import logo from "../assets/logo.png";
import "../styles/sidebar.css";
export default function Sidebar() {
    const role = getRole();

    return (
        <nav className="sidebar">


            {/* LOGO */}
            <div className="w-100 d-flex justify-content-center py-3">
                <NavLink to="/">
                    <img src={logo} alt="Logo" width={70} />
                </NavLink>
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
                            <div className="accordion-body">
                                <NavLink to="/admin/drivers/add">
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

                </div>

                {/* NORMAL LINKS */}
                <li className="nav-item">
                    <NavLink to="/trips" className="nav-link text-black">
                        Trips
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink to="/reports" className="nav-link text-black">
                        Reports
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink to="/logout" className="nav-link text-danger">
                        Logout
                    </NavLink>
                </li>

            </ul>
        </nav>
    );
}