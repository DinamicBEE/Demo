import { useRef } from "react"
import { toaster } from "@components/ui/toaster";
import { CLOUSING_KEY } from "@models/common.const";
import { useHeaders } from "@context/home/headerContext"
import { useFooter } from "@context/home/footerClousingContext";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { AlertClousing, TotalModel } from "@models/common.clousing.model";
import { CashLines, CashModel } from "@models/cash.model";

export const useHandleCashData = (cashData: CashModel, setData: any, clousingId: number,) => {

  const cashRef = useRef(cashData);

  const { updateTotal } = useHeaders();
  const { setFooterData } = useFooter();
  const { setCashData } = useCashClousing();
  const isFirstLoad = useRef(true);

  function handleInputChange(itemId: number | string, value: string, updatedDenominations?: CashLines["denominations"]) {

    value = value.replace(/[^\d.]/g, "");

    const updatedData = cashData.currencies.map((item: CashLines) =>
      item.id == itemId ? {
        ...item,
        totalFisico: parseFloat(value),
        difference: parseFloat(value) - (item.totalPOS),
        denominations: updatedDenominations ?? item.denominations,
      } : item
    );

    const preTotalPhysical = updatedData.reduce((acc: number, curr: { totalFisico: number }) => acc + (curr.totalFisico), 0);
    const newTotalPhysical = preTotalPhysical - (cashData.tips || 0);
    const newDifference =  newTotalPhysical - (cashData.total?.totalPOS || 0);

    const newTotal: TotalModel = {
      totalPOS: cashData.total?.totalPOS || 0,
      totalPhysical: newTotalPhysical,
      difference: newDifference ,
    };

    const updateCashdata = {
      ...cashData,
      currencies: updatedData,
      total: newTotal,
    };

    setData(updateCashdata);
   
    cashRef.current = updateCashdata;

    updateTotal(newTotalPhysical, clousingId, CLOUSING_KEY.CASH);
    setFooterData(newTotal, clousingId, CLOUSING_KEY.CASH);
    setCashData(cashRef.current, clousingId);
  }

function handleChangeTips(value: string) {
  if(isFirstLoad){
    isFirstLoad.current = false;
    return;
  }
  
  const sanitizedValue = value.replace(/[^\d.]/g, "");
  const newTipAmount = parseFloat(sanitizedValue) || 0;

  const sumOfCurrencies = cashData.currencies.reduce(
    (acc, curr) => acc + (Number(curr.totalFisico) || 0), 
    0
  );

  const finalPhysical = sumOfCurrencies - newTipAmount;

  const updatedTotal = { 
    totalPhysical: finalPhysical,
    totalPOS: cashData.total?.totalPOS ?? 0,
    difference: finalPhysical - (cashData.total?.totalPOS ?? 0),
  };

  const updatedCashData = { 
    ...cashData, 
    tips: newTipAmount, 
    total: updatedTotal 
  };

  cashRef.current = updatedCashData;

  setCashData(updatedCashData, clousingId); 
  setFooterData(updatedTotal, clousingId, CLOUSING_KEY.CASH);
  updateTotal(finalPhysical, clousingId, CLOUSING_KEY.CASH);
}

  function showToast(alertModel: AlertClousing, error: string | null) {
    toaster.create({
      title: alertModel.title,
      type: alertModel.type,
      description: alertModel.type === 'error' ? error : alertModel.description,
      duration: 5000,
    })
  }

  return { handleInputChange, handleChangeTips };
};