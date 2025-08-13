import { useRef } from "react"
import { toaster } from "@components/ui/toaster";
import { CLOUSING_KEY } from "@models/constants.model";
import { useHeaders } from "@context/home/headerContext"
import { useFooter } from "@context/home/footerClousingContext";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { AlertClousing, TotalModel } from "@models/common.clousing.model";
import { CashLines, CashModel } from "@models/cash.model";

export const useHandleCashData = (cashData: CashModel, setData: any, clousingId: number) => {

  const cashRef = useRef(cashData);

  const { updateTotal } = useHeaders();
  const { setFooterData } = useFooter();
  const { setCashData } = useCashClousing();

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

    const preTotalPhysical = cashData.currencies.reduce((acc: number, curr: { totalFisico: number }) => acc + (curr.totalFisico), 0);
    const newTotalPhysical = preTotalPhysical - parseFloat(value);

    const updateCashdata = { 
      ...cashData, 
      tips: parseFloat(value), 
      total: { 
        totalPhysical: newTotalPhysical,
        totalPOS: cashData.total?.totalPOS ?? 0,
        difference: cashData.total?.difference ?? 0,
      } 
    }

    setData(updateCashdata);

    cashRef.current = updateCashdata

    updateTotal(updateCashdata.total.totalPhysical, clousingId, CLOUSING_KEY.CASH);
    setFooterData(updateCashdata.total, clousingId, CLOUSING_KEY.CASH);
    setCashData(cashRef.current, clousingId);
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