import { TotalModel } from "./common.clousing.model";

export interface specialCustContextType {
    specialCust: SpecialCustomerModel | {};
    specialCustLoading: boolean;
    error: string;
    getSpecialCustData: (clousingId: number) => Promise<SpecialCustomerModel>;
    setSpecialCustData: (specialCustLine:SpecialCustomerModel, clousingId: number) => void;
}

export interface SpecialCustomerContext {
    [key: number]: SpecialCustomerModel
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