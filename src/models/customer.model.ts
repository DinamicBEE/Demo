import { ClousingLinesModel, ResponseModel, TotalModel } from "./common.clousing.model";
import { SubsidiaryModal } from "./common.model";


export interface CustomersClousingProps {
  data: ClousingLinesModel | null;
  subsidiary: SubsidiaryModal;
}

export interface CustomerContextType {
    customer: CustomerModel | {};
    customerLoading: boolean;
    getCustomerData: (clousingId: number) => Promise<ResponseModel>;
    setCustomerData: (customer:any, clousingId: number) => void;
    customerRef: React.MutableRefObject<CustomerContext>;
}

export interface CustomerContext {
    [key: number]: CustomerModel
}

export interface CustomerLines {
    id: number | string;
    nameClient: string;
    idClient: number;
    coupons: number;
    currency: string;
    pax: number;
    amount: number;
    exchangeRate: number;
    amountMXN: number;
    currencyLabel: string;
    currencyId: number;
}

export interface CustomerModel {
    id: number;
    employeeId?: number;
    total: TotalModel;
    lines: CustomerLines[];
    isRoleEditable?: boolean;
}

export interface CustomerForm { 
    idClient: number,
    nameClient: string,
    coupons: number,
    currency: number, 
    pax: number,
}