import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { Approval } from "@models/approvals.model";

interface ApprovalsContextType {
  approvalsList: Approval[];
  dataApproval: Approval;
  fectApprovals: (approvals: Approval[]) => void;
  setDataApproval: (approval: Approval) => void;
   // addOrUpdateApprovalList: (approval: Approval) => void;
}

const ApprovalsListContext = createContext<ApprovalsContextType | null>(null);

// Hook personalizado para usar el contexto
export const useApprovalsList = () => {
  const context = useContext(ApprovalsListContext);

  if (!context) throw new Error("useApprovalsList debe usarse dentro de un ApprovalsListProvider");

  return context;
};

export const ApprovalsListProvider = ({ children }: { children: ReactNode }) => {
  const [approvalsList, setApprovalsList] = useState<Approval[]>([]);
  const [dataApproval, setDataApproval] = useState<Approval>({ idRequest: 0, date: "", state: "", typeRequest: "", reasons: "", comment: "", status: 3 });

  // Cargar datos de la API sin sobrescribir los registros agregados manualmente
  const fectApprovals = (approvals: Approval[]) => {
    setApprovalsList((prevList) => {
      const updatedList = [...prevList, ...approvals.filter(newItem => !prevList.some(item => item.idRequest === newItem.idRequest))];
      return updatedList;
    });
  };

  // // Agregar o actualizar un registro sin perder la lista actual
  // const addOrUpdateApprovalList = (approval: Approval) => {
  //   setApprovalsList((prevList) => {
  //     const exist = prevList.some((item) => item.id === approval.id);
  //     return exist ? prevList.map((item) => (item.id === approval.id ? { ...item, ...approval } : item)) : [...prevList, approval];
  //   });
  // };

  const value = useMemo(() => ({
    approvalsList,
    dataApproval,
    fectApprovals,
    // addOrUpdateApprovalList,
    setDataApproval
  }), [approvalsList, dataApproval]);

  return (
    <ApprovalsListContext.Provider value={value}>
      {children}
    </ApprovalsListContext.Provider>
  );
};