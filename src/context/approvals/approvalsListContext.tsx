import { createContext, ReactNode, useContext, useMemo, useState, useCallback } from "react";
import { Approval } from "@models/approvals.model";
import { getEmployees } from "@services/catalogService";
import { Employee } from "@models/employee.model";

interface ApprovalsContextType {
  approvalsList: Approval[];
  dataApproval: Approval;
  fectApprovals: (approvals: Approval[]) => void;
  setDataApproval: (approval: Approval) => void;
  triggerRefresh: () => void;
  shouldRefetch: boolean;
  
  getEmployeeList: ( subsidiary: number, cdc: number ) => Promise<Employee[]>;
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
  const [employeeList, setEmployeeList] = useState<Employee[]>();

  const fectApprovals = (approvals: Approval[]) => {
    setApprovalsList(approvals); // ahora se reemplaza toda la lista para reflejar cambios nuevos
  };

  const triggerRefresh = () => {
    setShouldRefetch(prev => !prev); // cambia valor para forzar refetch
  };

  const getEmployeeList = useCallback(
    async (subsidiary: number, cdc: number) => {
      if (employeeList) {
        return employeeList;
      }

      try {
        const data: Employee[] = await getEmployees(subsidiary, cdc);

        setEmployeeList(data);

        return data;
      } catch (error) {
        //setError(error instanceof Error ? error.message : String(error));

        throw error;
      }
    },
    [employeeList]
  );
  

  const value = useMemo(() => ({
    approvalsList,
    dataApproval,
    fectApprovals,
    setDataApproval,
    triggerRefresh,
    shouldRefetch,
    getEmployeeList
  }), [approvalsList, dataApproval, shouldRefetch, getEmployeeList]);

  return (
    <ApprovalsListContext.Provider value={value}>
      {children}
    </ApprovalsListContext.Provider>
  );
};