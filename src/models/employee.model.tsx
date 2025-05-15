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
    getTicketsList: ( cdc: number ) => Promise<TicketModel[]>;
    setNewEmployee: (newEmployee: EmployeeLine, clousingId: number) => void;
    setEmployee :  React.Dispatch<React.SetStateAction<EmployeeContext>>,
    updateEmployee: (updatedEmployee: EmployeeLine, clousingId: number) => void;
    deleteEmployee: (employeeId: string|number, clousingId: number) => void;
}

export interface EmployeeContext {
    [key: number]:  EmployeeModel
}

export interface EmployeeModel {
    id: number | string;
    employeeId?: number;
    total: TotalModel;
    lines: EmployeeLine[]
}

export interface EmployeeLine {
    id: number | string;
    employeeName: string;
    employeeNumber: string;
    amount: number;
    reason: string;
    reasonId?: number;
    employeeId?: number;
    ticketNumber?: string;
    ticketId?: number;
    externalId?: number;
}

export interface ReasonsModel {
    id: number;
    reasonName: string;
    useCase: string;
}

export interface TicketModel {
    id: number;
    ticketNumber: string;
    date: string;
    paymentTypeResponse: TicketPaymentMethod[];
}

export interface TicketPaymentMethod {
  idPaymentMethod: number;
  paymentMethod: string;
  amount: number;
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
    employeeToEdit: {id: number | string | undefined, name: string | undefined} | null;
}

export interface CustomerFilter{
    customers: {
        value: number,
        label: string,
    }[],
    label: boolean;
    itemId?: number | string;
    customerSelect?: string;
    onSelect: (customer: any, itemId?: number | string ) => void;
    disabled: boolean;
}

export interface AddEmployeeProp {
    clousingId: number;
    subsidiaryId: number;
    cdc: number;
    data: EmployeeLine | null;
    isOpen:boolean; 
    onClose: () => void; 
}