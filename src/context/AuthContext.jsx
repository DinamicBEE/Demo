import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const login = ( token ) => {
        setIsAuthenticated(true);
        Cookies.set("token", token, { secure: true, sameSite: "Strict", expires: 1 });
        setToken(token);
    }

    const logOut = () => {
        setIsAuthenticated(false);
        Cookies.remove("token");
        setToken(null);
    }

    useEffect(() => {
        //Cookies.remove("token");
        const savedToken = Cookies.get("token");
        
        if (savedToken && typeof savedToken === "string") {
          setToken(savedToken);
          setIsAuthenticated(true);
        }
        setIsLoading(false);
      }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logOut, token, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}
