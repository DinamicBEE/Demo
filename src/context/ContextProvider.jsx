import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";
import { HomeProvider } from "./home/homeProvider"

export const ContextProvider = ({ children}) => {
    
    return (
        <AuthProvider>
            <UserProvider> 
                <HomeProvider>
                    { children } 
                </HomeProvider>
            </UserProvider>
        </AuthProvider>
    );

};