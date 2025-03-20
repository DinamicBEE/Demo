import { useRef } from "react";
import { useHeaders } from "@context/home/headerContext";
import { useFooter } from "@context/home/footerClousingContext";
import { useSpecialCustContext } from "@context/clousing/specialCustClousingContext";
import { SpecialCustomerLines, SpecialCustomerModel } from "@models/specialCustome.model";
import { TotalModel } from "@models/common.clousing.model";
import { CLOUSING_KEY } from "@models/constants.model";

export const useHandleSpecialCustomer = (specialCustomerData: SpecialCustomerModel, setSpecialCustomer: any, clousingId: number) =>{

    const specialCustRef = useRef(specialCustomerData);

    const { updateTotal } = useHeaders();
    const { setFooterData } = useFooter();
    const { setSpecialCustData } = useSpecialCustContext();

    function handleInputTextData(value: string, id: number | string, key: string) {
      const updatedCurrencies = specialCustomerData.lines.map((item: SpecialCustomerLines) =>
        item.id === id
          ? {
              ...item,
              [key]: value,
            }
          : item
      );

      setSpecialCustomer({
        ...specialCustomerData,
        lines: updatedCurrencies,
      });
      specialCustRef.current = specialCustomerData;
      setSpecialCustData(specialCustRef.current, clousingId);

    }

    function handleUpdateAmountMXN(id: number | string, value: string, key?: string) {
      value = value.replace(/[^\d.]/g, "");
      console.log(key)
      
      let newAmoutn = 0;
      let newValue = 0;
      let newValueUSD = 0;

      if (key === "value") {
        newValue = parseFloat(value);
        newValueUSD = 0;
        newAmoutn = parseFloat(value);
      } else {
        newValue = 0;
        newValueUSD = parseFloat(value);
        newAmoutn =
          parseFloat(value) *
          specialCustomerData.lines.filter(
            (item: SpecialCustomerLines) => item.id === id
          )[0].exchangeRate;
      }

      const updatedCurrencies = specialCustomerData.lines.map(
        (item: SpecialCustomerLines) =>
          item.id === id
            ? {
                ...item,
                value: newValue,
                valueUSD: newValueUSD,
                amountMXN: newAmoutn,
              }
            : item
      );

      specialCustomerData.lines = updatedCurrencies;

      setSpecialCustomer({ ...specialCustomerData });
      specialCustRef.current = specialCustomerData;
      updateContext(updatedCurrencies);
      
    }

    function updateContext(updateLines: SpecialCustomerLines[]){

        const newTotalFisico = updateLines.reduce(
            (acc: number, curr: { amountMXN: number; }) => acc + curr.amountMXN,
            0
        );

        const newDifference =
          specialCustomerData.total.totalPOS - newTotalFisico;

        const newTotal: TotalModel = {
          totalPOS: specialCustomerData.total.totalPOS,
          totalPhysical: newTotalFisico,
          difference: newDifference,
        };

        const updateCustomerData ={
          ...specialCustRef.current,
          total: newTotal
        }

        updateTotal(newTotalFisico, clousingId, CLOUSING_KEY.SPECIALCUSTOMER);

        setFooterData(newTotal, clousingId, CLOUSING_KEY.SPECIALCUSTOMER);

        setSpecialCustData(updateCustomerData, clousingId);

    }
    
    return {handleInputTextData, handleUpdateAmountMXN}
}