export interface CurrencyInputProps {
  value: number | undefined;
  loading: boolean;
  name?: string;
  onChange?: (value: string) => void;
}

export interface TableInputProps {
  value: number;
  id: number;
  key?: string;
  currency: boolean;
  onChange?: (id: number, eventValue: string, key?:string) => void;
}
