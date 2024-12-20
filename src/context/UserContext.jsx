import { createContext, useState, useContext } from "react";
import { getUserInfo } from "../services/userService";
import { useAuth } from "./AuthContext";

const UserContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const { token } = useAuth();
    const [ user, setUser ] = useState(null);

    const fetcUser = async ( currentToken ) => {
        try {
            
            const userInfo = await getUserInfo(currentToken || token);
            
            setUser({
                ...userInfo.data,
                role: 1
            });
            
            return userInfo.data;
            
        } catch (error) {
            
            console.error("Error al obtener información del usuario:", error);
            setUser(null);
            throw error;

        }
    };

    return (
        <UserContext.Provider value={{ user, fetcUser }}>
            {children}
        </UserContext.Provider>
    );
}