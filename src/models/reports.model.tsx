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
  subsidiary: number[] | [],
  cdc: number[] | [],
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
    subsidiary: boolean,
    cdc: boolean,
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

export interface PMixGeneralReportModel {
  date: string | Date;
  subsidiary: string;
  cdc: string;
  category: string;
  subcategory: string;
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

export type ReportData = DiscountReportModel | PMixGeneralReportModel | PMixEmployeeReportModel | EmployeeSalesModel | SyncErrorsModel;

export type ReportTypeMap = {
  1: DiscountReportModel;
  2: PMixGeneralReportModel;
  3: PMixEmployeeReportModel;
  4: EmployeeSalesModel;
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