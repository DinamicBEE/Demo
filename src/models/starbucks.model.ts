import { Currency, TDC, TotalModel } from "./common.clousing.model";
import { STATUS } from "./const/status.const";
import { Voucher } from "./tdc.model";

export interface SortableHeaderProps {
  columnKey: string;
  label: string;
  handleSort: (key: string) => void;
  getSortIcon: (key: string) => React.ReactNode;
  textAlign?: "left" | "center" | "right";
}

export interface StarbucksTableDataModel {
  headers: StarbucksTableHeader;
  lines: StarbucksTableModel[];
}

export interface PropDialogStarbucksTable extends StarbucksTableDataModel {
  getTableData(): void;
}

export interface StarbucksTableModel {
    id: number;
    employee: string;
    cdc: string;
    status: STATUS;
    date: string;
    total: number;
    currencies: Currency[];
    creditCards: TDC[];
    cxc: number,
    modificationUser: string;
    fgUpt?: boolean,
}

export interface StarbucksTableRow {
  data: HeaderDetailsInfoModel;
  cash: CashStarbucksModel[];
  tdc: TDCStarbucksModel[];
  cxc: CXCModel[]
}

export interface HeaderDetailsInfoModel {
  date: string;
  cdc: string;
  total: number;
  totalPOS: number;
  totalPOSTDC: number;
  electronicTips: number;
  tips: number;
  idCurrencySub: number;
}
export interface CashStarbucksModel {
  id: number;
  currency: string;
  idCurrency: number
  total: number;
  pos: number;
  exchangeRate: number;
  originalCurrency: number;
  isOpen: boolean;
  denominations: DenominationsModel[];
}

export interface TDCStarbucksModel {
  id: number | null;
  nameBank: string;
  idBank: number;
  total: number;
  pos: number;
  currencyExternalId?: number;
  exchangeRate: number;
  originalCurrency: number;
  isOpen: boolean;
  voucher: Voucher[]
}

export interface CXCModel extends Omit<CashStarbucksModel, 'denominations' | 'idCurrency' | 'pos'> {}

export interface CashToSend extends Omit<CashStarbucksModel, 'total' | 'isOpen' | 'pos'> {
  totalPOS: number;
  totalFisico: number;
  difference: number;
}

export interface StarbucksToSend extends Omit<TDCStarbucksModel, 'total' | 'isOpen' | 'pos' | 'voucher' | 'nameBank' | 'originalCurrency'> {
  bank: string;
  POS: number;
  physical: number;
  voucherAmount: number;
  totalPosOriginal: number;
  vouchers: Voucher[];
}

export interface StarbucksTableHeader {
  currencies: Currency[];
  creditCards: TDC[];
}

export interface StarbucksDetailsProps {
  isOpen: boolean;
  line: StarbucksTableModel;
  banks: StarbucksBanksModel[];
  onClose: (isConfirm:boolean) => void;
}

export interface DenominationsDetaislProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (denominatios:DenominationsPropModel) => void;
    denominations: DenominationsPropModel;
    disabled: boolean;
}

export interface DenominationsPropModel{
  currencyId: number;
  denominations: DenominationsModel[];
}

export interface DenominationsModel {
  id: number;
  idDenomination: number;
  denomination: string;
  amount: number;
  subtotal?: number;
}

export interface ClousingSaveStarbucksModel {
  crcId: number;
  cash: {
    electronicTips: number;
    tips: number;
    idCurrencySub: number;
    total: TotalModel;
    lines: CashToSend[];
  };
  tdc: {
    idCurrencySub: number;
    total: TotalModel;
    lines: StarbucksToSend[];
  }
}

export interface StarbucksBanksModel {
  bankName: string;
  bankId: number;
}