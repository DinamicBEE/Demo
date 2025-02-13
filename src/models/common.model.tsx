export interface CurrencyInputProps {
  value: number | undefined;
  loading: boolean;
  name?: string;
  onChange?: (value: string) => void;
}

export interface TableInputProps {
  value: number;
  id: number;
  keyValue?: string;
  currency: boolean;
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