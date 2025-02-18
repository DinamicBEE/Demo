import { STATUS } from "./status.model";
import { ListCollection } from "@chakra-ui/react";
export interface LotClosure {
  id: number;
  company: Company;
  location: Location;
  lotNumber: string;
  status: STATUS;
  totalPOS: number;
  totalClousing: number;
  difference: number;
  employe: string;
  dateClosed: string;
}

export interface Bank {
  id: number;
  lotClosureId: number;
  company: Company;
  location: Location;
  bank: string;
  totalPOS: number;
  totalClousing: number;
  difference: number;
  lot: number;
  afilations: {
    id: number;
    name: string;
    amount: number;
  }[];
}

export interface Company {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
  company: Company;
}

export interface TableLotsClosureProps {
  companyId: number;
  locationId: number;
  dateRange: [Date | null, Date | null];
  showTable: boolean;
}

export interface DatePickerProps {
  isClearable?: boolean;
  onChange: (dates: [Date | null, Date | null]) => void;
  endDate: Date | null;
  startDate: Date | null;
  showPopperArrow?: boolean;
}

export interface LotClosureDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lot: LotClosure;
}

export interface LotClosureContextType {
  lotsClosure: LotClosure[];
  banks: Bank[];
  setBanks: (banks: Bank[]) => void;
  setBankCache: (cache: { [key: number]: Bank[] }) => void;
  error: string;
  loading: boolean;
  loadingBanks: boolean;
  fetchLotClosureData: (
    dateRange: [Date | null, Date | null],
    locationId: number,
    companyId: number
  ) => Promise<void>;
  fetchBanks: (lotId: number) => Promise<Bank[]>;
  updateStatus: (lotId: number, status: STATUS) => void;
  updateBankAfilations: (
    bankId: number,
    amount: string,
    afilationId: number
  ) => void;
}

export interface LotCatalogContextType {
  comapanies: ListCollection<{ value: number; label: string }>;
  locations: ListCollection<{ value: number; label: string }>;
  loading: boolean;
  error: boolean;
  setLocations: (
    locations: ListCollection<{ value: number; label: string }>
  ) => void;
  fetchCompanies: () => Promise<void>;
  fetchLocations: (companyId: number) => Promise<void>;
}
