import React from "react";
import { NavLink } from "react-router-dom";
import { getRole } from "../utils/storage";
import logo from "../assets/logo.png";
import { Dropdown } from "react-bootstrap";

export default function Sidebar() {
    const role = getRole();
    return (
        <>
            <nav className="bg-white w-25 vh-100 sticky-top d-flex flex-column align-items-center">

                {/* LOGO */}
                <div className="w-100 d-flex justify-content-center py-3">
                    <NavLink to="/">
                        <img src={logo} alt="Logo" width={100} />
                    </NavLink>
                </div>

                {/* MENU */}
                <ul className="nav flex-column w-100 px-3">

                    <div className="accordion accordion-flush" id="accordionFlushExample">
                        <div className="accordion-item  ">
                            <h2 className="accordion-header">
                                <button className=" accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                    Alerts
                                </button>
                            </h2>
                            <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body">
                                    <NavLink to="/alerts">
                                        Alert List
                                    </NavLink>
                                </div>
                            </div>
                            <div id="flush-collapseOne" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body">Placeholder content for this accordion</div>
                            </div>

                        </div>

                    </div>
                    <li className="nav-item ">
                        <NavLink to="/trips" className="nav-link text-black">
                            Trips
                        </NavLink>
                    </li>



                    <li className="nav-item ">
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
        </>
    );
}
//     return (
//         <div
//             className="bg-dark text-white min-vh-100 d-flex flex-column p-3"
//             style={{ width: "260px" }}
//         >
//             {/* LOGO */}

//             <div className='mb-100 mt-10'>
//                 <div className="align-items-center justify-content-center mb-10 mt-10">
//                     <NavLink to="/">
//                         <img
//                             src={logo}
//                             alt="Logo"
//                             style={{
//                                 width: "50px",
//                                 height: "50px",
//                                 objectFit: "contain",
//                             }}
//                         />
//                     </NavLink>
//                 </div>
//             </div>
//             {/* MENU */}
//             <div className="flex">
//                 <NavLink to="/">
//                     <img
//                         src={logo}
//                         alt="Logo"
//                        width={100}
//                     />
//                 </NavLink>
//             </div>
//             <ul className="flex justify-around">

//                 <li >
//                     <NavLink to="/trips" className="nav-link text-white">
//                         Trips
//                     </NavLink>
//                 </li>

//                 <li >
//                     <NavLink to="/alerts" className="nav-link text-white">
//                         Alerts
//                     </NavLink>
//                 </li>

//                 <li >
//                     <NavLink to="/reports" className="nav-link text-white">
//                         Reports
//                     </NavLink>
//                 </li>

//             </ul>
//         </div>
//     );
// }