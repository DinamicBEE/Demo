import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";

export const ContextProvider = ({ children}) => {
    
    return (
        <AuthProvider>
            <UserProvider> 
                { children } 
            </UserProvider>
        </AuthProvider>
    );

};