import { NavLink, Outlet } from 'react-router-dom';
import { IconButton, Container, Flex, HStack, Image } from '@chakra-ui/react';
import { LuLogOut } from "react-icons/lu";
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import '../styles/Layout.css'
import { menuItems } from '@models/constants.model';
import { Tooltip } from './ui/tooltip';

function Layout() {
    const { logOut } = useAuth();
    const { user } = useUser();

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
              <HStack>
                <Image src="src\assets\meraLogo.png" h="48px" />
                {menuItems
                  .filter((item) => item.roles.includes(user.role))
                  .map((item) => (
                    <a key={item.name} className="menu-link">
                      {item.icon}
                      <NavLink to={item.path}>{item.name}</NavLink>
                    </a>
                  ))}
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