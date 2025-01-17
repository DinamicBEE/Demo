import { sendCashClousing } from "@services/clousingService";
import { toaster } from "@components/ui/toaster";
import { ALERTCLOUSING_MODEL, CLOUSING_KEY } from "@models/constants.model";
import { useHeaders } from "@context/clousing/headerContext"

export const useHandleCashData = (cashData, setCashData) => {

  const headerContext = useHeaders();
  if (!headerContext) {
    return null;
  }
  const { updateTotal } = headerContext;
  
  const handleInputChange = (itemId, value) => {
    
    value = value.replace(/[^\d.]/g, "");
    
    const updatedData = cashData.currencies.map((item) =>
      item.id === itemId
        ? {
            ...item,
            totalFisico: parseFloat(value),
            difference: item.totalPOS - parseFloat(value),
          }
        : item
    );
    
    const newTotalFisico = updatedData.reduce(
      (acc, curr) => acc + curr.totalFisico,
      0
    );

    const newDifference = cashData.total.totalPOS - newTotalFisico;
    
    setCashData((prevState) => ({
      ...prevState,
      currencies: updatedData,
      total:{
        totalPOS: cashData.total.totalPOS,
        totalPhysical: newTotalFisico,
        difference: newDifference,
      }
    }));

    updateTotal(newTotalFisico, newDifference, cashData.employeId, CLOUSING_KEY.CASH)

  };

  function handleChangeTips(value) {
    
    setCashData((prevState) => ({
      ...prevState,
      tips: parseFloat(value),
    }));

  }

  async function sendClousing() {
    
    const response = await sendCashClousing(cashData);

    if (response.success) {
      console.log('Corte de caja enviado correctamente');
      showToast(ALERTCLOUSING_MODEL.SUCCESS, null);
    } else{
      console.log('Error al enviar el corte de caja');
      showToast(ALERTCLOUSING_MODEL.ERROR, response.error);
    }

    return false;
  }

  function showToast(alertModel, error) {
    toaster.create({
      title: alertModel.title,
      type: alertModel.type,
      description: alertModel.type === 'error' ? error : alertModel.description,
      duration: 5000,
    })
  }
  
  return { handleInputChange, handleChangeTips, sendClousing };
};