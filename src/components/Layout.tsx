import { NavLink, Outlet } from "react-router-dom";
import {
  IconButton,
  Container,
  Flex,
  HStack,
  Image,
  Box,
} from "@chakra-ui/react";
import { LuLogOut } from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import "../styles/Layout.css";
import { menuItems, ROLES, ROLES_APPROVALS } from "@models/const/menu.consts";
import { Tooltip } from "./ui/tooltip";
import image from "../assets/BeInnovation_3.png";
import { useEffect } from "react";
import { useNotificationSSE } from "@hooks/SSE/useNotificationSSE";

function Layout() {
  const { logOut, user } = useAuth();
  const { connectToNotification, count } = useNotificationSSE();

  useEffect(() => {
    if(user && ROLES_APPROVALS.includes(user.role as ROLES)){
      connectToNotification();
    }
  },[])

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
            <HStack className="links-container">
              <Image src={image} className="header-img" alt="logo Mera"/>
              <HStack>
                {menuItems
                  .filter(
                    (item) =>
                      user &&
                      user.role &&
                      item.roles.includes(user.role as ROLES)
                  )
                  .map((item) => (
                    <Box key={item.name} className="menu-link">
                      <NavLink
                        to={item.path}
                        className="menu-complete"
                        style={({ isActive }) => ({
                          color: isActive ? "#0e2f9b" : "#000000",
                        })}
                      >
                        {item.icon}
                        {item.name}
                        {item.name === 'Aprobación de solicitud' && (
                          <div className="notification">
                            {count}
                          </div>
                        )}
                      </NavLink>
                      <Tooltip content={`${item.name}`}>
                        <NavLink
                          to={item.path}
                          className="menu-icons"
                          style={({ isActive }) => ({
                            color: isActive ? "#66bb6a" : "#000000",
                          })}
                        >
                          {item.icon}
                        </NavLink>
                      </Tooltip>
                    </Box>
                  ))}
              </HStack>
            </HStack>
            <Tooltip content="Cerrar sesión">
              <IconButton
                onClick={() => {
                  logOut();
                }}
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
