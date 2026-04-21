import { ReactNode } from "react";
import { ReportClousingLinesModel } from "./common.clousing.model";

export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export interface UserContextType {
  user: any; // ! Modelo de datos del usuario
  loading: boolean;
  setLoading: (loading: boolean) => void;
  fetchUser: (currentToken: string) => Promise<any>; // ! Modelo de datos del usuario
}

export interface CurrencyInputProps {
  value: number | undefined;
  loading: boolean;
  name?: string;
  onChange?: (value: string) => void;
  currency?: boolean;
  disabled?: boolean;
}

export interface TableInputProps {
  value: number;
  id: number | string;
  keyValue?: string;
  currency: boolean;
  disabled?: boolean;
  onChange?: (id: number | string, eventValue: string, key?: string) => void;
}

export interface SubsidiaryModal {
  id: number;
  name: string;
  idCurrency: number;
}

export interface location {
  id: number;
  name: string;
}

export interface StoreModel {
  id: number;
  name: string;
  subsidiary: number;
}

export interface ListContextType {
  error: string;
  subsidiaries: SubsidiaryModal[];
  stores: StoreModel[];
  getSubsidiariesData: () => Promise<SubsidiaryModal[]>;
  getStoresData: (subId: number) => Promise<StoreModel[]>;
}

export interface ErrorDialogContextType {
  isOpen: boolean;
  errorMessage: string;
  showErrorDialog: (message: string) => void;
  closeErrorDialog: () => void;
}

export interface selectOption {
  value: number; 
  label: string;
  idCurrency?: number;
}

export interface ParametersSelectedModel {
  country: selectOption;
  subsidiaries: selectOption[];
  zone: selectOption[];
  cdc: selectOption[];
  status: selectOption[];
  date?: string;
}

export interface ComboBoxCustomProps {
    multiple: boolean;
    options: selectOption[];
    label: string;
    onValueChange: (ids: string[]) => void;
    selectedValues: string[];
    disableCondition: boolean;
}
export interface HeadersModel {
  label: string;
  key: string;
}

export interface TableDataModel {
  headers: HeadersModel[]
  data: ReportClousingLinesModel[]
}

export interface JobResponse {
  jobId: string;
  status: string;
  message: string;
  alreadyRunning: boolean;
}

export interface JobStatus {
  jobId: string;
  status: 'RUNNING' | 'SUCCESS' | 'FAILED';
  progress: number;
  message: string;
  result?: any;
  error?: string;
}

// export interface JobPayload {
//   jobType: string;
//   parameters: Record<string, any>;
// }

export interface JobPayload {
    startDate: Date;
    endDate: Date;
    revenueId: number;
}
