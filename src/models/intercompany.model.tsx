import { TotalModel } from "./common.clousing.model";
import { SubsidiaryModal } from "./common.model";
import { Employee } from "./employee.model";

export interface IntercompanyContextType {
    intercompany: IntercompanyModel | {};
    error: string;
    getIntercompanyData: (clousingId: number) => Promise<IntercompanyModel>;
    setIntercompanyData: (intercompanyData: IntercompanyModel, clousingId:number) => void;
    getEmployeesList: () => Promise<Employee[]>;
    getSubsidiaries: (idEmployee: string) => Promise<SubsidiaryModal[]>;
}

export interface IntercompanyContext {
    [key: number]: IntercompanyModel
}

export interface IntercompanyModel{
    id: number;
    employeeId: number;
    total: TotalModel;
    lines: IntercompanyLine[]
}

export interface IntercompanyLine {
    id: number;
    employeeId: number;
    employeeName: string;
    subsidiaryId: number;
    subsidiaryname: string;
    amount: number;
    ticket: string;
    physicalAmount: number;
    notes?: string;
}