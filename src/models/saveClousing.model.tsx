import { Currency } from "./common.clousing.model";
import { CouponCatalogModel } from "./prepaid.model";

// Interfaces base para tipos comunes
interface Total {
  totalPOS: number;
  totalPhysical: number;
  difference: number;
  diferenciaCupones?: number;
}

interface LineBase {
  id: number | null;
}

// Interfaces específicas por sección
interface CashLine extends LineBase {
  currency: string;
  totalPOS: number;
  totalFisico: number;
  difference: number;
  exchangeRate: number;
  originalCurrency: number;
  idCurrency: number;
  denominations: denomination[];
}

interface denomination {
  id: number | null;
  idDenomination: number;
  denomination:number;
  amount: number;
}

interface Cash {
  idCurrencySub: number;
  electronicTips: number;
  lines: CashLine[];
  total: Total;
  tips: number;
}

interface TDCLine extends LineBase {
  bank: string;
  idBank: number;
  POS: number;
  physical: number;
  voucherAmount: number;
  vouchers: {
    id: number;
    date: string;
    check: string;
    amount: number;
    status: boolean;
    uniqueIdVoucher: number;
    amountConversion: number;
  }[];
}

interface TDC {
  idCurrencySub: number;
  total: Total;
  lines: TDCLine[];
}


interface CustomerLine extends LineBase {
  customers: string;
  coupons: number;
  currency: number;
  valuePAX: number;
  amount: number;
  exchangeRate: number;
  amountMXN: number;
}

interface Customer {
  total: Total;
  lines: CustomerLine[];
}

interface SpecialCustomerLine extends LineBase {
  guestCheckId: number;
  Check: number;
  consumption: number;
  priceCuopon: number;
  difference: number;
  exchangeRate: number;
  client: string;
  pax: number;
  folioCuopon: string;
  folioCuoponUSD: string;
  value: number;
  valueUSD: number;
  flight: string;
  passengerName: string;
  amountMXN: number;
}

interface SpecialCustomer {
  total: Total;
  lines: SpecialCustomerLine[];
}

interface EmployeeLine extends LineBase {
  employeeId: number;
  amount: number;
  reasonId: number;
  ticketId: number | null;
  externalId?: number;
}

interface Employee {
  total: Total;
  lines: EmployeeLine[];
}

interface PrepaidLine extends LineBase {
  client: string | null;
  quantity: number;
  supplementsQuantity: number;
  unitPrice: number;
  totalPOS: number;
  physical: number;
  difference: number;
  isEdit: boolean;
  coupons: Omit<CouponCatalogModel, "validityDateCustom" | "folioCustom" | "clientCustom">[];
  ticketId: number;

}

interface Prepaid {
  total: Total;
  lines: PrepaidLine[];
}

interface IntercompanyLine extends LineBase {
  employeeId: number;
  employeeName: string;
  subsidiaryId: number;
  subsidiaryName: string;
  amount: number;
  ticket: string;
  physicalAmount: number;
}

interface Intercompany {
  total: Total;
  lines: IntercompanyLine[];
}

// Interface principal que agrupa todo
export interface ClousingSave {
  id: number;
  statusId: number;
  discountPhysical: number,
  cash: Cash;
  tdc: TDC;
  customer: Customer;
  specialCustomer: SpecialCustomer;
  employee: Employee;
  prepaid: Prepaid;
  //intercompany: Intercompany;
  currencies: Currency[];
}
