import { Currency, TDC } from "./common.clousing.model";
import { STATUS } from "./status.model";
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
  idCurrency: number
  total: number;
  exchangeRate: number;
  originalCurrency: number;
  isOpen: boolean;
  denominations: DenominationsModel[];
}

export interface TDCStarbucksModel {
  id: number;
  nameBank: string;
  idBank: number;
  total: number;
  exchangeRate: number;
  originalCurrency: number;
  isOpen: boolean;
  voucher: Voucher[]
}

export interface CXCModel extends Omit<CashStarbucksModel, 'denominations' | 'idCurrency'> {}

export interface StarbucksTableHeader {
  currencies: Currency[];
  creditCards: TDC[];
}

export interface StarbucksDetailsProps {
  isOpen: boolean;
  line: StarbucksTableModel;
  onClose: (isConfirm:boolean) => void;
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
  idDenomination: number;
  denomination: string;
  amount: number;
  subtotal: number;
}