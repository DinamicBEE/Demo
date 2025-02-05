export interface CurrencyInputProps {
  value: number;
  loading: boolean;
  name?: string;
  onChange?: (value: string) => void;
}

export interface TableInputProps {
  value: number;
  id: number;
  currency: boolean;
  onChange?: (id: number, eventValue: string) => void;
}
