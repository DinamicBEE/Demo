import { CLOUSING_KEY } from "./constants.model";

export interface ClousingModel {
  header: HeaderClousingModel;
  clousingLines: ClousingLinesModel[];
}

export interface HeaderClousingModel {
  subsidiaryName: string;
  storeName: string;
  date: string;
  time:string;
  totalPOS: number;
  totalPhysical: number;
  difference: number;
}

export interface ClousingLinesModel {
  id: number;
  employe: string;
  totalPOS: number;
  totalPhysical: number;
  difference: number;
  status: string;
  extra: number;
  mxm: number;
  usd: number;
  eur: number;
  lib: number;
  can: number;
  customer: number;
  specialCustomer: number;
  prepaid: number;
  employees: number;
  intercompany: number;
  service: number;
  discount: number;
  iva: number;
  closingConfirmation: boolean;
}

export interface ClousingContextType {
  header: HeaderClousingModel;
  data: ClousingLinesModel[];
  loading: boolean;
  error: string;
  getInfo: (subsidiary: number, store: number) => void;
  dataClousing: any;
  setDataClousing: React.Dispatch<React.SetStateAction<{}>>;
  dataRow: any
  setDataRow: any
}

export interface HeaderContextType {
  header: HeaderContext
  error: string;
  loading: boolean;
  getHeader: (clousingData: ClousingLinesModel) => HeaderData;
  updateTotal: (newtotal: number, clousingId: number, clousingType: CLOUSING_KEY) => void;
}

export interface HeaderContext {
   [key: number]: HeaderData
}

export interface HeaderData {
  cdc?: string;
  location?: string;
  subsidiary?: string;
  date?: string;
  totalPOS?: number;
  totalClousing?: number;
  difference?: number;
  service: number;
  discountPOS: number;
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
  clousingType: CLOUSING_KEY;
  clousingId: number;
  closeDialog: () => void,
  closingConfirmation: boolean
  // data?: TotalModel | undefined;
  // loading?: boolean;
  // onChange?: () => Promise<boolean>;
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

export interface ResponseModel {
  success: boolean;
  data?: any;
  error?: string;
  message?: string
}

export interface ClousingLayoutProps {
  isOpen: boolean;
  onClose: () => void;
  employee: ClousingLinesModel | null
}

export interface TableOfTotalsProps {
  subsidiary: number;
  store: number;
}

export interface ConfirmDialogProps {
    isOpen: boolean,
    closeDialog: () => void,
    sendData: () => void
}
