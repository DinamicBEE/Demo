import { createContext, ReactNode, useContext, useMemo, useState, useCallback, useRef } from "react";
import { Approval, filterOptionsProps, RequestUpdateDetails } from "@models/approvals.model";
import { getEmployees, getLocations, getZones } from "@services/catalogService";
import { Employee } from "@models/employee.model";
import { selectOption } from "@models/common.model";
import { getCompanies } from "@services/lotClosureService";
import { getRequestList, getStatus } from "@services/approvalsServices";
import { useNotificationSSE } from "@hooks/SSE/useNotificationSSE";

interface ApprovalsContextType {
  triggerRefresh: () => void;
  fectApprovals: (filterSelected: filterOptionsProps, isRefresh: boolean) => void;
  approvalsList: Approval[];
  setDataApproval: (approval: Approval) => void;
  dataApproval: Approval;
  getEmployeeList: ( subsidiary: number, cdc: number ) => Promise<Employee[]>;
  getSubsidiaries: () => Promise<selectOption[]>;
  getZoneList: (subIds: number[]) => Promise<selectOption[]>;
  getCDCs: (zonesIds: number[]) => Promise<selectOption[]>;
  getStatusList: () => Promise<selectOption[]>;
  newElementApprovalsList: (updatedApproval: Approval) => void;
  updateApprovalList: (update: RequestUpdateDetails) => Promise<boolean>;
}

const ApprovalsListContext = createContext<ApprovalsContextType | null>(null);

export const useApprovalContext = () => {
 
  const context = useContext(ApprovalsListContext);
 
  if (!context) throw new Error("useApprovalsList debe usarse dentro de un ApprovalsListProvider");
 
  return context;
};

export const ApprovalsListProvider = ({ children }: { children: ReactNode }) => {

  const [approvalsList, setApprovalsList] = useState<Approval[]>([]);
  const [approvalsFilter, setApprovalsFilter] = useState<Approval[]>([]);
  const [filterOptions, setFilterOptions] = useState<filterOptionsProps>({} as filterOptionsProps)
  const [dataApproval, setDataApproval] = useState<Approval>({} as Approval);
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [subsidiaries, setSubsidiaries] = useState<selectOption[]>([]);
  const [zones, setZones] = useState<selectOption[]>([]);
  const [cdc, setCDC] = useState<selectOption[]>([]);
  const [status, setStatus] = useState<selectOption[]>([]);
  const approvalRef = useRef<Approval>({} as Approval)

  const triggerRefresh = () => {
    fectApprovals(filterOptions, true);
  };

  const fectApprovals = useCallback( async (filterSelected: filterOptionsProps, isRefresh: boolean) => {

    setFilterOptions(filterSelected);
    if (approvalsFilter.length > 0 ) {//&& !isRefresh
      const response = await filterApprovals(filterSelected, approvalsFilter);
      setApprovalsList(response);
      return response;
    }

    // if (approvalsList.length > 0 && isRefresh && approvalRef.current.idRequest) {
    //   return approvalsList;
    // }

    try {

      const approvals = await getRequestList(filterSelected);
      setApprovalsFilter(approvals);
      
      const response = await filterApprovals(filterSelected, approvals);
      
      setApprovalsList(response); 
      
      return response;

    } catch (error) {
      throw error;
    }

  }, [approvalsList]);

  const filterApprovals = useCallback((filterSelected: filterOptionsProps, approvals: Approval[]) => {

    let filteredList = approvals;
    console.log("filterOptions", filterSelected)
    if (filterSelected.cdc && filterSelected.cdc.length > 0) {
      filteredList = filteredList.filter((item: Approval) => 
        filterSelected.cdc.some(cdcValue => cdcValue.toString() === item.cdc)
      );
    }
    console.log("1", filteredList)
    if (filterSelected.employeeId !== null && filterSelected.employeeId !== undefined) {
      filteredList = filteredList.filter((item: Approval) => 
        item.employee === filterSelected.employeeId
      );
    }
console.log("2", filteredList)
    if (filterSelected.requestDateStart !== null && filterSelected.requestDateStart !== undefined) {
      filteredList = filteredList.filter((item: Approval) => {
        const itemDate = new Date(item.date);
        return itemDate >= filterSelected.requestDateStart!;
      });
    }
console.log("3", filteredList)
    if (filterSelected.requestDateEnd !== null && filterSelected.requestDateEnd !== undefined) {
      filteredList = filteredList.filter((item: Approval) => {
        const itemDate = new Date(item.date);
        return itemDate <= filterSelected.requestDateEnd!;
      });
    }
console.log("4", filteredList)
    if (filterSelected.closingDateStart !== null && filterSelected.closingDateStart !== undefined) {
      filteredList = filteredList.filter((item: Approval) => {
        const itemClosingDate = new Date(item.dateCdc);
        return itemClosingDate >= filterSelected.closingDateStart!;
      });
    }

    if (filterSelected.closingDateEnd !== null && filterSelected.closingDateEnd !== undefined) {
      filteredList = filteredList.filter((item: Approval) => {
        const itemClosingDate = new Date(item.dateCdc);
        return itemClosingDate <= filterSelected.closingDateEnd!;
      });
    }

    if (filterSelected.status && filterSelected.status.length > 0) {
      filteredList = filteredList.filter((item: Approval) => 
        filterSelected.status!.some(statusValue => statusValue === item.status)
      );
    }

    const sortedList = filteredList.sort((a: Approval, b: Approval) => b.idRequest - a.idRequest);
console.log("0", sortedList)
    return sortedList;
    
  }, []);

  const getEmployeeList = useCallback( async (subsidiary: number, cdc: number) => {
      if (employeeList.length > 0) {
        return employeeList;
      }

      try {
        const data: Employee[] = await getEmployees(subsidiary, cdc);

        setEmployeeList(data);

        return data;
      } catch (error) {

        throw error;
      }
    },
    [employeeList]
  );
  
  const getSubsidiaries = useCallback( async () => {
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

  const getZoneList = useCallback( async (subIds: number[]) => {
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

  const getCDCs = useCallback( async (zonesIds: number[]) => {
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

  const getStatusList = useCallback(
    async () => {
      if (status.length > 0) {
        return status;
      }

      try {
        const response = await getStatus();

        const data = response.map((status: { id: any; name: any; }) =>{
          return {
            value: status.id,
            label: status.name,
          }
        })

        setStatus(data);

        return data;
      } catch (error) {
        //setError(error instanceof Error ? error.message : String(error));

        throw error;
      }

    }, [status]
  )

  const newElementApprovalsList = useCallback ((updatedApproval: Approval) => {
    // console.log(count)
    // setCount(5);
    //approvalsList.unshift(updatedApproval);
    approvalRef.current = updatedApproval;
    setApprovalsFilter((prevApprovalsFilter: Approval[]) => {
      const updatedFilterList: Approval[] = [updatedApproval, ...prevApprovalsFilter];
      return updatedFilterList;
    });
    setApprovalsList((prevApprovalsList: Approval[]) => {
      const updatedList: Approval[] = [updatedApproval, ...prevApprovalsList];
      return updatedList;
    });
    //console.log(count)
  }, [approvalsList]);

  const updateApprovalList = useCallback(async (update: RequestUpdateDetails): Promise<boolean> => {
    setApprovalsList((prevApprovalsList: Approval[]) => {
      const updatedList: Approval[] = prevApprovalsList.map((approval): Approval => {
        if (approval.idRequest === update.idRequest) {
          return {
            ...approval,
            status: update.status === true ? 2 : 1,
            closingDate: new Date().toISOString(),
          } as Approval;
        }
        return approval;
      });
      return updatedList;
    });
    return true;
  },[]);

  const value = useMemo(() => ({
    approvalsList,
    dataApproval,
    fectApprovals,
    setDataApproval,
    triggerRefresh,
    getEmployeeList,
    getSubsidiaries,
    getZoneList,
    getCDCs,
    getStatusList,
    newElementApprovalsList,
    updateApprovalList
  }), [approvalsList, setDataApproval, dataApproval, getEmployeeList, getSubsidiaries, getZoneList, getCDCs, getStatusList, newElementApprovalsList, updateApprovalList]);

  return (
    <ApprovalsListContext.Provider value={value}>
      {children}
    </ApprovalsListContext.Provider>
  );
};