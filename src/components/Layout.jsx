import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import {
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerRoot,
    DrawerTitle,
    DrawerTrigger,
  } from "./ui/drawer"
import { IconButton } from "@chakra-ui/react"
import { LuAlignJustify, LuClipboardCheck, LuClipboardList, 
    LuContainer, LuFileSpreadsheet, LuHouse, LuLogOut } from "react-icons/lu";

import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import '../styles/Layout.css'

function Layout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { logOut } = useAuth();
    const { user } = useUser();

    const menuItems = [
        { name: 'Inicio', path: '/home', icon:<LuHouse />, roles: [1, 2] },
        { name: 'Cierre de lotes', path: '/lotClosure', icon:<LuContainer />, roles: [1, 2] },
        { name: 'Solicitudes de ajuste', path: '/request', icon:<LuClipboardCheck />, roles: [2] },
        { name: 'Aprobación de solicitudes', path: '/approvals', icon:<LuClipboardList />, roles: [1] },
        { name: 'Generación de reportes', path: '/reportviewer', icon:<LuFileSpreadsheet />, roles: [1, 2] },
      ];

    return (
        <div className="layout">
            <div>

                <DrawerRoot placement="start" open={isMenuOpen} onOpenChange={(e) => setIsMenuOpen(e.open)}>
                    <DrawerBackdrop />
                    <DrawerTrigger asChild>
                        <IconButton variant="surface" size="sm">
                            <LuAlignJustify />
                        </IconButton>
                    </DrawerTrigger>
                    <DrawerContent className="menuContainer">
                        <DrawerHeader>
                            <DrawerTitle>
                                ¡Bienvenido!
                            </DrawerTitle>
                        </DrawerHeader>
                        <DrawerBody className='body'>
                            
                            <ul>
                                {menuItems
                                    .filter(item => item.roles.includes(user.role))
                                    .map(item =>(
                                        <li key={item.name} className="menu-link">
                                            {item.icon}
                                            <NavLink to={item.path}>
                                                {item.name}
                                            </NavLink>
                                        </li>
                                    ))
                                }

                            </ul>

                        </DrawerBody>
                        <DrawerFooter>
                            <IconButton onClick={()=>{logOut()}} className="logout-button">
                                <LuLogOut />
                                Cerrar Sesión
                            </IconButton>
                        </DrawerFooter>
                        <DrawerCloseTrigger />
                    </DrawerContent>
                </DrawerRoot>

                <div className='menuButton-container'>
                    {menuItems
                        .filter(element => element.roles.includes(user.role))
                        .map(item => (
                            <IconButton onClick={()=>{navigate(item.path)}} 
                                key={item.name} variant="surface" size="sm"
                                className='menuButton'
                            >
                                {item.icon}
                            </IconButton>
                        ))
                    }

                </div>

            </div>
            
            <div className="main-content">
                <Outlet />
            </div>

        </div>
    );

}

export default Layout;