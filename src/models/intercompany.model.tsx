import { TotalModel } from "./common.clousing.model";

export interface intercompanyContextType {
    intercompany: intercompanyModel | {};
    intercompanyLoading: boolean;
    error: string;
    getIntercompanytData: (clousingId: number, employeeId: number) => Promise<intercompanyModel>;
    //setSpecialCustData: (specialCustLine:any, employeeId: number, clousingId: number) => void;
}

export interface intercompanyContext {
    [key: number]: {
        [key: number]: intercompanyModel
    }
}

export interface intercompanyModel{
    id: number;
    employeeId: number;
    total: TotalModel;
    lines: intercompanyLine[]
}

export interface intercompanyLine {
    id: number;
    employeeName: string;
    subsidiaryname: string;
    amount: number;
    ticket: string;
    physicalAmount: number;
    notes?: string;
}