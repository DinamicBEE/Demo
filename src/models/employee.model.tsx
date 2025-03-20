import { ClousingLinesModel, TotalModel } from "./common.clousing.model";

export interface EmployeeClousingProps {
  data: ClousingLinesModel | null;
  subsidiaryId: number;
  cdc: number;
}

export interface EmployeeContextType {
    employee: EmployeeModel | {};
    employeeLoading: boolean;
    error: string;
    getEmployeetData: ( clousingId: number ) => Promise<EmployeeModel>;
    getEmployeeList: ( subsidiary: number, cdc: number ) => Promise<Employee[]>;
    getReasonsList: ( subsidiary: number, cdc: number ) => Promise<ReasonsModel[]>;
    setNewEmployee: (newEmployee: EmployeeLine, clousingId: number) => void;
}

export interface EmployeeContext {
    [key: number]:  EmployeeModel
}

export interface EmployeeModel {
    id: number;
    employeeId: number;
    total: TotalModel;
    lines: EmployeeLine[]
}

export interface EmployeeLine {
    id: number | string;
    name: string;
    lastName: string;
    employeeCode: string;
    amount: number;
    reason: string;
    ticket?: string;
}

export interface ReasonsModel {
    id: number;
    reasonName: string;
    useCase: string;
}

export interface Employee {
    id: number;
    name: string;
    employeeNumber: string; 
}

export interface NewEmployeeModel {
    employeeId: number;
    reason: number;
    amount: number;
    ticket: string;
}

export interface EmployeeFilterProps {
    employees: Employee[]
    label: boolean;
    itemId?: number | string;
    employeeSelect?: string;
    onSelect: (empleado: Employee, itemId?: number | string ) => void;
    disabled: boolean;
}

export interface AddEmployeeProp {
    clousingId: number;
    subsidiaryId: number;
    cdc: number;
    isOpen:boolean; 
    onClose: () => void; 
}