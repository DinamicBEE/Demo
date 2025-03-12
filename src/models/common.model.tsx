import { ReactNode } from "react";

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
  currency?: boolean
}

export interface TableInputProps {
  value: number;
  id: number;
  keyValue?: string;
  currency: boolean;
  disabled?: boolean;
  onChange?: (id: number, eventValue: string, key?:string) => void;
}

export interface SubsidiaryModal {
  id: number;
  name: string;
}

export interface StoreModel {
  id: number;
  name: string;
  subsidiary: SubsidiaryModal;
}

export interface ListContextType {
  error: string;
  getSubsidiariesData: () => Promise<SubsidiaryModal[]>;
  getStoresData: () => Promise<StoreModel[]>;
}

export interface ErrorDialogContextType {
  isOpen: boolean;
  errorMessage: string;
  showErrorDialog: (message: string) => void;
  closeErrorDialog: () => void;
}