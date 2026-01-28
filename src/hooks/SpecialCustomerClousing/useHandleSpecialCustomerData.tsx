import { useCallback, useEffect, useRef } from "react";
import { useHeaders } from "@context/home/headerContext";
import { useFooter } from "@context/home/footerClousingContext";
import { useSpecialCustContext } from "@context/clousing/specialCustClousingContext";
import { SpecialCustomerLines, SpecialCustomerModel } from "@models/specialCustome.model";
import { TotalModel } from "@models/common.clousing.model";
import { CLOUSING_KEY } from "@models/common.const";
import { useDebounce } from "@hooks/useDebounce";

export const useHandleSpecialCustomer = (specialCustomerData: SpecialCustomerModel, setSpecialCustomer: any, clousingId: number) =>{

  const specialCustRef = useRef(specialCustomerData);

  useEffect(() => {
    specialCustRef.current = specialCustomerData;
  }, [specialCustomerData]);

  const { updateTotal } = useHeaders();
  const { setFooterData } = useFooter();
  const { setSpecialCustData } = useSpecialCustContext();

  const updateContext = useCallback (() => {
    if (!specialCustRef.current) return;

    const specialCustomerData = specialCustRef.current;
    
    const newTotalFisico: number = specialCustomerData.lines.reduce(
        (acc: number, curr: { bill: number; }) => Number(acc) + Number(curr.bill),//Number(curr.ammountMXN),
        0
    );
      
    const newDifference = newTotalFisico - specialCustomerData.total.totalPOS;

    const newTotal: TotalModel = {
      totalPOS: specialCustomerData.total.totalPOS,
      totalPhysical: newTotalFisico,
      difference: newDifference,
    };

    const updateCustomerData ={
      ...specialCustRef.current,
      total: newTotal
    }

    Promise.all([
      updateTotal(newTotalFisico, clousingId, CLOUSING_KEY.SPECIALCUSTOMER),
      setFooterData(newTotal, clousingId, CLOUSING_KEY.SPECIALCUSTOMER),
      setSpecialCustData(updateCustomerData, clousingId)
    ]);

  }, []);//specialCustomerData, clousingId, updateTotal, setFooterData, setSpecialCustData
  
  const debouncedUpdateContext = useDebounce(
    updateContext,
    100,
    { maxWait: 1000 }
  );

  const handleInputTextData = useCallback((value: string, id: number | string, key: string, clientId?: number) => {
    
    setSpecialCustomer((prev:any) => {
      if (!prev) return prev;
      
      const updatedLines = prev.lines.map((item: SpecialCustomerLines) =>
        item.id === id
          ? {
              ...item,
              [key]: value,
              ...(clientId !== undefined && { clientId }),
            }
          : item
      );

      return {
        ...prev,
        lines: updatedLines,
      };
    });

    debouncedUpdateContext();
  
  }, [setSpecialCustomer,  debouncedUpdateContext]);

  const handleUpdateAmountMXN = useCallback((id: number | string, value: string, key?: string) => {
    const numericValue = parseFloat(value.replace(/[^\d.]/g, ""));
    
    if (isNaN(numericValue) || numericValue <= 0) return;

    setSpecialCustomer((prev:any) => {
      if (!prev) return prev;
      
      const itemToUpdate = prev.lines.find((item:any) => item.id === id);
      if (!itemToUpdate) return prev;

      let newValue = 0;
      let newValueUSD = 0;
      let newAmount = 0;

      if (key === "ammount") {
        newValue = numericValue;
        newValueUSD = 0;
        newAmount = numericValue;
      } else {
        newValue = 0;
        newValueUSD = numericValue;
        newAmount = numericValue * itemToUpdate.exchangeRate;
      }

      const updatedLines = prev.lines.map((item: SpecialCustomerLines) =>
        item.id === id
          ? {
              ...item,
              ammount: newValue,
              ammountUSD: newValueUSD,
              ammountMXN: newAmount,
              couponPrice: newAmount,
              difference: newAmount - item.bill,
            }
          : item
      );

      return {
        ...prev,
        lines: updatedLines,
      };
    });

    debouncedUpdateContext();
  
  }, []);//setSpecialCustomer, debouncedUpdateContext

  return {handleInputTextData, handleUpdateAmountMXN}
}