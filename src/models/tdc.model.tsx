import { TotalModel } from "./common.clousing.model";

export interface TDCContextType {
    tdc: TDCModel | {};
    tdcLoading: boolean;
    error: string
    getTDCData: (clousingId: number, employeeId: number) => Promise<TDCModel>;
}

export interface TDCContext {
    [key: number]: {
        [key: number]: any
    }
}

export interface BankLineModel {
    id: number;
    bank: string;
    POS: number;
    physical: number;
    voucherAmount: number;
}

export interface TDCModel {
    id: number;
    employeId: number;
    total: TotalModel
    lines: BankLineModel[];
}

export interface BankLineDetails {
    id: number;
    date: string;
    check: string;
    amount: number;
}

export interface DetailsProp {
    clousingId: number, 
    lineId: number | null, 
    isOpen:boolean, 
    onClose: () => void 
}