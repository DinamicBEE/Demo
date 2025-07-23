import { STATUS } from "./status.model";
import { ListCollection } from "@chakra-ui/react";
export interface LotClosure {
  id: number; //
  subId: number;
  consumerCenterId: number;
  statusId: number;
  employeeCreator: string;
  consumerCenter: string;
  subsidiary: string;
  status: STATUS;
  totalPos: number;
  totalLote: number;
  difference: number;
  statusSolicitud: number
  batchDate: string;
}

export interface Bank {
  totalCrc: number;
  bankTerminalId: number;
  bankTerminalName: string;
  batchClosureId: number;
  batchDetailsId: number;
  difference: number;
  totalBatch: number;
  totalPos: number;
  affiliationList: Afilation[]; //
}

export interface Afilation {
  affiliation: string;
  affiliationDetailsId: number | null;
  affiliationId: number;
  amount: number;
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
  locations: number[];
  date: string;
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
  date:string;
  isOpen: boolean;
  onClose: (isRefresh:boolean) => void;
  lot: LotClosure;
}

export interface LotClosureContextType {
  lotsClosure: LotClosure[];
  setLotsClosure: (lots: LotClosure[]) => void;
  lotClosureCache: { [key: number]: LotClosure[] };
  banks: Bank[];
  setBanks: (banks: Bank[]) => void;
  bankCache: { [key: number]: Bank[] };
  error: string;
  loading: boolean;
  loadingBanks: boolean;
  updateBankLoading: boolean;
  fetchLotClosureData: (
    dateRange: string,
    locationId: number[],
    isRefresh?: boolean
  ) => Promise<void>;
  fetchBanks: (cdcId: number, date:string) => Promise<Bank[]>;
  updateBank: (lotId: number, bank: Bank[], lot: LotClosure) => Promise<void>;
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

export interface LotsClosureContext {
  [key:string]: LotClosure[]
}