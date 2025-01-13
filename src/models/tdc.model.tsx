export interface BankLineModel {
    id: number;
    bank: string;
    POS: number;
    physical: number;
    voucherAmount: number;
}

export interface TDCModel {
    id: number;
    employeId: number;
    globalTotalPOS: number;
    globalTotalFisico: number;
    globalDifference: number;
    currencies: BankLineModel[];
}