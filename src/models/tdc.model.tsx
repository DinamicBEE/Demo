import { ProcessResult } from "./adyen.model";
import { TotalModel } from "./common.clousing.model";

export interface TDCContextType {
  tdc: TDCContext;
  tdcDetails: BankDetails | {};
  tdcLoading: boolean;
  detailsLoading: boolean;
  error: string;
  detailsError: string;
  getTDCData: (clousingId: number) => Promise<TDCModel>;
  setTDCData: (tdc: TDCModel, clousingId: number) => void;
  getDetails: (
    clousingId: number,
    lineId: number | null
  ) => Promise<BankDetails>;
  setDetails: (
    details: BankDetails,
    clousingId: number,
    lineId: number
  ) => void;
}

export interface TDCAdyenContextType {
  dataFilesProcess: ProcessResult;
  fetchProcessFiles: (Files: File[]) => Promise<ProcessResult>;
}

export interface TDCContext {
  [key: number]: TDCModel;
}

export interface TDCDetailsContext {
  [key: number]: {
    [key: number]: BankDetails;
  };
}

export interface BankLineModel {
  id: number;
  bank: string;
  POS: number;
  physical: number;
  voucherAmount: number;
}

export interface TDCModel {
  id: number;
  employeId: number;
  total: TotalModel;
  lines: BankLineModel[];
}

export interface BankLineDetails {
  id: number;
  date: string;
  check: string;
  amount: number;
  success?: boolean;
  message?: string;
  differences?: {
    date: string | null;
    check: string | null;
    amount: string | null;
    general: string | null;
  };
  successAdyen?: boolean;
}

export interface BankDetails {
  id: number;
  bankName: string;
  total: number;
  details: BankLineDetails[];
}

export interface DetailsProp {
  clousingId: number;
  lineId: number | null;
  isOpen: boolean;
  onClose: () => void;
  closingConfirmation: boolean;
}

export interface DialogFilesProps {
  isOpen: boolean;
  onClose: () => void;
}
