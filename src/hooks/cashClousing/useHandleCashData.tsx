import { sendCashClousing } from "@services/clousingService";
import { toaster } from "@components/ui/toaster";
import { ALERTCLOUSING_MODEL, CLOUSING_KEY } from "@models/constants.model";
import { useHeaders } from "@context/clousing/headerContext"
import { useFooter } from "@context/clousing/footerClousingContext";
import { AlertClousing, TotalModel } from "@models/common.clousing.model";

//TODO: TIPAR TIPO EFECTIVO
export const useHandleCashData = (cashData:any, setCashData:any) => {

  const headerContext = useHeaders();
  const footerContext = useFooter();
  if (!headerContext) {
    return null;
  }
  if (!footerContext) {
    return null;
  }
  const { updateTotal } = headerContext;
  const {setFooterData} = footerContext;
  
  const handleInputChange = (itemId: number, value:string) => {
    
    value = value.replace(/[^\d.]/g, "");
    
    //TODO: TIPAR TIPO EFECTIVO
    const updatedData = cashData.currencies.map((item: any) =>
      item.id === itemId
        ? {
            ...item,
            totalFisico: parseFloat(value),
            difference: item.totalPOS - parseFloat(value),
          }
        : item
    );
    
    const newTotalFisico = updatedData.reduce(
      (acc: number, curr: { totalFisico: number; }) => acc + curr.totalFisico,
      0
    );

    const newDifference = cashData.total.totalPOS - newTotalFisico;

    const newTotal: TotalModel ={
      totalPOS: cashData.total.totalPOS,
      totalPhysical: newTotalFisico,
      difference: newDifference,
    }
    
    setCashData((prevState: any) => ({
      ...prevState,
      currencies: updatedData,
      total: newTotal
    }));

    updateTotal(newTotalFisico, newDifference, cashData.employeId, CLOUSING_KEY.CASH)

    setFooterData(newTotal, cashData.id, "cash");

  };

  function handleChangeTips(value: string) {
    
    setCashData((prevState: any) => ({
      ...prevState,
      tips: parseFloat(value),
    }));

  }

  async function sendClousing() {
    
    const response:any = await sendCashClousing(cashData);

    if (response.success) {
      console.log('Corte de caja enviado correctamente');
      showToast(ALERTCLOUSING_MODEL.SUCCESS, null);
    } else{
      console.log('Error al enviar el corte de caja');
      showToast(ALERTCLOUSING_MODEL.ERROR, response.error);
    }

    return false;
  }

  function showToast(alertModel:AlertClousing, error: string | null) {
    toaster.create({
      title: alertModel.title,
      type: alertModel.type,
      description: alertModel.type === 'error' ? error : alertModel.description,
      duration: 5000,
    })
  }
  
  return { handleInputChange, handleChangeTips, sendClousing };
};