import { JSX } from "react";
import { FilterKey } from "./reportsConstansts.model";

export interface ReportsPropsModel {
  open: boolean;
  currentReport?: number | null;
  setOpen: (open: boolean) => void;
  onReportClick: (reportCode: number) => void;
}

export interface HeaderReportModel<T extends ReportData> {
  label: string;
  key: keyof T;
}

export interface TablePropsModel {
  currentReport: number;
  dataReport: any[];
}

export interface ReporGeneralRequesttModel {
  report: number;
  filterOpction: AppliedFilters;
}

//TODO: validar con Manu la combinación de ReportFilterModel y FilterConfigModel
export interface ReportFilterModel {
  date: string | null,
  dateRange: string | null,
  subsidiary: number[] | [],
  cdc: number[] | [],
  multicdc: number[] | [],
  employees: number | null,
  approver: number | null,
  categories: number | null,
  subcategories: number | null,
  family: number | null,
  items: number | null,
  paymentMethod: number | null,
  currency: number | null,
  exchangeRate?: number | null,
};
  
  export interface ReportContextType {
    reportData: any;
    loading: boolean;
    getReportData: (reportType: ReporGeneralRequesttModel) => Promise<any>;
  }
  export interface FilterPropsModel {
    currentReport?: number | null;
    reportName: (name: string) => void;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterData {
  [key: string]: FilterOption[];
}

export interface FilterConfigModel {
    report: number,
    name: string,
    date: boolean,
    dateRange: boolean,
    subsidiary: boolean,
    cdc: boolean,
    multicdc: boolean,
    employees: boolean,
    approver: boolean,
    categories: boolean,
    subcategories: boolean,
    family: boolean,
    items: boolean,
    paymentMethod: boolean,
    currency: boolean,
    exchangeRate: boolean
  }
  
export type AppliedFilters = {
  [key in FilterKey]?: string | number | null | number[];
};

export interface DiscountReportModel {
  date: string | Date;
  cdc: string;
  discountType: string;
  discountAmount: number;
  totalSale: number;
  discountPercentage: number;
  employee: string;
  approver: string;
}

export interface PaymentMethodModel {
  date: string | Date;
  location: string;
  cdc: string;
  paymentMethod: string;
  currency: string;
  exchangeRate: number;
  ticketNumber: string;
  amount: number;
  netSales: number;
  netSalesWithVAT: number;
  comments: string;
}

export interface PMixGeneralReportModel {
  date: string | Date;
  subsidiary: string;
  cdc: string;
  category: string;
  //subcategory: string;
  family: string;
  key: string;
  item: string;
  totalSale: number;
  voids: number;
  discounts: number;
  netSales: number;
  quantity: number;
  categoryPercentage: number;
  familyPercentage: number;
  cost: number;
  costPercentage: number;
}

export interface PMixEmployeeReportModel {
  date: string | Date;
  location: string;
  employee: string;
  cdc: string;
  category: string;
  subcategory: string;
  family: string;
  key: string;
  product: string;
  netSales: number;
  quantity: number;
  cost: number;
  costPercentage: number;
}

export interface EmployeeSalesModel {
     date: string | Date;
     location: string;
     cdc: string;
     employee: string;
     totalSale: number;
     voids: number;
     discounts: number;
     netSales: number;
     pax: number;
     salePer: number;
     checksCount: number;
     averageCheck: number;
     food: number;
     drinks: number;
     boutique: number;
     photos: number;
     unclassified: number;
}

export interface SyncErrorsModel {
  id: number;
  transactionID: number;
  especialStatus: string;
  attempts: number;
  type: string;
  errorMsg: string;
  onCDC: string;
  processOfError: string;
  attended: string;
  creationDate: string;
  lastAttemptDate: string;
  isException: boolean;
  nextStatus: number;
  nextStatusTool: string;
}

export interface CouponsModel {
  check: string;
  consumption: number;
  pricePerConsumption: number;
  difference: number;
  exchangeRateClient: number;
  clients: string;
  pax: number;
  folioCouponsMXN: string;
  folioCouponsUSD: string;
  valueMXN: number;
  valueUSD: number;
  flight: string;
  passengerName: string;
}

export interface BanamexModel {
  guide: BanamexGuideModel[];
  summary: BanamexSummaryModel[];
  employees: BanamexEmployeesModel[];
  commerce: BanamexCommerceModel[];
}

export interface BanamexSummaryModel {
  cdc: string;
  cdcId: number;
  usdAmount: number;
  exchangeRate: number;
  realAmount: number;
  meraAmount: number;
  difference: number;
}

export interface BanamexGuideModel {
  columnNumber: number;
  columnName: string;
  columnDescription: string;
  columnType: string;
  example: string;
  notes: string;
}

export interface BanamexEmployeesModel {
  employeeName: string;
  cdc:string;
  mxnCurrency: number;
  usdCurrency: number;
  sumAmountChange: number;
  difference: number;
}

export interface BanamexCommerceModel {
  day: string;
  month: string;
  year: string;
  typeOperation: string;
  usdReceived: number;
  usdOperation: number;
  exchangeRate: number;
  usdChange: number;
  nationalChange: number;
  employeeId: string;
  recordSales: string;
  cdcId: string;
  cdc: number;
  depositedAmount: number;
  verification1: number;
  verification2: number;
  verification3: number;
  verification4: number;
  paymenthSaleID: number;
}

export type ReportData = DiscountReportModel | PMixGeneralReportModel | PMixEmployeeReportModel | PaymentMethodModel | 
EmployeeSalesModel | BanamexModel | SyncErrorsModel | CouponsModel;

export type ReportTypeMap = {
  1: DiscountReportModel;
  2: PMixGeneralReportModel;
  3: PMixEmployeeReportModel;
  4: EmployeeSalesModel;
  5: PaymentMethodModel;
  9: CouponsModel;
  10: BanamexModel;
  100: SyncErrorsModel;
};

export interface FilterParams {
  [key: number]: {
    params: Params[]
  };
}

export interface Params {
  paramsKey: string, 
  filterKey: string
}