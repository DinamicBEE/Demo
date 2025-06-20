export interface ReportsPropsModel {
  open: boolean;
  setOpen: (open: boolean) => void;
  currentReport?: number | null;
  onReportClick: (reportCode: number) => void;
}