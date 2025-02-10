import { useHeaders } from "@context/home/headerContext";
import { useTDCContext } from "@context/clousing/tdcClousingContex";
import { BankDetails, BankLineDetails, BankLineModel, TDCModel } from "@models/tdc.model";
import { TotalModel } from "@models/common.clousing.model";
import { CLOUSING_KEY } from "@models/constants.model";

export const useHandleTDC = (clousingId: number, lineId: number) => {

    const { updateTotal } = useHeaders();
    const tdcContext = useTDCContext();

    function handleInputData(value: string, id: number, details: BankDetails, setDetails: any,) {
      if (lineId === null) return;

      const updateLines = details?.details.map((item: BankLineDetails) =>
        item.id === id
          ? {
              ...item,
              check: value,
            }
          : item
      );

      const updateBankDetails: BankDetails = {
        ...details!,
        details: updateLines || [],
      };

      setDetails(updateBankDetails);

      tdcContext?.setDetails(updateBankDetails, clousingId, lineId);
    }

    function updateLineClousing(detailsValidated: BankDetails, employeId: number,) {
      const tdcData = tdcContext?.tdc?.[clousingId]?.[employeId];
      console.log(tdcData);

      const newPhysical = detailsValidated.details.reduce(
        (acc: number, curr: BankLineDetails) => acc + curr.amount,
        0
      );

      const updateLines = tdcData?.lines?.map((item: BankLineModel) =>
        lineId === item.id
          ? {
              ...item,
              voucherAmount: detailsValidated.details.length,
              physical: newPhysical,
            }
          : item
      );

      const newTotalPhysical = updateLines?.reduce(
        (acc: number, curr: BankLineModel) => acc + curr.physical,
        0
      );

      const newDifference =
        (tdcData?.total?.totalPOS || 0) - (newTotalPhysical || 0);

      const newTotal: TotalModel = {
        totalPOS: tdcData?.total?.totalPOS || 0,
        totalPhysical: newTotalPhysical || 0,
        difference: newDifference,
      };

      const updateTDCData: TDCModel = {
        id: tdcData?.id || 0,
        employeId: tdcData?.employeId || 0,
        total: newTotal,
        lines: updateLines || [],
      };

      updateTotal(
        newTotalPhysical || 0,
        clousingId,
        employeId,
        CLOUSING_KEY.TDC
      );

      tdcContext?.setTDCData(updateTDCData, clousingId, employeId);
    }

    return { handleInputData, updateLineClousing };
}