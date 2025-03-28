import { ProcessResult } from "./adyen.model";
import { TotalModel } from "./common.clousing.model";

export interface TDCContextType {
  tdc: TDCContext;
  tdcDetails: BankDetails | {};
  tdcLoading: boolean;
  detailsLoading: boolean;
  error: string;
  detailsError: string;
  getTDCData: (clousingId: number, idCurrency: number) => Promise<TDCModel>;
  setTDCData: (tdc: TDCModel, clousingId: number) => void;
  getDetails: (
    clousingId: number,
    lineId: number | null | string,
  ) => Promise<BankDetails>;
  setDetails: (
    details: BankDetails,
    clousingId: number,
    lineId: number | string,
  ) => void;
}

export interface TDCAdyenContextType {
  dataFilesProcess: ProcessResult;
  setDataFilesProcess: (data: ProcessResult) => void;
  fetchProcessFiles: (
    Files: File[],
    store: number,
    location: number
  ) => Promise<ProcessResult | undefined>;
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
  id: number | string;
  bank: string;
  pos: number;
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
  vouchers?: {
    date: string | null;
    check: string | null;
    amount: string | null;
    general: string | null;
  };
  successAdyen?: boolean;
}

export interface Voucher {
  id: number;
  amount: number;
  check: string;
  date: string;
  status: boolean;
}

export interface BankDetails {
  id: number;
  bankName: string;
  total: number;
  details: BankLineDetails[];
}

export interface DetailsProp {
  clousingId: number;
  lineId: number | null | string;
  isOpen: boolean;
  onClose: () => void;
  closingConfirmation: boolean;
  location: number;
  subsidiary: number;
  voucherData: BankDetails;
}

export interface DialogFilesProps {
  isOpen: boolean;
  onClose: () => void;
  subsidiary: number;
  location: number;
}

export interface DialogConfirmTDCProps {
  isOpen: boolean;
  onClose: () => void;
  nameBank: string;
  onAccept: () => void;
  loading: boolean;
}
