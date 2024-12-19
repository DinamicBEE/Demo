import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);

    const login = ( user ) => {
        setIsAuthenticated(true);
        setToken(user);
    }

    const logOut = () => {
        setIsAuthenticated(false);
        setToken(null);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logOut, token}}>
            {children}
        </AuthContext.Provider>
    );
}
