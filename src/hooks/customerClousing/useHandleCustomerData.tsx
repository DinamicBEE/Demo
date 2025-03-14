import { useRef } from "react";
import { useHeaders } from "@context/home/headerContext";
import { useFooter } from "@context/home/footerClousingContext";
import { useCustomerContext } from "@context/clousing/customerClousingContext";
import { CurrencyModel, TotalModel } from "@models/common.clousing.model";
import { CLOUSING_KEY } from "@models/constants.model";
import { CustomerForm, CustomerLines, CustomerModel } from "@models/customer.model";


export const useHandleCustomer = (customerData: CustomerModel, setCustomer: any, clousingId: number) => {

  const customerRef = useRef(customerData);

  const { updateTotal } = useHeaders();
  const { setFooterData } = useFooter();
  const { setCustomerData } = useCustomerContext();

  function selectCurrency(value: any, id: number, currencies: CurrencyModel[] | undefined) {

    const selectValue = value[0];
    const newCurrency = currencies?.filter((item: CurrencyModel) => item.value === selectValue)[0]?.label || "";
    const newExchangeRage = currencies?.filter((currency: CurrencyModel) => currency.value === selectValue)[0]?.exchangeRate || 0;

    if (!customerData) return;

    const updatedCurrencies = customerData.lines.map((item: CustomerLines) =>
      item.id === id
        ? {
          ...item,
          currency: newCurrency,
          exchangeRate: newExchangeRage,
          amountMXN: item.amount > 0 ? newExchangeRage * item.amount : item.amountMXN,
        }
        : item
    );

    const updateCustomerData = { ...customerData, lines: updatedCurrencies }

    setCustomer(updateCustomerData);
    customerRef.current = updateCustomerData;

    setCustomerData(customerRef.current, clousingId)
  }

  function handleCoupons(id: number, value: string) {

    value = value.replace(/[^\d.]/g, "");

    if (!customerData) return;

    const updatedCurrencies = customerData.lines.map((item: CustomerLines) =>
      item.id === id
        ? {
          ...item,
          coupons: parseFloat(value),
          amount: item.valuePAX > 0 ? (parseFloat(value) * item.valuePAX) : item.amount,
          amountMXN: item.valuePAX > 0 && item.exchangeRate > 0 ? ((parseFloat(value) * item.valuePAX) * item.exchangeRate) : item.amountMXN,
        }
        : item
    );

    customerData.lines = updatedCurrencies;

    setCustomer({ ...customerData });

    customerRef.current = customerData;

    updateContext(updatedCurrencies);
  }

  function handleAmountPAX(id: number, value: string) {

    value = value.replace(/[^\d.]/g, "");

    if (!customerData) return;

    const updatedCurrencies = customerData.lines.map((item: CustomerLines) =>
      item.id === id
        ? {
          ...item,
          valuePAX: parseFloat(value),
          amount: item.coupons > 0 ? (parseFloat(value) * item.coupons) : item.amount,
          amountMXN: item.coupons > 0 && item.exchangeRate > 0 ? ((parseFloat(value) * item.coupons) * item.exchangeRate) : item.amountMXN,
        }
        : item
    );

    customerData.lines = updatedCurrencies;

    setCustomer({ ...customerData });

    customerRef.current = customerData;

    updateContext(updatedCurrencies);
  }

  function addCustomerRecord(newCustomer: CustomerForm, currencies: CurrencyModel[] | undefined) {

    if (!customerData) return;

    const currency = currencies?.find((item) => item.value === Number(newCustomer.currency));
    const exchangeRate = currency?.exchangeRate || 1;

    const newRecord: CustomerLines = {
      id: Date.now(), // Generar un ID temporal
      currency: currency?.label || "",
      exchangeRate,
      coupons: newCustomer.coupons,
      valuePAX: newCustomer.valuePax,
      amount: newCustomer.coupons * newCustomer.valuePax,
      amountMXN: newCustomer.coupons * newCustomer.valuePax * exchangeRate,
      customers: newCustomer.customerName
    };

    const updatedCustomerData = { ...customerData, lines: [...customerData.lines, newRecord], };

    setCustomer(updatedCustomerData);

    customerRef.current = updatedCustomerData;

    setCustomerData(updatedCustomerData, clousingId);

    updateContext(updatedCustomerData.lines);
  }

  function updateContext(updatedCurrencies: CustomerLines[]) {

    const newTotalFisico = updatedCurrencies.reduce((acc: number, curr: { amountMXN: number; }) => acc + curr.amountMXN, 0);
    const newDifference = customerData.total.totalPOS - newTotalFisico;

    const newTotal: TotalModel = {
      totalPOS: customerData.total.totalPOS,
      totalPhysical: newTotalFisico,
      difference: newDifference,
    };

    const updateCustomerData = { ...customerRef.current, total: newTotal }

    if (newTotalFisico > 0) {
      updateTotal(newTotalFisico, clousingId, CLOUSING_KEY.CUSTOMER);
    }

    setFooterData(newTotal, clousingId, CLOUSING_KEY.CUSTOMER);

    setCustomerData(updateCustomerData, clousingId);

  }

  return { selectCurrency, handleCoupons, handleAmountPAX, addCustomerRecord }
};