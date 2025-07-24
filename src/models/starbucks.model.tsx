import { Currency, TDC } from "./common.clousing.model";

export interface SortableHeaderProps {
  columnKey: string;
  label: string;
  handleSort: (key: string) => void;
  getSortIcon: (key: string) => React.ReactNode;
  textAlign?: "left" | "center" | "right";
}

export interface StarbucksTableModel {
    id: number;
    employee: string;
    status: string;
    date: string;
    total: number;
    currencies: Currency[];
    creditCards: TDC[];
    cxc: number
}