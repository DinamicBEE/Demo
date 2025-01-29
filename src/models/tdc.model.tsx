import { TotalModel } from "./common.clousing.model";

export interface TDCContextType {
    tdc: TDCModel | {};
    tdcDetails: BankDetails | {};
    tdcLoading: boolean;
    detailsLoading: boolean;
    error: string
    detailsError: string
    getTDCData: (clousingId: number, employeeId: number) => Promise<TDCModel>;
    getDetails: (clousingId: number, lineId: number | null) => Promise<BankDetails>;
    setDetails: (details: any, clousingId: number, lineId: number) => void;
}

export interface TDCContext {
    [key: number]: {
        [key: number]: any
    }
}

export interface TDCDetailsContext {
    [key: number]: {
        [key: number]: BankDetails
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

export interface BankDetails {
    id: number;
    bankName: string;
    total: number;
    details: BankLineDetails[]
}

export interface DetailsProp {
    clousingId: number, 
    lineId: number | null, 
    isOpen:boolean, 
    onClose: () => void 
}