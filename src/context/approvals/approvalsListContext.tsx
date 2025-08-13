import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { Approval } from "@models/approvals.model";

interface ApprovalsContextType {
  approvalsList: Approval[];
  dataApproval: Approval;
  fectApprovals: (approvals: Approval[]) => void;
  setDataApproval: (approval: Approval) => void;
  triggerRefresh: () => void;
  shouldRefetch: boolean;
}

const ApprovalsListContext = createContext<ApprovalsContextType | null>(null);

export const useApprovalsList = () => {
 
  const context = useContext(ApprovalsListContext);
 
  if (!context) throw new Error("useApprovalsList debe usarse dentro de un ApprovalsListProvider");
 
  return context;
};

export const ApprovalsListProvider = ({ children }: { children: ReactNode }) => {

  const [approvalsList, setApprovalsList] = useState<Approval[]>([]);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [dataApproval, setDataApproval] = useState<Approval>({} as Approval);

  const fectApprovals = (approvals: Approval[]) => {
    setApprovalsList(approvals); // ahora se reemplaza toda la lista para reflejar cambios nuevos
  };

  const triggerRefresh = () => {
    setShouldRefetch(prev => !prev); // cambia valor para forzar refetch
  };

  const value = useMemo(() => ({
    approvalsList,
    dataApproval,
    fectApprovals,
    setDataApproval,
    triggerRefresh,
    shouldRefetch,
  }), [approvalsList, dataApproval, shouldRefetch]);

  return (
    <ApprovalsListContext.Provider value={value}>
      {children}
    </ApprovalsListContext.Provider>
  );
};