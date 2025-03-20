import { TotalModel } from "./common.clousing.model";

export interface CustomerContextType {
    customer: CustomerModel | {};
    customerLoading: boolean;
    error: string;
    getCustomerData: (clousingId: number) => Promise<CustomerModel>;
    setCustomerData: (customer:any, clousingId: number) => void;
}

export interface CustomerContext {
    [key: number]: CustomerModel
}

export interface CustomerLines {
    id: number | string;
    nameClient: string;
    coupons: number;
    currency: string;
    pax: number;
    amount: number;
    exchangeRate: number;
    amountMXN: number;
}

export interface CustomerModel {
    id: number;
    employeeId?: number;
    total: TotalModel;
    lines: CustomerLines[]
}

export interface CustomerForm { 
    nameClient: string,
    coupons: number,
    currency: number, 
    pax: number,
}