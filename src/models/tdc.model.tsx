import { TotalModel } from "./common.clousing.model";

export interface TDCContextType {

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
    currencies: BankLineModel[];
}

export interface BankLineDetails {
    id: number;
    date: string;
    check: string;
    amount: number;
}