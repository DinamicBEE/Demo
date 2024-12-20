//import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { IconButton } from "@chakra-ui/react"
import { LuClipboardCheck, LuClipboardList, LuContainer, LuStore } from "react-icons/lu";

//import { useAuth } from '../context/AutContext';
import '../styles/Layout.css'

function Layout() {

    return (
        <div className="layout">

            <div className='menuButton-container'>
                <IconButton variant="surface" size="sm">
                    <LuStore />
                </IconButton>

                <IconButton variant="surface" size="sm">
                    <LuContainer />
                </IconButton>

                <IconButton variant="surface" size="sm">
                    <LuClipboardCheck />
                </IconButton>

                <IconButton variant="surface" size="sm">
                    <LuClipboardList />
                </IconButton>

            </div>
            
            <div className="main-content">
                <Outlet />
            </div>

        </div>
    );

}

export default Layout;