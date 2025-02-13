import { useRef } from "react"
import { sendCashClousing } from "@services/clousingService";
import { toaster } from "@components/ui/toaster";
import { ALERTCLOUSING_MODEL, CLOUSING_KEY } from "@models/constants.model";
import { useHeaders } from "@context/home/headerContext"
import { useFooter } from "@context/home/footerClousingContext";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { AlertClousing, TotalModel } from "@models/common.clousing.model";
import { CashLines, CashModel } from "@models/cash.model";

export const useHandleCashData = (cashData:CashModel, setData:any, clousingId: number, employeId: number) => {

  const cashRef = useRef(cashData);

  const { updateTotal } = useHeaders();
  const { setFooterData } = useFooter();
  const cashContext = useCashClousing();

  function handleInputChange(itemId: number, value:string) {
    
    value = value.replace(/[^\d.]/g, "");
    
    const updatedData = cashData.currencies.map((item: CashLines) =>
      item.id === itemId
        ? {
            ...item,
            totalFisico: parseFloat(value),
            difference: item.totalPOS - parseFloat(value),
          }
        : item
    );
    
    const newTotalPhysical = updatedData.reduce(
      (acc: number, curr: { totalFisico: number; }) => acc + curr.totalFisico,
      0
    );

    const newDifference = (cashData.total?.totalPOS || 0) - newTotalPhysical;

    const newTotal: TotalModel = {
      totalPOS: cashData.total?.totalPOS || 0,
      totalPhysical: newTotalPhysical,
      difference: newDifference,
    }
    
    const updateCashdata = {
      ...cashData,
      currencies: updatedData,
      total: newTotal
    };


    setData(updateCashdata);
    cashRef.current = updateCashdata

    updateTotal(newTotalPhysical, clousingId, CLOUSING_KEY.CASH)

    setFooterData(newTotal, clousingId, "cash");

    cashContext?.setCashData(cashRef.current,  clousingId)

  };

  function handleChangeTips(value: string) {
    
    const updateCashdata = {
      ...cashData,
      tips: parseFloat(value),
    }

    setData(updateCashdata);
    cashRef.current = updateCashdata

  }

  // async function sendClousing() {
    
  //   const response:any = await sendCashClousing(cashData);

  //   if (response.success) {
  //     console.log('Corte de caja enviado correctamente');
  //     showToast(ALERTCLOUSING_MODEL.SUCCESS, null);
  //   } else{
  //     console.log('Error al enviar el corte de caja');
  //     showToast(ALERTCLOUSING_MODEL.ERROR, response.error);
  //   }

  //   return false;
  // }

  function showToast(alertModel:AlertClousing, error: string | null) {
    toaster.create({
      title: alertModel.title,
      type: alertModel.type,
      description: alertModel.type === 'error' ? error : alertModel.description,
      duration: 5000,
    })
  }
  
  return { handleInputChange, handleChangeTips,  };//sendClousing
};