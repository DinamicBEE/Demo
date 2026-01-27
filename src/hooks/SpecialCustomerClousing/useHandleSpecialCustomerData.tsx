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

    const { updateTotal } = useHeaders();
    const { setFooterData } = useFooter();
    const { setSpecialCustData } = useSpecialCustContext();

    // const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // const executeDebouncedUpdate = useCallback((time:number) => {
    //   if (updateTimeoutRef.current) {
    //     clearTimeout(updateTimeoutRef.current);
    //   }
      
    //   updateTimeoutRef.current = setTimeout(() => {
    //     updateContext();
    //   }, time);
    // }, []);

    // function handleInputTextData(value: string, id: number | string, key: string, clientId?: number) {
    //   //console.log("handleInputTextData", value, id, key);
      
    //   const updatedCurrencies = specialCustomerData.lines.map((item: SpecialCustomerLines) =>
    //     item.id === id
    //       ? {
    //           ...item,
    //           [key]: value,
    //           clientId: clientId ?? item.clientId,
    //         }
    //       : item
    //   );

    //   setSpecialCustomer({
    //     ...specialCustomerData,
    //     lines: updatedCurrencies,
    //   });
    //   specialCustRef.current = {
    //     ...specialCustomerData,
    //     lines: updatedCurrencies,
    //   }    
      
    //   setSpecialCustData(specialCustRef.current, clousingId);

    // }

        const updateContext = useCallback (() => {
      if (!specialCustomerData) return;

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
    

    }, [specialCustomerData, clousingId, updateTotal, setFooterData, setSpecialCustData]);
    
    // useEffect(() => {
    //   return () => {
    //     if (updateTimeoutRef.current) {
    //       clearTimeout(updateTimeoutRef.current);
    //     }
    //   };
    // }, []);
    const debouncedUpdateContext = useDebounce(
      updateContext,
      100,
      { maxWait: 1000 } // Opcional: ejecutar después de 1 segundo máximo
    );

    // function handleUpdateAmountMXN(id: number | string, value: string, key?: string) {
    //   const numericValue = parseFloat(value.replace(/[^\d.]/g, ""));
    //   if (isNaN(numericValue)) return;

    //   setSpecialCustomer((prev: any) => {
    //     if (!prev) return prev;

    //     const itemToUpdate = prev.lines.find((item: any) => item.id === id);
    //     if (!itemToUpdate) return prev;
     
    //     let newAmount = 0;
    //     let newValue = 0;
    //     let newValueUSD = 0;

    //     if (key === "ammount") {
    //       newValue = parseFloat(value);
    //       newValueUSD = 0;
    //       newAmount = parseFloat(value);
    //     } else {
    //       newValue = 0;
    //       newValueUSD = parseFloat(value);
    //       newAmount =
    //         parseFloat(value) *
    //         specialCustomerData.lines.filter(
    //           (item: SpecialCustomerLines) => item.id === id
    //         )[0].exchangeRate;
    //     }

    //     const updatedLines = prev.lines.map(
    //       (item: SpecialCustomerLines) =>
    //         item.id === id
    //           ? {
    //               ...item,
    //               ammount: newValue,
    //               ammountUSD: newValueUSD,
    //               ammountMXN: newAmount,
    //               couponPrice: newAmount,
    //               difference: newAmount - item.bill,
    //             }
    //           : item
    //     );

    //     return {
    //       ...prev,
    //       lines: updatedLines,
    //     };
        
    //   })
      
    //   debouncedUpdateContext();

    // }

    const handleInputTextData = useCallback((
    value: string, 
    id: number | string, 
    key: string, 
    clientId?: number
  ) => {
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

  const handleUpdateAmountMXN = useCallback((
    id: number | string, 
    value: string, 
    key?: string
  ) => {
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
    
  }, [setSpecialCustomer, debouncedUpdateContext]);



    return {handleInputTextData, handleUpdateAmountMXN}
}