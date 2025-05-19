import { ProcessResult } from "./adyen.model";
import { TotalModel } from "./common.clousing.model";
import { location, SubsidiaryModal } from "./common.model";

export interface TDCContextType {
  tdc: TDCContext;
  tdcDetails: Voucher | {};
  tdcLoading: boolean;
  detailsLoading: boolean;
  error: string;
  detailsError: string;
  getTDCData: (clousingId: number, idCurrency: number) => Promise<TDCModel>;
  setTDCData: (tdc: TDCModel, clousingId: number) => void;
  /*   getDetails: (
    clousingId: number,
    lineId: number | null | string,
  ) => Promise<Voucher>; */
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
    Files: File[],
    store: string,
    location: string
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
}

export interface TDCModel {
  id: number;
  employeId: number;
  total: TotalModel;
  lines: BankLineModel[];
}

/* export interface BankLineDetails {
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
} */

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
  /*  difference?: {
    date: string | null;
    check: string | null;
    amount: string | null;
    general: string | null;
  };
  successAdyen?: boolean; */
}

/* export interface BankDetails {
  id: number;
  bankName: string;
  total: number;
  details: BankLineDetails[];
} */

export interface DetailsProp {
  clousingId: number;
  lineId: number | null | string;
  isOpen: boolean;
  onClose: () => void;
  closingConfirmation: boolean;
  location: location;
  subsidiary: SubsidiaryModal;
  bankDetails: BankLineModel;
}

export interface DialogFilesProps {
  isOpen: boolean;
  onClose: () => void;
  subsidiary: SubsidiaryModal;
  location: location;
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
  label: boolean;
  itemId?: number | string;
  voucherSelect?: string;
  onSelect: (voucher: any, itemId?: number | string) => void;
  disabled: boolean;
}
