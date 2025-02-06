import { TotalModel } from "./common.clousing.model";

export interface CustomerContextType {
    customer: CustomerModel | {};
    customerLoading: boolean;
    error: string;
    getCustomerData: (clousingId: number, employeeId: number) => Promise<CustomerModel>;
    setCustomerData: (customer:any, employeeId: number, clousingId: number) => void;
}

export interface CustomerContext {
    [key: number]: {
        [key: number]: any
    }
}

export interface CustomerLines {
    id: number;
    customers: string;
    coupons: number;
    currency: string;
    valuePAX: number;
    amount: number;
    exchangeRate: number;
    amountMXN: number;
}

export interface CustomerModel {
    id: number;
    employeeId: number;
    total: TotalModel;
    lines: CustomerLines[]
}