import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { UserProvider } from "./UserContext";
import { ErrorDialogProvider } from "./ErrorContext";

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <AuthProvider>
        <ErrorDialogProvider>{children}</ErrorDialogProvider>
      </AuthProvider>
    </UserProvider>
  );
};
