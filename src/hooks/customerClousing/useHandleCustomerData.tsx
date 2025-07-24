import { useRef } from "react";
import { useHeaders } from "@context/home/headerContext";
import { useFooter } from "@context/home/footerClousingContext";
import { useCustomerContext } from "@context/clousing/customerClousingContext";
import { CurrencyModel, TotalModel } from "@models/common.clousing.model";
import { CLOUSING_KEY } from "@models/constants.model";
import {
  CustomerForm,
  CustomerLines,
  CustomerModel,
} from "@models/customer.model";
import { v4 as uuidv4 } from "uuid";

export const useHandleCustomer = (
  customerData: CustomerModel,
  setCustomer: any,
  clousingId: number
) => {
  const customerRef = useRef(customerData);

  const { updateTotal } = useHeaders();
  const { setFooterData } = useFooter();
  const { setCustomerData } = useCustomerContext();

  function selectCurrency(
    value: any,
    id: number | string,
    currencies: CurrencyModel[] | undefined
  ) {
    const selectValue = value[0];
    const newCurrencyId =
      currencies?.filter((item: CurrencyModel) => item.value === selectValue)[0]
        ?.value || "";
    const newCurrency =
      currencies?.filter(
        (currency: CurrencyModel) => currency.value === selectValue
      )[0]?.label || "";
    const newExchangeRage =
      currencies?.filter(
        (currency: CurrencyModel) => currency.value === selectValue
      )[0]?.exchangeRate || 0;

    if (!customerData) return;

    const updatedCurrencies = customerData.lines.map((item: CustomerLines) =>
      item.id === id
        ? {
            ...item,
            currency: newCurrencyId.toString(),
            currencyId: Number(newCurrencyId),
            exchangeRate: newExchangeRage,
            currencyLabel: newCurrency,
            amountMXN:
              item.amount > 0 ? newExchangeRage * item.amount : item.amountMXN,
          }
        : item
    );

    const updateCustomerData = { ...customerData, lines: updatedCurrencies };

    setCustomer(updateCustomerData);
    customerRef.current = updateCustomerData;

    setCustomerData(customerRef.current, clousingId);
    updateContext(updatedCurrencies);
  }

  function handleCoupons(id: number | string, value: string) {
    value = value.replace(/[^\d.]/g, "");

    if (!value || isNaN(parseFloat(value))) return;

    if (!customerData) return;

    const updatedCurrencies = customerData.lines.map((item: CustomerLines) =>
      item.id === id
        ? {
            ...item,
            coupons: parseFloat(value),
            amount: item.pax > 0 ? parseFloat(value) * item.pax : item.amount,
            amountMXN:
              item.pax > 0 && item.exchangeRate > 0
                ? parseFloat(value) * item.pax * item.exchangeRate
                : item.amountMXN,
          }
        : item
    );

    customerData.lines = updatedCurrencies;

    setCustomer({ ...customerData });

    customerRef.current = customerData;

    updateContext(updatedCurrencies);
  }

  function handleAmountPAX(id: number | string, value: string) {
    value = value.replace(/[^\d.]/g, "");

    if (!value || isNaN(parseFloat(value))) return;

    if (!customerData) return;

    const updatedCurrencies = customerData.lines.map((item: CustomerLines) =>
      item.id === id
        ? {
            ...item,
            pax: parseFloat(value),
            amount:
              item.coupons > 0 ? parseFloat(value) * item.coupons : item.amount,
            amountMXN:
              item.coupons > 0 && item.exchangeRate > 0
                ? parseFloat(value) * item.coupons * item.exchangeRate
                : item.amountMXN,
          }
        : item
    );

    customerData.lines = updatedCurrencies;

    setCustomer({ ...customerData });

    customerRef.current = customerData;

    updateContext(updatedCurrencies);
  }

  function addCustomerRecord(
    newCustomer: CustomerForm,
    currencies: CurrencyModel[] | undefined
  ) {
    if (!customerData) return;

    const currency = currencies?.find(
      (item) => item.value === Number(newCustomer.currency)
    );
    const exchangeRate = currency?.exchangeRate || 1;

    const newRecord: CustomerLines = {
      id: "customer-" + uuidv4(),
      // Generar un ID temporal
      currency: currency?.value.toString() || "",
      currencyId: Number(currency?.value) || 0,
      currencyLabel: currency?.label || "",
      exchangeRate,
      coupons: newCustomer.coupons,
      pax: newCustomer.pax,
      amount: newCustomer.coupons * newCustomer.pax,
      amountMXN: newCustomer.coupons * newCustomer.pax * exchangeRate,
      nameClient: newCustomer.nameClient,
    };

    const updatedCustomerData = {
      ...customerData,
      lines: [...customerData.lines, newRecord],
    };

    setCustomer(updatedCustomerData);

    customerRef.current = updatedCustomerData;

    setCustomerData(updatedCustomerData, clousingId);

    updateContext(updatedCustomerData.lines);
  }

  function updateContext(updatedCurrencies: CustomerLines[]) {
    const newTotalFisico = updatedCurrencies.reduce(
      (acc: number, curr: { amountMXN: number }) => acc + curr.amountMXN,
      0
    );
    const newDifference = newTotalFisico - customerData.total.totalPOS;

    const newTotal: TotalModel = {
      totalPOS: customerData.total.totalPOS,
      totalPhysical: newTotalFisico,
      difference: newDifference,
    };

    const updateCustomerData = { ...customerRef.current, total: newTotal };

    if (newTotalFisico > 0) {
      if(newTotalFisico > newTotal.totalPOS) {
        updateTotal(newTotal.totalPOS, clousingId, CLOUSING_KEY.CUSTOMER);
      } else {
        updateTotal(newTotalFisico, clousingId, CLOUSING_KEY.CUSTOMER);
      }
    }

    setFooterData(newTotal, clousingId, CLOUSING_KEY.CUSTOMER);

    setCustomerData(updateCustomerData, clousingId);
  }

  return { selectCurrency, handleCoupons, handleAmountPAX, addCustomerRecord };
};
