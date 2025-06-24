export interface ReportsPropsModel {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentReport?: number | null;
  onReportClick: (reportCode: number) => void;
}

export interface HeaderReportModel {
  label: string;
  key: string;
}

export interface TablePropsModel {
  currentReport: number;
  dataReport: any[];
}

export interface ReporGeneralRequesttModel {
  report: number;
  filterOpction?: ReportFilterModel;
}


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
  reportData: any;
  loading: boolean;
  getReportData: (reportType: ReporGeneralRequesttModel) => Promise<any>;
}