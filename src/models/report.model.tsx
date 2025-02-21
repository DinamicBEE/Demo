export interface ReportModel {
  headers: Headers[];
  rows: Row[];
}
export interface Headers {
  name: string;
  code: string;
}
export interface Row {
  id: number;
  confirmed: boolean;
  approved: Common;
  data: Datum[];
}
export interface Datum {
  id?: number;
  code: string;
  value: string | number;
}
export interface Common {
  id: string | number | null;
  name: string;
  date?: string;
}
