import { CashModel } from "./cash.model";
import { location, selectOption, SubsidiaryModal } from "./common.model";
import { CLOUSING_KEY } from "./common.const";
import { CustomerModel } from "./customer.model";
import { EmployeeModel } from "./employee.model";
import { IntercompanyModel } from "./intercompany.model";
import { PrepaidModel } from "./prepaid.model";
import { SpecialCustomerModel } from "./specialCustome.model";
import { TDCModel } from "./tdc.model";
import { AxiosError } from "axios";

export interface ClousingModel {
  header: HeaderClousingModel;
  clousingLines: ClousingLinesModel[];
  pagination: {
    totaRegistros: number;
    totalPagina: number;
  };
}

export interface HeaderClousingModel {
  subsidiaryName: string;
  storeName: string;
  date: string;
  time: string;
  totalPOS: number;
  totalPhysical: number;
  difference: number;
  isStarbucks?: boolean;
}

export interface ClousingLinesModel {
  id: number;
  employe: string;
  totalPOS: number;
  totalPhysical: number;
  currencies: Currency[];
  difference: number;
  diferenciaCupones?: number;
  status: string;
  extra: number;
  mxm?: number;
  usd?: number;
  eur?: number;
  lib?: number;
  can?: number;
  customer: number;
  specialCustomer: number;
  prepaid: number;
  employees: number;
  intercompany: number;
  service?: number;
  discountPhysical?: number;
  iva?: number;
  closingConfirmation: boolean;
  creationDate: string;
  closingStartDate: string;
  closingEndtDate: string;
  tdc: TDC[];
  tips: number;
  tipsCash: number;
  isRoleEditable?: boolean;
  modificationUser: string;
  zone: string;
  revenueId?: number;
}

export type ClousingLinesTotals =
  Omit<ClousingLinesModel,
    "id"|
    "employe"|
    "creationDate"|
    "closingStartDate"|
    "closingEndtDate"|
    "status"|
    "closingConfirmation"|
    "mxn"|
    "usd"|
    "eur"|
    "lib"|
    "can">;
export interface TotalsModel extends Omit<ClousingLinesModel, "id" | "employe" | "status" | "creationDate" 
| "closingStartDate" | "closingEndtDate" | "closingConfirmation" | "service" | "discount" | "iva"> {};

export interface ReportClousingLinesModel extends Omit<ClousingLinesModel, "id" | "employe" | "creationDate" | "extra"
| "closingStartDate" | "closingEndtDate" | "closingConfirmation" | "service" | "discount" | "iva" | "tdc" | "mxm"> {
  id?: number,
  ubicacion: string,
  subsidiariaId: number,
  subsidiariaCurrencyId: number,
  cdc: string | null,
  cdcId: number,
  mxn: number | null,
  generalTotal: number | null,
  tpvBancomerUsd: number,
  tpvSbdellMxn:  number,
  tpvColdpatria: number,
  tpvAmexcoCop: number,
  tpvBanamexUsd: number,
  tpvBancomer: number,
  tpvAmexco: number,
  tpvBanamex: number,
  tpvBbvaCop: number,
  tpvSbdellUsd: number,
  tpvBancoColombia: number,
  sbdellAmexMxn: number,
  sbdellAmexUsd: number,
  tpvNetpay: number,
  webKiosko: number,
  tpvSantander: number,
  webappUsd: number,
  tpvDinners: number,
  tpvAdyen:  number,
  tpvAdyenAmex: number,
  tpvAdyenKiosko: number,
  tpvKioskoUsd: number,
  isStarbucks: boolean,
};

export interface ReportTotalsModel extends Omit<ReportClousingLinesModel, "id" | "ubicacion" | "status" | "cdc">{
}

export interface TDC {
  nameBank: string;
  total: number;
}

export interface Currency {
  id: number;
  symbol: string;
  total: number;
}


export interface ClousingContextType {
  header: HeaderClousingModel;
  data: ClousingLinesModel[];
  totals: TotalsModel;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  error: string;
  tdcHeader: TDC[];
  currHeader: Currency[];
  getInfo: (
    store: number,
    page: number,
    startDate: Date,
    endDate: Date,
    isSearch: boolean,
    isStarbucks?: boolean
  ) => void;
  //dataClousing: any;
  //setDataClousing: React.Dispatch<React.SetStateAction<{}>>;
  dataRow: any;
  setDataRow: any;
  filterDataAdyen: (isAdyen: boolean) => void;
  pagination: {
    totaRegistros: number;
    totalPagina: number;
  };
}

export interface HeaderContextType {
  header: HeaderContext;
  error: string;
  loading: boolean;
  getHeader: (clousingData: ClousingLinesModel) => Promise<HeaderData>;
  updateHeaderState: (newHeader: any, clousingId: number) => void;
  updateTotal: (
    newtotal: number,
    clousingId: number,
    clousingType: CLOUSING_KEY,
    differenceCupons?: number
    //isUpdate?: boolean,
    //valueCurrent?: number
  ) => void;
  headerRef: React.MutableRefObject<HeaderContext>;
}

export interface HeaderContext {
  [key: number]: HeaderData;
}

export interface HeaderData {
  cdc?: string;
  location?: string;
  subsidiary?: string;
  date?: string;
  totalPOS?: number;
  totalPOSAux?: number;
  totalClousing?: number;
  difference?: number;
  differenceCupons?: number
  service: number;
  discountPhysical: number;
  discountClousing?: number;
  closures: ClousingType;
}

export interface ExtraInfo {
  //Returar "?" cuando se tenga el el endpoint al 100%
  totalDiscount: number;
  totalTax?: number; 
  discountPhysical?: number; //???????????????
}

export interface ClousingType {
  cash: TotalModel;
  customer: TotalModel;
  specialCustomer: TotalModel;
  tdc: TotalModel;
  employee: TotalModel;
  prepaid: TotalModel;
  intercompany: TotalModel;
}

export interface FooterClousing {
  clousingType: CLOUSING_KEY;
  clousingId: number;
  closeDialog: (isRefresh: boolean) => void;
  closingConfirmation: boolean;
  idCurrency: number;
  isRoleEditable?: boolean;
  isStarbucks: boolean;
}

export interface TotalModel {
  totalPOS: number;
  totalPhysical: number;
  difference: number;
  differenceCupons?: number;
}

export interface CurrencyModel {
  label: string;
  value: number;
  exchangeRate: number;
}

export interface AlertClousing {
  title: string;
  description?: string;
  type: string;
}

export interface FooterContextType {
  setFooterData: (
    footerData: TotalModel,
    clousingId: number,
    clousingType: string
  ) => void;
  getFooterData: (
    clousingId: number,
    clousingType: string
  ) => Promise<TotalModel>;
}

export interface ResponseModel {
  success: boolean;
  code?: number;
  data?: any;
  error?: AxiosError;
  message?: string;
}

export interface ClousingLayoutProps {
  isOpen: boolean;
  onClose: (isRefresh:boolean) => void;
  employee: ClousingLinesModel;
  location: location;
  subsidiary: SubsidiaryModal;
  isEdit?: boolean;
  isStarbucks: boolean;
}

export interface TableOfTotalsProps {
  subsidiary: SubsidiaryModal;
  store: location;
  startDate: Date;
  endDate: Date;
  isReport: boolean;
  isStarbucks: boolean;
}

export interface ConfirmDialogProps {
  isOpen: boolean;
  closeDialog: () => void;
  sendData: (isConfirm: boolean) => void;
  isConfirm: boolean;
}

export interface ExitDialogProps {
  isOpen: boolean;
  closeDialog: () => void;
  closeOnExit: () => void;
}

export interface ErrorDialogProps {
  isOpen: boolean;
  usdMessage: boolean;
  closeDialog: () => void;
}

export interface CustomerClousingFormProps {
  isOpen: boolean;
  onClose: () => void;
  dataCustomer: any;
  setCustomersData: any;
  message?: string;
  title?: string;
  idCurrency: number;
  idClousing: number;
  isStarbucks: boolean;
}

export interface GeneralInfoProps {
  subsidiary?: SubsidiaryModal;
  store?: location;
  isReport: boolean;
  totals?: TotalModel
}

export interface HomeParamsProps {
  subsidiary?: SubsidiaryModal;
  store?: location;
  date: string
  isStarbucks: boolean;
}

export interface SelectHandlerParams<T = selectOption> {
  newItems: T[];
  currentSelected: T[];
  setSelectedOptions: (options: T[]) => void;
  setSelectedIds?: (ids: number[]) => void; // Opcional si necesitas los IDs
}

export interface DataServiceModel {
    cash: CashModel;
    tdc: TDCModel;
    customer: CustomerModel;
    specialCustomer: SpecialCustomerModel;
    prepaid: PrepaidModel;
    intercompany: IntercompanyModel;
    clousingId: number;
    idCurrency: number;
    discountPhysical: number;
    employee: EmployeeModel;
}