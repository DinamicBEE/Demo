import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }){
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const login = ( user ) => {
        setIsAuthenticated(true);
        setUser(user);
    }

    const logOut = () => {
        setIsAuthenticated(false);
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logOut, user}}>
            {children}
        </AuthContext.Provider>
    );
}


// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}