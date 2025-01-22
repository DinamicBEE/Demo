import { CLOUSING_KEY } from "./constants.model";

export interface HeaderContextType {
  header: any
  error: string;
  loading: boolean;
  getHeader: (clousingId: number, employeeId: number) => Promise<any>;
  updateTotal: (newtotal: number, newDifference: number, employeeId:number, clousingType: CLOUSING_KEY) => void;
}

export interface HeaderClousingProps {
  id: number;
  employe: number;
}

export interface HeaderData {
  cdc?: string;
  location?: string;
  subsidiary?: string;
  date?: string;
  totalPOS?: number;
  totalClousing?: number;
  difference?: number;
  service?: number;
  discountPOS?: number;
  discountClousing?: number;
  closures: ClousingType
}

export interface ClousingType{
  cash: TotalModel;
  customer: TotalModel;
  specialCustomer: TotalModel;
  tdc: TotalModel;
  employee: TotalModel;
  prepaid: TotalModel;
  intercompany: TotalModel
}

export interface FooterClousing {
  clousingType: string;
  clousingId: number;
  data?: TotalModel | undefined;
  loading?: boolean;
  onChange?: () => Promise<boolean>;
}

export interface TotalModel {
  totalPOS: number;
  totalPhysical: number;
  difference: number;
}

export interface CurrencyModel {
  label: string;
  value: number;
  exchangeRate: number;
}

export interface AlertClousing {
  title:string;
  description?: string;
  type: string;
}

export interface FooterContextType {
  setFooterData: (footerData: TotalModel, clousingId: number, clousingType: string) => void;
  getFooterData: (clousingId: number, clousingType: string) => Promise<TotalModel>;
}