import { selectOption } from "./common.model";
import { STATUS } from "./status.model";
import { ListCollection } from "@chakra-ui/react";

export interface LotClosure {
  id: number | string;
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
  statusSolicitud: number;
  batchDate: string;
}

export interface Afilation {
  affiliation: string;
  affiliationDetailsId: number | null;
  affiliationId: number;
  amount: number;
}

export interface Bank {
  totalCrc: number;
  bankTerminalId: number;
  bankTerminalName: string;
  batchClosureId: number;
  batchDetailsId: number | null;
  difference: number;
  totalBatch: number;
  totalPos: number;
  affiliationList: Afilation[];
  lines?: Afilation[];
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
  locations: Array<number>;
  date: string;
  showTable: boolean;
}

export interface DatePickerProps {
  isClearable?: boolean;
  showPopperArrow?: boolean;
  startDate: Date | null;
  endDate: Date | null;
  onChange: (dates: [Date | null, Date | null]) => void;
}

export interface LotClosureDialogProps {
  date: string;
  isOpen: boolean;
  lot: LotClosure;
  onClose: (isRefresh: boolean) => void;
}

export interface LotClosureContextType {
  lotsClosure: LotClosure[];
  lotClosureCache: Record<number, LotClosure[]>;
  banks: Bank[];
  bankCache: Record<number, Bank[]>;
  error: string;
  loading: boolean;
  loadingBanks: boolean;
  updateBankLoading: boolean;
  setLotsClosure: (lots: LotClosure[]) => void;
  setBanks: (banks: Bank[]) => void;
  fetchLotClosureData: (
    dateRange: string,
    locationId: Array<number>,
    isRefresh?: boolean
  ) => Promise<void>;
  fetchBanks: (cdcId: number, date: string) => Promise<Bank[]>;
  updateBank: (banks: Bank[], lot: LotClosure) => Promise<void>;
}

export interface LotCatalogContextType {
  comapanies: ListCollection<selectOption>;
  locations: ListCollection<selectOption>;
  loading: boolean;
  error: boolean;
  setLocations: (locations: ListCollection<selectOption>) => void;
  fetchCompanies: () => Promise<void>;
  fetchLocations: (companyId: number) => Promise<void>;
}

export type LotsClosureContext = Record<string, LotClosure[]>;

export interface BankUpdateRequest extends Pick<LotClosure, "id" | "subId" | "consumerCenterId" | "statusId" | "batchDate"> {
  batchClosureId: number | null;
  batchDetailsRequest: Bank[];
}