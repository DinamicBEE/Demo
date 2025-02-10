import { TotalModel } from "./common.clousing.model";

export interface specialCustContextType {
    specialCust: SpecialCustomerModel | {};
    specialCustLoading: boolean;
    error: string;
    getSpecialCustData: (clousingId: number, employeeId: number) => Promise<SpecialCustomerModel>;
    setSpecialCustData: (specialCustLine:any, employeeId: number, clousingId: number) => void;
}

export interface SpecialCustomerContext {
    [key: number]: {
        [key: number]: any
    }
}

export interface SpecialCustomerLines {
    id: number; 
    Check: number; 
    consumption: number; 
    priceCuopon: number; 
    difference: number; 
    exchangeRate: number; 
    client: string;
    PAX: number; 
    folioCuopon: string; 
    folioCuoponUSD: string;
    value: number;
    valueUSD: number;
    flight: string;
    passengerName: string;
    amountMXN: number;
}

export interface SpecialCustomerModel {
  id: number;
  employeeId: number;
  total: TotalModel;
  lines: SpecialCustomerLines[];
}