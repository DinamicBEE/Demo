import { TotalModel } from "./common.clousing.model";

export interface PrepaidContextType {
  prepaid: PrepaidModel | {};
  prepaidLoading: boolean;
  error: string;
  getPrepaidData: (
    clousingId: number,
    dateClousing: string
  ) => Promise<PrepaidModel>;
  getCouponData: (
    clousingId: number,
    dateClousing: string
  ) => Promise<CouponCatalogModel[]>;
  setPrepaidData: (clousingId: number, prepaid: PrepaidModel) => void;
  setCoupons: React.Dispatch<React.SetStateAction<CouponContext>>;
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
  client: string | null;
  quantity: number;
  supplementsQuantity: number;
  unitPrice: number;
  totalPOS: number;
  physical: number;
  difference: number;
  isEdit: boolean; // TODO isEdit
  coupons: CouponCatalogModel[];
  ticketId: number;
}

export interface CouponCatalogModel {
  id: number;
  barCode: string;
  folio: string;
  folioCustom: string;
  amount: number;
  validityDate: string;
  validityDateCustom: string;
  consumeCenterId: number;
  consumeCenter: string;
  client: string;
  clientCustom: string;
  clientId: null | number;
  isExpired: boolean;
}

export interface DialogCouponsProps {
  isOpen: boolean;
  onClose: () => void;
  coupons: CouponCatalogModel[];
  client: string;
}
