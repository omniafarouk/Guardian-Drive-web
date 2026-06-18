import React from 'react'

import CustomNavbar from '../../components/navbar'

import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
export default function Layout() {
    return (
        <>
            {/* <h1>layout</h1> */}
            <Sidebar></Sidebar>
            <Outlet></Outlet>
        </>

    )
}
