import { useCallback, useEffect, useRef } from "react";
import { useHeaders } from "@context/home/headerContext";
import { useFooter } from "@context/home/footerClousingContext";
import { useCustomerContext } from "@context/clousing/customerClousingContext";
import { CurrencyModel, TotalModel } from "@models/common.clousing.model";
import { CLOUSING_KEY } from "@models/common.const";
import {
  CustomerForm,
  CustomerLines,
  CustomerModel,
} from "@models/customer.model";
import { v4 as uuidv4 } from "uuid";
import { selectOption } from "@models/common.model";
import { useDebounce } from "@hooks/useDebounce";

export const useHandleCustomer = (
  customerData: CustomerModel,
  setCustomer: any,
  clousingId: number
) => {

  const updateTotalRef = useRef(useHeaders().updateTotal);
  const setFooterDataRef = useRef(useFooter().setFooterData);
  const setCustomerDataRef = useRef(useCustomerContext().setCustomerData);

  const customerRef = useRef<CustomerModel>(customerData);

  useEffect(() => {
    customerRef.current = customerData;
  }, [customerData]);

  // const { updateTotal } = useHeaders();
  // const { setFooterData } = useFooter();
  // const { setCustomerData } = useCustomerContext();

  const updateContext = useCallback(() => {
    if(!customerRef.current) return;

    const currentData = customerRef.current;

    const newTotalFisico = currentData.lines.reduce(
      (acc: number, curr: { amountMXN: number }) => acc + curr.amountMXN,
      0
    );
    
    const newDifference = newTotalFisico - currentData.total.totalPOS;

    const newTotal: TotalModel = {
      totalPOS: currentData.total.totalPOS,
      totalPhysical: newTotalFisico > currentData.total.totalPOS ? currentData.total.totalPOS : newTotalFisico,
      difference: newDifference,
      differenceCupons: newTotalFisico > currentData.total.totalPOS ? newDifference : 0
    };

    const updateCustomerData = { ...currentData, total: newTotal };

    customerRef.current = updateCustomerData;

    Promise.all([
      updateTotalRef.current(newTotal.totalPhysical, clousingId, CLOUSING_KEY.CUSTOMER, newTotal.differenceCupons),
      setFooterDataRef.current(newTotal, clousingId, CLOUSING_KEY.CUSTOMER),
      setCustomerDataRef.current(updateCustomerData, clousingId)
    ])

  },[clousingId]);

  const debouncedUpdateContext = useDebounce(
    updateContext,
    300,
    { maxWait: 1500 }
  );

  const selectCurrency = useCallback((
    value: any,
    id: number | string,
    currencies: CurrencyModel[] | undefined
  ) => {
    const selectValue = value[0];
    // const newCurrencyId =
    //   currencies?.filter((item: CurrencyModel) => item.value === selectValue)[0]
    //     ?.value || "";
    // const newCurrency =
    //   currencies?.filter(
    //     (currency: CurrencyModel) => currency.value === selectValue
    //   )[0]?.label || "";
    // const newExchangeRage =
    //   currencies?.filter(
    //     (currency: CurrencyModel) => currency.value === selectValue
    //   )[0]?.exchangeRate || 0;
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

    // Usar debounce en lugar de llamada inmediata
    debouncedUpdateContext();

    // if (!customerData) return;

    // const updatedCurrencies = customerData.lines.map((item: CustomerLines) =>
    //   item.id === id
    //     ? {
    //         ...item,
    //         currency: newCurrencyId.toString(),
    //         currencyId: Number(newCurrencyId),
    //         exchangeRate: newExchangeRage,
    //         currencyLabel: newCurrency,
    //         amountMXN:
    //           item.amount > 0 ? newExchangeRage * item.amount : item.amountMXN,
    //       }
    //     : item
    // );

    // const updateCustomerData = { ...customerData, lines: updatedCurrencies };

    // setCustomer(updateCustomerData);
    // //customerRef.current = updateCustomerData;

    // setCustomerData(customerRef.current, clousingId);
    // updateContext();
  }, [setCustomer, debouncedUpdateContext])

  const handleCoupons = useCallback((id: number | string, value: string) => {
    // value = value.replace(/[^\d.]/g, "");

    // if (!value || isNaN(parseFloat(value))) return;

    // if (!customerData) return;
    const numericValue = parseFloat(value.replace(/[^\d.]/g, ""));

    if (isNaN(numericValue) || numericValue <= 0) return;

    setCustomer((prev: CustomerModel) => {
      if (!prev) return prev;

      const updatedCurrencies = prev.lines.map((item: CustomerLines) =>
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
      
      return {
        ...prev,
        lines: updatedCurrencies
      }
    })


    // customerData.lines = updatedCurrencies;

    // setCustomer({ ...customerData });

    // customerRef.current = customerData;
    debouncedUpdateContext();
    //updateContext();
  },[setCustomer, debouncedUpdateContext])

  const handleAmountPAX = useCallback((id: number | string, value: string) => {
    const numericValue = parseFloat(value.replace(/[^\d.]/g, ""));

    if (isNaN(numericValue) || numericValue <= 0) return;

    //if (!customerData) return;

    setCustomer((prev: CustomerModel) =>{
      if (!prev) return prev;

      const updatedCurrencies = prev.lines.map((item: CustomerLines) =>
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
      return {
        ...prev,
        lines: updatedCurrencies,
      };
    })

    //customerData.lines = updatedCurrencies;

    //setCustomer({ ...customerData });

    //customerRef.current = customerData;
    debouncedUpdateContext();
    //updateContext();
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
    // const updateCustomer = customerData.lines.map(
    //   (item: CustomerLines) =>
    //     item.id === id
    //       ? {
    //           ...item,
    //           idClient: event.value,
    //           nameClient: event.label,
    //         }
    //       : item
    // )
    // customerData.lines = updateCustomer;
    // setCustomer({ ...customerData});
    // //customerRef.current = customerData;
    // setCustomerData(customerRef.current, clousingId);
    // updateContext();
  },[setCustomer, debouncedUpdateContext])

  // function addCustomerRecord(
  //   newCustomer: CustomerForm,
  //   currencies: CurrencyModel[] | undefined
  // ) {
  //   if (!customerData) return;

  //   const currency = currencies?.find(
  //     (item) => item.value === Number(newCustomer.currency)
  //   );
  //   const exchangeRate = currency?.exchangeRate || 1;

  //   const newRecord: CustomerLines = {
  //     id: "customer-" + uuidv4(),
  //     idClient: newCustomer.idClient,
  //     // Generar un ID temporal
  //     currency: currency?.value.toString() || "",
  //     currencyId: Number(currency?.value) || 0,
  //     currencyLabel: currency?.label || "",
  //     exchangeRate,
  //     coupons: newCustomer.coupons,
  //     pax: newCustomer.pax,
  //     amount: newCustomer.coupons * newCustomer.pax,
  //     amountMXN: newCustomer.coupons * newCustomer.pax * exchangeRate,
  //     nameClient: newCustomer.nameClient,
  //   };

  //   const updatedCustomerData = {
  //     ...customerData,
  //     lines: [...customerData.lines, newRecord],
  //   };

  //   setCustomer(updatedCustomerData);

  //   //customerRef.current = updatedCustomerData;

  //   setCustomerData(updatedCustomerData, clousingId);

  //   updateContext();
  // }

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
        lines: [...prev.lines, newRecord],
      };
    });

    // Usar debounce también para agregar registros
    debouncedUpdateContext();
  }, [setCustomer, debouncedUpdateContext])

  return { selectCurrency, handleCoupons, handleAmountPAX, addCustomerRecord, handleChangeCustomer, updateContext };
};
