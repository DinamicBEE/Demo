import { ReactNode } from "react";
import { createContext, useState, useContext, useEffect } from "react";
import { getUserInfo } from "../services/userService";
import { useAuth } from "./AuthContext";
import { UserContextType } from "@models/common.model";

const UserContext = createContext<UserContextType>({} as UserContextType);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { token } = useAuth();
    const [ user, setUser ] = useState(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetcUser = async ( currentToken:string ) => {
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

    useEffect(() => {
        
        const initializeUser = async () => {
            if (token) {
                try {
                    await fetcUser(token);
                } catch {
                    setUser(null);
                } finally{
                    setLoading(false);
                }
            }
            
        };
        initializeUser();
    }, [token]);

    return (
        <UserContext.Provider value={{ user, fetcUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}