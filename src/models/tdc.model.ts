import { ProcessResult } from "./adyen.model";
import { TotalModel } from "./common.clousing.model";

export interface TDCContextType {
  tdc: TDCContext;
  tdcDetails: Voucher | {};
  tdcLoading: boolean;
  detailsLoading: boolean;
  error: string;
  detailsError: string;
  getTDCData: (clousingId: number, idCurrency: number, isStarbucks: boolean, isRefresh: boolean) => Promise<TDCModel>;
  setTDCData: (tdc: TDCModel, clousingId: number) => void;
  setDetails: (
    details: BankLineModel,
    clousingId: number,
    lineId: number | string
  ) => void;
  tdcRef: React.MutableRefObject<TDCContext>;
}

export interface TDCAdyenContextType {
  dataFilesProcess: ProcessResult;
  setDataFilesProcess: (data: ProcessResult) => void;
  fetchProcessFiles: (
    Files: File[]
  ) => Promise<ProcessResult | undefined>;
}

export interface TDCContext {
  [key: number]: TDCModel;
}

export interface TDCDetailsContext {
  [key: number]: {
    [key: number]: BankLineModel;
  };
}

export interface BankLineModel {
  id: number | string;
  idBank: number;
  bank: string;
  physical: number;
  pos: number;
  voucherAmount: number;
  voucherAmountDisplay: number;
  vouchers: Voucher[];
  isRoleEditable?: boolean;
}

export interface TDCModel {
  id: number;
  employeId: number;
  total: TotalModel;
  lines: BankLineModel[];
  linesCopy?: BankLineModel[];
  isRoleEditable?: boolean;
}

export interface Voucher {
  id: number;
  idCustom: number;
  voucherId: null | number;
  uniqueIdVoucher: number;
  amountConversion: number;
  date: string;
  check: string;
  amount: number;
  status: boolean;
  message?: string;
  dateDisplay?: string;
}

export interface DetailsProp {
  clousingId: number;
  lineId: number | null | string;
  isOpen: boolean;
  onClose: () => void;
  closingConfirmation: boolean;
  bankDetails: BankLineModel;
}

export interface DialogFilesProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DialogConfirmTDCProps {
  isOpen: boolean;
  onClose: () => void;
  nameBank: string;
  onAccept: () => void;
  loading: boolean;
  detailsLocal: BankLineModel;
  vouchersSelected: number;
}

export interface VoucherFilter {
  vouchers: Voucher[];
  itemId?: number | string;
  onSelect: (voucher: any, itemId?: number | string) => void;
  disabled: boolean;
}

export interface voucherSelectOption {
  label: string;
  value: string;
  description?: string;
}