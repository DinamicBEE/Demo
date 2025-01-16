export interface HeaderClousingProps {
  id: number;
  employe: string;
}

export interface HeaderData {
  cdc?: string;
  location?: string;
  subsidiary?: string;
  date?: string;
  totalPOS?: string;
  totalClousing?: string;
  difference?: string;
  service?: string;
  discountPOS?: string;
  discountClousing?: string;
}

export interface FooterClousing {
  data: ClousingTotals;
  loading: boolean;
  onChange: () => Promise<boolean>;
}

export interface ClousingTotals {
  globalTotalPOS: number;
  globalTotalFisico: number;
  globalDifference: number;
}

export interface TotalModel {
  totalPOS: number;
  totalPhysical: number;
  difference: number;
}

export interface CurrencyModel {
  label: string;
  value: number;
  exchangeRate: number;
}