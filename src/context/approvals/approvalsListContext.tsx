import { createContext, ReactNode, useContext, useMemo, useState, useCallback } from "react";
import { Approval } from "@models/approvals.model";
import { getEmployees, getLocations, getZones } from "@services/catalogService";
import { Employee } from "@models/employee.model";
import { selectOption } from "@models/common.model";
import { getCompanies } from "@services/lotClosureService";

interface ApprovalsContextType {
  approvalsList: Approval[];
  dataApproval: Approval;
  fectApprovals: (approvals: Approval[]) => void;
  setDataApproval: (approval: Approval) => void;
  triggerRefresh: () => void;
  shouldRefetch: boolean;
  
  getEmployeeList: ( subsidiary: number, cdc: number ) => Promise<Employee[]>;
  getSubsidiaries: () => Promise<selectOption[]>;
  getZoneList: (subIds: number[]) => Promise<selectOption[]>;
  getCDCs: (zonesIds: number[]) => Promise<selectOption[]>;
  //getRequestsList: () => Promise<Approval[]>;
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
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [subsidiaries, setSubsidiaries] = useState<selectOption[]>([]);
  const [zones, setZones] = useState<selectOption[]>([]);
  const [cdc, setCDC] = useState<selectOption[]>([]);

  const fectApprovals = (approvals: Approval[]) => {
    setApprovalsList(approvals); // ahora se reemplaza toda la lista para reflejar cambios nuevos
  };

  const triggerRefresh = () => {
    setShouldRefetch(prev => !prev); // cambia valor para forzar refetch
  };

  const getEmployeeList = useCallback(
    async (subsidiary: number, cdc: number) => {
      if (employeeList.length > 0) {
        console.log("fetching")
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
  
  const getSubsidiaries = useCallback(
    async () => {
      if (subsidiaries.length > 0) {
        return subsidiaries;
      }

      try {
        const response = await getCompanies();

        const data = response.map((company: { id: any; name: any; }) =>{
          return {
            value: company.id,
            label: company.name,
          }
        })

        setSubsidiaries(data);

        return data;
      } catch (error) {
        //setError(error instanceof Error ? error.message : String(error));

        throw error;
      }

    }, [subsidiaries]
  )

  const getZoneList = useCallback(
    async (subIds: number[]) => {
      if (subIds.length === 0) {
        return [];
      }

      try {
        const response = await getZones(subIds);

        const data = response.map((zone: { id: any; name: any; }) =>{
          return {
            value: zone.id,
            label: zone.name,
          }
        })

        setZones(data);

        return data;
      } catch (error) {
        //setError(error instanceof Error ? error.message : String(error));

        throw error;
      }

    }, [zones]
  )

  const getCDCs = useCallback(
    async (zonesIds: number[]) => {
      if (zonesIds.length === 0) {
        return [];
      }

      try {
        const response = await getLocations(zonesIds);

        const data = response.map((cdc: { id: any; name: any; }) =>{
          return {
            value: cdc.id,
            label: cdc.name,
          }
        })

        setCDC(data);

        return data;
      } catch (error) {
        //setError(error instanceof Error ? error.message : String(error));

        throw error;
      }

    }, [cdc]
  )

  const value = useMemo(() => ({
    approvalsList,
    dataApproval,
    fectApprovals,
    setDataApproval,
    triggerRefresh,
    shouldRefetch,
    getEmployeeList,
    getSubsidiaries,
    getZoneList,
    getCDCs
  }), [approvalsList, dataApproval, shouldRefetch, getEmployeeList, getSubsidiaries, getZoneList, getCDCs]);

  return (
    <ApprovalsListContext.Provider value={value}>
      {children}
    </ApprovalsListContext.Provider>
  );
};