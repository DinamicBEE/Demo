import React, { ReactNode } from "react";
import { LotClosureProvider } from "./lotClosureListContext";
import { LotCatalogProvider } from "./catalogsProviders";

interface LotClosureProviderProps {
  children: ReactNode;
}

export const ClosureProvider: React.FC<LotClosureProviderProps> = ({
  children,
}) => {
  return (
    <>
      <LotCatalogProvider>
        <LotClosureProvider>{children}</LotClosureProvider>
      </LotCatalogProvider>
    </>
  );
};
