import { Currency, TDC } from "./common.clousing.model";
import { STATUS } from "./status.model";

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

export interface StarbucksTableModel {
    id: number;
    employee: string;
    cdc: string;
    status: STATUS;
    date: string;
    total: number;
    currencies: Currency[];
    creditCards: TDC[];
    cxc: number
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
}
export interface CashStarbucksModel {
  id: number;
  currency: string;
  total: number;
  exchangeRate: number;
  originalCurrency: number;
  denominations: DenominationsModel[];
}

export interface TDCStarbucksModel {
  id: number;
  nameBank: string;
  total: number;
  exchangeRate: number;
  originalCurrency: number;
}

export interface CXCModel extends Omit<CashStarbucksModel, 'denominations'> {}

export interface StarbucksTableHeader {
  currencies: Currency[];
  creditCards: TDC[];
}

export interface StarbucksDetailsProps {
  isOpen: boolean;
  line: StarbucksTableModel;
  onClose: () => void;
}

export interface DenominationsDetaislProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (denominatios:DenominationsPropModel) => void;
    denominations: DenominationsPropModel;
}

export interface DenominationsPropModel{
  currencyId: number;
  denominations: DenominationsModel[];
}

export interface DenominationsModel {
  id: number;
  denomination: string;
  amount: number;
  subtotal: number;
}