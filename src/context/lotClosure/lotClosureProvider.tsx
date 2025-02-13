import React, { ReactNode } from "react";
import { LotClosureProvider } from "./lotClosureListContext";

interface LotClosureProviderProps {
  children: ReactNode
}

export const ClosureProvider: React.FC<LotClosureProviderProps> = ({ children }) => {
  return (
    <>
      <LotClosureProvider>
        {children}
      </LotClosureProvider>
    </>
  )
}
