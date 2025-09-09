export const FIELD_MAPPING: Record<string, string> = {
  Store: "Centro de consumo",
  Account: "Subsidiaria",
  "Merchant Reference": "check",
  "Creation Date": "date",
  "Gross Credit (GC)": "amount",
  Currency: "currency",
  "Payment Method": "paymentMethod",
  Status: "status",
};

export interface FileResult {
  fileName: string;
  data: Record<string, unknown>[];
  rowCount: number;
}

export interface ProcessResult {
  success: boolean;
  processedFiles?: number;
  processedFileNames?: string[];
  consolidatedData?: Record<string, unknown>[];
  totalRecords?: number;
  results?: FileResult[];
  error?: string;
}

export const EXPECTED_COLUMNS = [
  //"Store",
  "PSP Reference",
  "Merchant Reference",
  //"Account",
  "Creation Date",
  //"TimeZone",
  //"Value",
  "Gross Currency",
  "Gross Credit (GC)",
  //"Payment Method",
  //"Status",
  //"Risk Score",
] as const;
