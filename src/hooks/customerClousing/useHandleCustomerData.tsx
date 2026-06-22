import { useCallback, useEffect, useRef } from "react";
import { useHeaders } from "@context/home/headerContext";
import { useFooter } from "@context/home/footerClousingContext";
import { useCustomerContext } from "@context/clousing/customerClousingContext";
import { CurrencyModel, TotalModel } from "@models/common.clousing.model";
import { CLOUSING_KEY } from "@models/common.const";
import { CustomerForm, CustomerLines, CustomerModel } from "@models/customer.model";
import { v4 as uuidv4 } from "uuid";
import { selectOption } from "@models/common.model";
import { useDebounce } from "@hooks/useDebounce";

export const useHandleCustomer = (
  customerData: CustomerModel,
  setCustomer: React.Dispatch<React.SetStateAction<CustomerModel>>,
  clousingId: number
) => {

  const updateTotalRef = useRef(useHeaders().updateTotal);
  const setFooterDataRef = useRef(useFooter().setFooterData);
  const setCustomerDataRef = useRef(useCustomerContext().setCustomerData);

  const customerRef = useRef<CustomerModel>(customerData);

  useEffect(() => {    
    customerRef.current = customerData;
  }, [customerData]);

  const handleDeleteCustomer = (index: number) => {
    const newArray = customerData.lines.filter((_, i) => i !== index);    
    customerRef.current = { ...customerData, lines: newArray };
    debouncedUpdateContext();
  }

  const updateContext = useCallback(() => {
    if(!customerData) return;    

    const currentData = customerRef.current;

    const newTotalFisico = currentData?.lines.reduce(
      (acc: number, curr: { amountMXN: number }) => acc + (curr.amountMXN || 0),
      0
    ) || 0;
    
    const newDifference = newTotalFisico - (currentData.total?.totalPOS || 0);

    const newTotal: TotalModel = {
      totalPOS: (currentData.total?.totalPOS || 0),
      totalPhysical: newTotalFisico > (currentData.total?.totalPOS || 0) ? (currentData.total?.totalPOS || 0) : newTotalFisico,
      difference: newDifference,
      differenceCupons: newTotalFisico > (currentData.total?.totalPOS || 0) ? newDifference : 0
    };    

    const updateCustomerData = { ...currentData, total: newTotal };
    customerRef.current = updateCustomerData;
    setCustomer(updateCustomerData);
    

    Promise.all([
      updateTotalRef.current(newTotal.totalPhysical, clousingId, CLOUSING_KEY.CUSTOMER, newTotal.differenceCupons),
      setFooterDataRef.current(newTotal, clousingId, CLOUSING_KEY.CUSTOMER),
      setCustomerDataRef.current(updateCustomerData, clousingId)
    ]).then(() => {
      
    })

  },[clousingId]);

  const debouncedUpdateContext = useDebounce(
    updateContext,
    300,
    { maxWait: 1500 }
  );

  const selectCurrency = useCallback((
    value: string[],
    id: number | string,
    currencies: CurrencyModel[] | undefined
  ) => {
    const selectValue = Number(value[0]);
    const currency = currencies?.find(
      (item: CurrencyModel) => item.value === selectValue
    );
    
    const newCurrencyId = currency?.value || "";
    const newCurrency = currency?.label || "";
    const newExchangeRage = currency?.exchangeRate || 0;
    
    setCustomer((prev: CustomerModel) => {
      if (!prev) return prev;

      const updatedCurrencies = prev.lines.map((item: CustomerLines) =>
        item.id === id
          ? {
              ...item,
              currency: newCurrencyId.toString(),
              currencyId: Number(newCurrencyId),
              exchangeRate: newExchangeRage,
              currencyLabel: newCurrency,
              amountMXN:
                item.amount > 0 
                  ? newExchangeRage * item.amount 
                  : item.amountMXN,
            }
          : item
      );

      return {
        ...prev,
        lines: updatedCurrencies,
      };
    });

    debouncedUpdateContext();
  }, [setCustomer, debouncedUpdateContext])

  const handleCoupons = useCallback((id: number | string, value: string) => {

    const numericValue = Number(parseFloat(value.replace(/[^\d.]/g, "")).toFixed(2));
    
    if (isNaN(numericValue) || numericValue <= 0) return;

    setCustomer((prev: CustomerModel) => {
      if (!prev) return prev;

      const updatedCurrencies = prev.lines.map((item: CustomerLines) =>
        item.id === id
          ? {
              ...item,
              coupons: numericValue,
              amount: item.pax > 0 ? numericValue * item.pax : item.amount,
              amountMXN:
                item.pax > 0 && item.exchangeRate > 0
                  ? numericValue * item.pax * item.exchangeRate
                  : item.amountMXN,
            }
          : item
      );
      
      return {
        ...prev,
        lines: updatedCurrencies
      }
    })

    debouncedUpdateContext();

  },[setCustomer, debouncedUpdateContext])

  const handleAmountPAX = useCallback((id: number | string, value: string) => {
    const numericValue = Number(parseFloat(value.replace(/[^\d.]/g, "")).toFixed(2));

    if (isNaN(numericValue) || numericValue <= 0) return;

    setCustomer((prev: CustomerModel) =>{
      if (!prev) return prev;

      const updatedCurrencies = prev.lines.map((item: CustomerLines) =>
        item.id === id
          ? {
              ...item,
              pax: numericValue,
              amount:
                item.coupons > 0 ? numericValue * item.coupons : item.amount,
              amountMXN:
                item.coupons > 0 && item.exchangeRate > 0
                  ? numericValue * item.coupons * item.exchangeRate
                  : item.amountMXN,
            }
          : item
      );
      return {
        ...prev,
        lines: updatedCurrencies,
      };
    })

    debouncedUpdateContext();

  },[setCustomer, debouncedUpdateContext])

  const handleChangeCustomer = useCallback(( event: selectOption, id: number | string) => {
    
    setCustomer((prev: CustomerModel) => {
      if (!prev) return prev;

      const updatedCustomer = prev.lines.map((item: CustomerLines) =>
        item.id === id
          ? {
              ...item,
              idClient: event.value,
              nameClient: event.label,
            }
          : item
      );
      
      return {
        ...prev,
        lines: updatedCustomer,
      };
    });

    debouncedUpdateContext();
  },[setCustomer, debouncedUpdateContext])

  const addCustomerRecord = useCallback((
    newCustomer: CustomerForm,
    currencies: CurrencyModel[] | undefined
  ) => {
    setCustomer((prev: CustomerModel) => {
      if (!prev) return prev;

      const currency = currencies?.find(
        (item) => item.value === Number(newCustomer.currency)
      );
      const exchangeRate = currency?.exchangeRate || 1;

      const newRecord: CustomerLines = {
        id: "customer-" + uuidv4(),
        idClient: newCustomer.idClient,
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

      return {
        ...prev,
        lines: prev.lines !== undefined && prev.lines.length > 0
          ?[...prev.lines, newRecord]
          : [newRecord],
      };
    });

    debouncedUpdateContext();
  }, [setCustomer, debouncedUpdateContext])

  return { selectCurrency, handleCoupons, handleAmountPAX, addCustomerRecord, handleChangeCustomer, updateContext, handleDeleteCustomer };
};