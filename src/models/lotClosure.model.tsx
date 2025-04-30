import { location, SubsidiaryModal } from "./common.model";
import { STATUS } from "./status.model";
import { ListCollection } from "@chakra-ui/react";
export interface LotClosure {
  id: number;
  cashRegisterClosureId: number;
  employeeId: number;
  subId: number;
  consumerCenterId: number;
  statusId: number;
  employeeName: string;
  consumerCenter: string;
  subsidiary: string;
  status: STATUS;
  totalPos: number;
  totalLote: number;
  difference: number;
/*   company: Company;
  location: Location;
  lotNumber: string;
  totalLot: number;
  status: STATUS;
  totalPOS: number;
  totalClousing: number;
  difference: number;
  employe: string;
  dateClosed: string; */
}

export interface Bank {
  bankTerminalId: number;
  bankTerminalName: string;
  batchClosureId: number;
  batchDetailsId: number;
  difference: number;
  totalBatch: number;
  totalCrc: number;
  totalPos: number;
  affiliationList: Afilation[];
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
  company: SubsidiaryModal;
  location: location;
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
  company: SubsidiaryModal;
  location: location;
  isOpen: boolean;
  onClose: () => void;
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
    dateRange: [Date | null, Date | null],
    locationId: number,
    companyId: number,
    isRefresh?: boolean
  ) => Promise<void>;
  fetchBanks: (lotId: number) => Promise<Bank[]>;
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
