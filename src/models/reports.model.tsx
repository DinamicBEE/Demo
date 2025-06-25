import { FilterKey } from "./reportsConstansts.model";

export interface ReportsPropsModel {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentReport?: number | null;
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
  filterOpction?: ReportFilterModel;
}

//TODO: validar con Manu la combinación de ReportFilterModel y FilterConfigModel
export interface ReportFilterModel {
    date: string,
    subsidiary: number,
    cdc: number,
    employees: number,
    approver: number,
    categories: number,
    subcategories: number,
    family: number,
    items: number,
    paymentMethod: number,
    currency: number,
  };

export interface ReportContextType {
  reportData: any[];
  loading: boolean;
  getReportData: (reportType: ReporGeneralRequesttModel) => Promise<any>;
}
export interface FilterPropsModel {
  currentReport?: number | null;
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
  }
  
export type AppliedFilters = {
  [key in FilterKey]?: string | Date | null;
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

export type ReportData = DiscountReportModel | PMixGeneralReportModel | PMixEmployeeReportModel;

export type ReportTypeMap = {
  1: DiscountReportModel;
  2: PMixGeneralReportModel;
  3: PMixEmployeeReportModel;
};