import { TotalModel } from "./common.clousing.model";


export interface CashContextType {
    cashClousing: CashModel | {};
    cashLoading: boolean;
    error: string;
    getCashData: (clousingId: number, idCurrency: number) => Promise<CashModel>;//, employeeId: number
    setCashData: (cashLine:CashModel, clousingId: number) => void; // employeeId: number,
    cashRef: React.MutableRefObject<CashContext>
    cashClousingSelect: any,
    setCashClousingSelect: any
}

export interface CashContext {
    [key: number]: CashModel
}

export interface CashModel {
    id: number;
    employeeId: number;
    electronicTips: number;
    tips?: number;
    currencies: CashLines[];
    total?: TotalModel;

}

export interface Denomination {
    id: number | null;
    idDenomination: number;
    denomination:number;
    amount: number;
  }

export interface CashLines {
    id: number | string;
    idCurrency: number;
    currency: string;
    totalPOS: number;
    totalFisico: number;
    difference: number;
    exchangeRate: number;
    originalCurrency: number;
    denominations: any
}