import { NavLink, Outlet } from 'react-router-dom';
import { IconButton, Container, Flex, HStack, Image, Box } from '@chakra-ui/react';
import { LuLogOut } from "react-icons/lu";
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import '../styles/Layout.css'
import { menuItems } from '@models/constants.model';
import { Tooltip } from './ui/tooltip';

function Layout() {

    const { logOut,user } = useAuth();
    
    return (
      <div className="layout">
        <Flex direction="column" overflowY="auto" overflowX="auto">
          <header className="mera-header">
            <Container
              width="100vw"
              bgColor="mera.light"
              display="flex"
              justifyContent="space-between"
              alignContent="center"
            >
              <HStack className='links-container'>
                <Image src="src\assets\meraLogo.png" className='header-img' />
                <HStack >
                {menuItems
                  .filter((item) => item.roles.includes(user.role))
                  .map((item) => (
                    <Box key={item.name} className="menu-link">
                      
                      <NavLink to={item.path} className="menu-complete">{item.icon}{item.name}</NavLink>
                      <Tooltip content={`${item.name}`}>
                        <NavLink to={item.path} className="menu-icons">{item.icon}</NavLink>
                      </Tooltip>
                    </Box>
                  ))}

                </HStack>
                {/* <HStack className='menu-icons'>
                {menuItems
                  .filter((item) => item.roles.includes(user.role))
                  .map((item) => (
                    <Box key={item.name} className="menu-link">
                      <NavLink to={item.path}>{item.icon}</NavLink>
                    </Box>
                  ))}

                </HStack> */}
              </HStack>
              <Tooltip content="Cerrar sesión">
                <IconButton
                  onClick={() => {logOut();}}
                  rounded="full"
                  variant="outline"
                  colorPalette="meraError"
                  marginTop="5px"
                  marginBottom="5px"
                >
                  <LuLogOut />
                </IconButton>
              </Tooltip>
            </Container>
          </header>

          <div className="main-content">
            <Outlet />
          </div>
        </Flex>
      </div>
    );

}

export default Layout;