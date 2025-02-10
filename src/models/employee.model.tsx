import { TotalModel } from "./common.clousing.model";

export interface EmployeeContextType {
    employee: EmployeeModel | {};
    employeeLoading: boolean;
    error: string;
    getEmployeetData: (clousingId: number, employeeId: number) => Promise<EmployeeModel>;
    getEmployeeList: () => Promise<Employee[]>;
    getReasonsList: () => Promise<ReasonsModel[]>;
    setNewEmployee: (newEmployee: EmployeeLine, clousingId: number, employeeId:number) => void;
}

export interface EmployeeContext {
    [key: number]: {
        [key: number]: EmployeeModel
    }
}

export interface EmployeeModel {
    id: number;
    employeeId: number;
    total: TotalModel;
    lines: EmployeeLine[]
}

export interface EmployeeLine {
    id: number;
    name: string;
    lastName: string;
    employeeCode: string;
    amount: number;
    reason: string;
    ticket?: string;
}

export interface ReasonsModel {
    id: number;
    reason: string;
    type: string;
}

export interface Employee {
    id: number;
    name: string;
    lastName: string;
    employeeCode: string; 
}

export interface NewEmployeeModel {
    employeeId: number;
    reason: number;
    amount: number;
    ticket: string;
}

export interface EmployeeFilterProps {
    employees: Employee[]
    onSelect: (empleado: Employee ) => void;
}

export interface AddEmployeeProp {
    clousingId: number;
    employeId: number;
    isOpen:boolean; 
    onClose: () => void; 
}