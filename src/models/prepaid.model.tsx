import { TotalModel } from "./common.clousing.model";

export interface PrepaidContextType {
  prepaid: PrepaidModel | {};
  prepaidLoading: boolean;
  error: string;
  getPrepaidData: (clousingId: number) => Promise<PrepaidModel>;
  getCouponData: (clousingId: number) => Promise<CouponCatalogModel[]>;
  setPrepaidData: (clousingId: number, prepaid: PrepaidModel) => void;
  prepaidRef: React.MutableRefObject<PrepaidContext>;
}

export interface PrepaidContext {
  [key: number]: PrepaidModel;
}

export interface CouponContext {
  [key: number]: CouponCatalogModel[];
}

export interface PrepaidModel {
  id: number;
  employeeId: number;
  total: TotalModel;
  lines: PrepaidLineModel[];
}

export interface PrepaidLineModel {
  id: number | string;
  client: string;
  quantity: number;
  supplementsQuantity: number;
  unitPrice: number;
  totalPOS: number;
  physical: number;
  difference: number;
  isEdit?: boolean;
}

export interface CouponCatalogModel {
  lineId: number;
  folio: string;
  quantity: number;
  unitPrice: number;
  isUsed: boolean;
}
