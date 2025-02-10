import { TotalModel } from "./common.clousing.model";

export interface IntercompanyContextType {
    intercompany: IntercompanyModel | {};
    error: string;
    getIntercompanyData: (clousingId: number, employeeId: number) => Promise<IntercompanyModel>;
    setIntercompanyData: (intercompanyData: IntercompanyModel, clousingId:number, employeeId:number) => void;
}

export interface IntercompanyContext {
    [key: number]: {
        [key: number]: IntercompanyModel
    }
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