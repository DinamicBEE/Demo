import { TotalModel } from "./common.clousing.model";


export interface CashContextType {
    cashClousing: CashModel | {};
    cashLoading: boolean;
    error: string;
    getCashData: (clousingId: number, employeeId: number) => Promise<CashModel>;
    setCashData: (cashLine:any, employeeId: number, clousingId: number) => void;
}

export interface CashContext {
    [key: number]: {
        [key: number]: any
    }
}

export interface CashModel {
    id: number;
    employeId: number;
    electronicTips: number;
    tips?: number;
    currencies: CashLines[];
    total?: TotalModel;

}

export interface CashLines {
    id: number;
    currency: string;
    totalPOS: number;
    totalFisico: number;
    difference: number;
    exchangeRate: number;
    originalCurrency: number;
}