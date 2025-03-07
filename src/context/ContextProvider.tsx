import { ReactNode } from "react";
import { AuthProvider } from "./AuthContext";
import { ErrorDialogProvider } from "./ErrorContext";

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  return (
      <AuthProvider>
        <ErrorDialogProvider>{children}</ErrorDialogProvider>
      </AuthProvider>
  );
};
