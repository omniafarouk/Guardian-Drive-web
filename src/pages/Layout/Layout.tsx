import React from 'react'

import CustomNavbar from '../../components/navbar'

import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
export default function Layout() {
    return (
        <>
            {/* <h1>layout</h1> */}
            <div className="d-flex">
                <Sidebar />

                <div className="flex-grow-1 p-4" style={{ minWidth: 0 }}>
                    <Outlet />
                </div>
            </div>


        </>

    )
}
