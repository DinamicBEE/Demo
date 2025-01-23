import { TotalModel } from "./common.clousing.model";


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

export interface SpecialCustomer {
  id: number;
  employeeId: number;
  total: TotalModel;
  lines: SpecialCustomerLines[];
}