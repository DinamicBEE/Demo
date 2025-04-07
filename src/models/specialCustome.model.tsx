import { TotalModel } from "./common.clousing.model";

export interface specialCustContextType {
  specialCust: SpecialCustomerModel | {};
  specialCustLoading: boolean;
  error: string;
  getSpecialCustData: (
    clousingId: number,
    idCurrency: number
  ) => Promise<SpecialCustomerModel>;
  setSpecialCustData: (
    specialCustLine: SpecialCustomerModel,
    clousingId: number
  ) => void;
}

export interface SpecialCustomerContext {
  [key: number]: SpecialCustomerModel;
}

export interface SpecialCustomerLines {
  id: number;
  check: number;
  bill: number;
  couponPrice: number;
  difference: number;
  exchangeRate: number;
  client: string;
  pax: number;
  couponFolio: string;
  couponFolioUSD: string;
  ammount: number;
  ammountUSD: number;
  flight: string;
  passengerName: string;
  ammountMXN: number;
}

export interface SpecialCustomerModel {
  id: number;
  employeeId?: number;
  total: TotalModel;
  lines: SpecialCustomerLines[];
}
