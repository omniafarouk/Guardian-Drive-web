import { useState } from 'react'
import { Offcanvas, Button } from 'react-bootstrap'
import { NavLink, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png';
import { logout } from '../services/AuthService';

function Sidebar() {
    const [show, setShow] = useState(false)
    const navigate = useNavigate()

    function SidebarContent() {
        return (
            <ul className="nav flex-column">
                <li className="nav-item mb-2">
                    <NavLink to="/dashboard" className="nav-link text-white d-flex align-items-center justify-content-between" onClick={() => setShow(false)}>
                        <span className='d-flex align-items-center'><i className="bi bi-bar-chart me-2"></i>Dashboard</span>
                        <i className='bi bi-chevron-down'></i>
                    </NavLink>
                </li>
                <li className="nav-item mb-2">
                    <NavLink to="" className="nav-link text-white d-flex align-items-center justify-content-between" onClick={() => setShow(false)}>
                        <span>
                            <i className="bi bi-people me-2 align-items-center"></i> Users
                        </span>
                        <i className='bi bi-chevron-down'></i>

                    </NavLink>
                </li>
                <li className="nav-item mb-2">
                    <NavLink to="/alert-list" className="nav-link text-white d-flex align-items-center justify-content-between" onClick={() => setShow(false)}>
                        <span>
                            <i className="bi bi-exclamation-octagon me-2 align-items-center"></i> Alerts
                        </span>
                        <i className='bi bi-chevron-down'></i>

                    </NavLink>
                </li>
                <li className="nav-item mb-2">
                    <NavLink to="/guidance-list" className="nav-link text-white d-flex align-items-center justify-content-between" onClick={() => setShow(false)}>
                        <span>
                            <i className="bi bi-activity me-2 align-items-center"></i> First Aid Guidance
                        </span>
                        <i className='bi bi-chevron-down'></i>

                    </NavLink>
                </li>
                <li className="nav-item mb-2">
                    <NavLink to="" className="nav-link text-white d-flex align-items-center justify-content-between" onClick={() => setShow(false)}>
                        <span>
                            <i className="bi bi-person me-2 align-items-center"></i> Profile
                        </span>
                        <i className='bi bi-chevron-down'></i>

                    </NavLink>
                </li>
                <li className="nav-item mb-2">
                    <span
                        className="nav-link text-white d-flex align-items-center"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleLogout()}
                    >
                        <i className="bi bi-box-arrow-left me-2"></i> Logout
                    </span>
                </li>
            </ul >
        )
    }

    const handleLogout = () => {
        setShow(false);
        logout();
        navigate("/");
        alert("successfully logged out");
    }


    return (
        <>
            {/* Mobile - hamburger button */}
            <Button className="d-md-none m-2" onClick={() => setShow(true)}>
                <i className="bi bi-list"></i>
            </Button>

            {/* Mobile - offcanvas sidebar */}
            {/* TODO: Send this to NavBar hamburger Link*/}
            <Offcanvas show={show} onHide={() => setShow(false)} className="bg-dark text-white d-md-none">
                <Offcanvas.Header closeButton closeVariant="white">
                    <Offcanvas.Title>Guardian Drive</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <SidebarContent />
                </Offcanvas.Body>
            </Offcanvas>

            {/* Desktop - permanent sidebar, always visible */}
            <div className="bg-dark text-white p-3 d-none d-md-block" style={{
                minHeight: "100vh",
                position: "sticky",  // sticks while page scrolls
                top: 0,              // sticks to the top of the viewport
                height: "100vh",     // exactly viewport height
                overflowY: "auto"    // sidebar itself scrolls if links overflow
            }}>
                <h5 className="mb-4">Guardian Drive</h5>
                <img src={logo} className='img-fluid pb-3' style={{ maxHeight: '6rem' }} alt='Guardia Drive logo' />
                <SidebarContent />
            </div>
        </>
    )
}

export default Sidebar