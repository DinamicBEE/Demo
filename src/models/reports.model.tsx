import { FilterKey } from "./reportsConstansts.model";

export interface ReportsPropsModel {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentReport?: number | null;
  onReportClick: (reportCode: number) => void;
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