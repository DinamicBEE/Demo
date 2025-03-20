import { ReactNode } from "react";

export interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: number[];
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
