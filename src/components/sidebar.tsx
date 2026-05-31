import { useState } from 'react'
import { Offcanvas, Button } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import logo from '../assets/logo.png';

function Sidebar() {
    const [show, setShow] = useState(false)

    function SidebarContent() {
        return (
            <ul className="nav flex-column">
                <li className="nav-item mb-2">
                    <NavLink to="/dashboard" className="nav-link text-white d-flex align-items-center justify-content-between" onClick={() => setShow(false)}>
                        <span className='d-flex align-items-center'><i className="bi bi-speedometer2 me-2"></i>Dashboard</span>
                        <i className='bi bi-chevron-down'></i>
                    </NavLink>
                </li>
                <li className="nav-item mb-2">
                    <NavLink to="/drivers" className="nav-link text-white d-flex align-items-center justify-content-between" onClick={() => setShow(false)}>
                        <span>
                            <i className="bi bi-people me-2 align-items-center"></i> Drivers
                        </span>
                        <i className='bi bi-chevron-down'></i>

                    </NavLink>
                </li>

            </ul >
        )
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
            <div className="bg-dark text-white p-3 d-none d-md-block" style={{ minHeight: "100vh" }}>
                <h5 className="mb-4">Guardian Drive</h5>
                <img src={logo} className='img-fluid pb-3' style={{ maxHeight: '6rem' }} alt='Guardia Drive logo' />
                <SidebarContent />
            </div>
        </>
    )
}

export default Sidebar