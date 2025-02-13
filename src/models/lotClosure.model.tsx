import { STATUS } from "./status.model";

export interface lotClosure {
  id: number;
  company: string;
  location: string;
  lotNumber: string;
  status: STATUS;
  totalPOS: number;
  totalClousing: number;
  difference: number;
  employe: string;
}

export interface LotClosureContextType {
  lotsClosure: lotClosure[];
  error: string;
  loading: boolean;
  fetchLotClosureData: (
    dateRange: string,
    locationId: number,
    companyId: number
  ) => Promise<void>;
  updateStatus: (
    lotId: number,
    status: STATUS
  ) => void;
}
