import { ResponseModel, TotalModel } from "./common.clousing.model";

export interface specialCustContextType {
  specialCust: SpecialCustomerModel | {};
  specialCustLoading: boolean;
  getSpecialCustData: (
    clousingId: number,
    idCurrency: number,
    isRefresh: boolean
  ) => Promise<ResponseModel>;
  setSpecialCustData: (
    specialCustLine: SpecialCustomerModel,
    clousingId: number
  ) => void;
  specialCustRef: React.MutableRefObject<SpecialCustomerContext>;
}

export interface SpecialCustomerContext {
  [key: number]: SpecialCustomerModel;
}

export interface SpecialCustomerLines {
  id: number;
  check: number;
  guestCheckId: number;
  bill: number;
  couponPrice: number;
  difference: number;
  exchangeRate: number;
  client: string;
  clientId: number;
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
  isRoleEditable?: boolean;
}
