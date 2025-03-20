import { createContext, ReactNode, useCallback, useContext, useMemo, useRef, useState } from "react";
import { getEmployees, getReasonClousing } from "@services/catalogService";
import { Employee, EmployeeContext, EmployeeContextType, EmployeeLine, EmployeeModel, ReasonsModel } from "@models/employee.model";
import { getEmployeeClousing } from "@services/clousingService";
import { TotalModel } from "@models/common.clousing.model";

const employeeContext = createContext<EmployeeContextType>({} as EmployeeContextType);

export const useEmployeeContext = () => useContext(employeeContext);

export function EmployeeClousingProvider({children}: {children: ReactNode}) {
    const [employee, setEmployee] = useState<EmployeeContext>({});
    const [reasons, setReasons] = useState<ReasonsModel[]>();
    const [employeeList, setEmployeeList] = useState<Employee[]>()
    const [employeeLoading, setEmployeeLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const getEmployeetData = useCallback( async(clousingId:number)=>{
        setEmployeeLoading(true);

        if(employee[clousingId]){
            setEmployeeLoading(false);
            return employee[clousingId];
        }

        try {

            const data: EmployeeModel  = await getEmployeeClousing(clousingId);

            const updateEmployee: EmployeeContext = {
                ...employee,
                [clousingId]:data
            } 

            setEmployee(updateEmployee);

            return data;
            
        } catch (error) {

            setError(error instanceof Error ? error.message : String(error));
            
            throw error;
            
        } finally {

            setEmployeeLoading(false);

        }

    },[employee]);

    const getEmployeeList = useCallback( async(subsidiary: number, cdc: number)=>{
        
        if(employeeList){
            return employeeList
        }

        try {

            const data: Employee[] = await getEmployees(subsidiary, cdc);
            
            setEmployeeList(data);

            return data;

        } catch (error) {

            setError(error instanceof Error ? error.message : String(error));
            
            throw error;
            
        } 

    },[employeeList]);

    const getReasonsList = useCallback( async(subsidiary: number, cdc: number)=>{

        if(reasons){
            return reasons
        }

        try {

            const data: ReasonsModel[] = await getReasonClousing(subsidiary, cdc);

            setReasons(data);

            return data;

        } catch (error) {

            setError(error instanceof Error ? error.message : String(error));
            
            throw error;
            
        } 

    },[reasons]);

    const setNewEmployee = useCallback( (newEmployee: EmployeeLine, clousingId:number) => {
        
        const currentRegister = employee[clousingId];

        const updateLines = [...currentRegister.lines, newEmployee];

        const newTotalPhysical = updateLines?.reduce(
          (acc: number, curr: EmployeeLine) => acc + curr.amount,
          0
        );

        const newDifference =
          (currentRegister.total?.totalPOS || 0) - (newTotalPhysical || 0);

        const newTotal: TotalModel = {
          totalPOS: currentRegister.total?.totalPOS || 0,
          totalPhysical: newTotalPhysical || 0,
          difference: newDifference,
        };

        const updateData: EmployeeContext = {
            ...employee,
            [clousingId]: {
                ... currentRegister,
                lines: updateLines,
                total: newTotal
            }
        }

        setEmployee(updateData);

    },[employee])

    const value = useMemo(
        ()=>({
            employee,
            employeeLoading,
            error,
            getEmployeetData,
            getEmployeeList,
            getReasonsList,
            setNewEmployee
        }),
        [employee, employeeLoading, error, getEmployeetData, 
            getEmployeeList, getReasonsList, setNewEmployee]
    );

    return (
        <employeeContext.Provider value={value}>
            {children}
        </employeeContext.Provider>
    );

}