import { ReactNode } from 'react';
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";

export const ContextProvider = ({ children }: { children: ReactNode }) => {
    
    return (
        <AuthProvider>
            <UserProvider> 
                { children } 
            </UserProvider>
        </AuthProvider>
    );

};