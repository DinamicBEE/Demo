import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  return (
      <AuthProvider>
        {children}
      </AuthProvider>
  );
};
