import React, { ReactNode } from "react";
import { ApprovalsListProvider } from "./approvalsListContext";

interface ApprovalsProviderProps {
  children: ReactNode
}

export const ApprovalsProvider: React.FC<ApprovalsProviderProps> = ({ children }) => {
  return (
    <>
      <ApprovalsListProvider>
        {children}
      </ApprovalsListProvider>
    </>
  )
}