import React, { ReactNode } from "react";
import { ApprovalsListProvider } from "./approvalsListContext";
import { ApprovalsRolUserProvider } from "./approvalsRolUserContext";

interface ApprovalsProviderProps {
  children: ReactNode
}

export const ApprovalsProvider: React.FC<ApprovalsProviderProps> = ({ children }) => {
  return (
    <>
      <ApprovalsRolUserProvider>
        <ApprovalsListProvider>
          {children}
        </ApprovalsListProvider>
      </ApprovalsRolUserProvider>

    </>
  )
}