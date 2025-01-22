import { useFooter } from "@context/clousing/footerClousingContext";
import { useHeaders } from "@context/clousing/headerContext";
import { CurrencyModel, TotalModel } from "@models/common.clousing.model";
import { CLOUSING_KEY } from "@models/constants.model";
import { CustomerLines } from "@models/customer.model";


export const useHandleCustomer = (customerData: any, setCustomerData: any) => {
  
    const headerContext = useHeaders();
  const footerContext = useFooter();
  if (!headerContext) {
    return null;
  }
  if (!footerContext) {
    return null;
  }
  const { updateTotal } = headerContext;
  const { setFooterData } = footerContext;

  function selectCurrency(value: any, id: number, currencies:CurrencyModel[] | undefined) {
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
            amountMXN:
              item.amount > 0 ? newExchangeRage * item.amount : item.amountMXN,
          }
        : item
    );

    setCustomerData({ ...customerData, lines: updatedCurrencies });
  }

  function handleCoupons(id:number, value:string){

    value = value.replace(/[^\d.]/g, "");
    
    if (!customerData) return;

    const updatedCurrencies = customerData.lines.map((item: CustomerLines) =>
      item.id === id
        ? {
            ...item,
            coupons: parseFloat(value),
            amount: item.valuePAX > 0 
              ? (parseFloat(value) * item.valuePAX)
              : item.amount,
            amountMXN: item.valuePAX > 0 && item.exchangeRate > 0
              ? ((parseFloat(value) * item.valuePAX) * item.exchangeRate)
              : item.amountMXN,
          }
        : item
    );

    customerData.lines = updatedCurrencies;

    updateContext(updatedCurrencies);

    setCustomerData({...customerData});

  }

  function handleAmountPAX(id:number, value:string){

    value = value.replace(/[^\d.]/g, "");
  
    if (!customerData) return;
  
    const updatedCurrencies = customerData.lines.map((item: CustomerLines) =>
      item.id === id
        ? {
            ...item,
            valuePAX: parseFloat(value),
            amount: item.coupons > 0 
              ? (parseFloat(value) * item.coupons)
              : item.amount,
            amountMXN: item.coupons > 0 && item.exchangeRate > 0
              ? ((parseFloat(value) * item.coupons) * item.exchangeRate)
              : item.amountMXN,
          }
        : item
    );
  
    customerData.lines = updatedCurrencies;

    updateContext(updatedCurrencies);

    setCustomerData({ ...customerData });

  }

  function updateContext(updatedCurrencies: CustomerLines[]){

    const newTotalFisico = updatedCurrencies.reduce(
        (acc: number, curr: { amountMXN: number; }) => acc + curr.amountMXN,
        0
      );  

    const newDifference = customerData.total.totalPOS - newTotalFisico;

    const newTotal: TotalModel = {
      totalPOS: customerData.total.totalPOS,
      totalPhysical: newTotalFisico,
      difference: newDifference,
    };

    //updateTotal(newTotalFisico, newDifference, customerData.employeId, CLOUSING_KEY.CUSTOMER);

    setFooterData(newTotal, customerData.id, "customers");

  }

  return { selectCurrency, handleCoupons, handleAmountPAX }
};