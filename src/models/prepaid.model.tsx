import { TotalModel } from "./common.clousing.model";

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
    totalPOS: number;
    totalPhysical: number;
    difference: number;
}