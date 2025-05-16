import { ClousingLinesModel, TotalModel } from "./common.clousing.model";
import { SubsidiaryModal } from "./common.model";
import { Employee } from "./employee.model";

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
    getEmployeesList: () => Promise<Employee[]>;
    getSubsidiaries: (idEmployee: string) => Promise<SubsidiaryModal[]>;
    setNewIntercompanyRegister: (newIntercompany: IntercompanyLine, clousingId: number) => void;
    setIntercompany: React.Dispatch<React.SetStateAction<IntercompanyContext>>;
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
    id: number | string;
    employeeId: number;
    employeeName: string;
    subsidiaryId: number;
    subsidiaryName: string;
    amount: number;
    ticket: string;
    physicalAmount: number;
    notes?: string;
}

export interface AddIntercompanyProp {
    clousingId: number;
    //subsidiaryId: number;
    //cdc: number;
    isOpen:boolean; 
    onClose: () => void; 
}