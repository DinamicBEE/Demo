import { TotalModel } from "./common.clousing.model";

export interface PrepaidContextType {
    prepaid: PrepaidModel | {};
    prepaidLoading: boolean;
    error: string;
    getPrepaidData: (clousingId: number, employeeId: number) => Promise<PrepaidModel>;
}

export interface PrepaidContext {
    [key: number]: {
        [key: number]: any
    }
}

export interface PrepaidModel {
    id: number;
    employeeId: number;
    total: TotalModel;
    lines: PrepaidLineModel[];
}

export interface PrepaidLineModel {
    id: number;
    client: string;
    quantity: number;
    supplementsQuantity:number;
    unitPrice:number;
    POS: number;
    physical: number;
    difference: number;
}