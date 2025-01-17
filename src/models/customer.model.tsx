import { TotalModel } from "./common.clousing.model";

export interface CustomerContextType {
    customer: CustomerModel;
    customerLoading: boolean;
    error: string;
    getCustomerData: (clousingId: number, employeeId: number) => Promise<any>;
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