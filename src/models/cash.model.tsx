import { TotalModel } from "./common.clousing.model";


export interface CashContextType {
    cashClousing: CashModel | {};
    cashLoading: boolean;
    error: string;
    getCashData: (clousingId: number) => Promise<CashModel>;//, employeeId: number
    setCashData: (cashLine:CashModel, clousingId: number) => void; // employeeId: number,
}

export interface CashContext {
    [key: number]: CashModel
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