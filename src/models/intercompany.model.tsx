import { ClousingLinesModel, TotalModel } from "./common.clousing.model";
import { SubsidiaryModal } from "./common.model";

export interface IntercompanyClousingProps {
  data: ClousingLinesModel | null;
  subsidiaryId: number;
  cdc: number;
}

export interface IntercompanyContextType {
    intercompany: IntercompanyModel | {};
    error: string;
    getIntercompanyData: (clousingId: number) => Promise<IntercompanyModel>;
    setIntercompanyData: (intercompanyData: IntercompanyModel, clousingId:number) => void;
}

export interface IntercompanyContext {
    [key: number]: IntercompanyModel
}

export interface IntercompanyModel{
    id: number;
    employeeId: number;
    total: TotalModel;
    lines: IntercompanyLine[]
}

export interface IntercompanyLine {
    id: number;
    employeeId: number;
    employeeName: string;
    subsidiaryId: number;
    subsidiaryname: string;
    amount: number;
    ticket: string;
    physicalAmount: number;
    notes?: string;
}