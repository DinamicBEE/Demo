import { useHeaders } from "@context/home/headerContext";
import { useTDCContext } from "@context/clousing/tdcClousingContex";
import { Voucher, BankLineModel, TDCModel } from "@models/tdc.model";
import { TotalModel } from "@models/common.clousing.model";
import { CLOUSING_KEY } from "@models/constants.model";

export const useHandleTDC = (clousingId: number, lineId: number | string) => {
  const { updateTotal } = useHeaders();
  const { setDetails, tdc, setTDCData } = useTDCContext();

  function handleInputData(
    value: string,
    id: number | string,
    details: BankLineModel,
    setDetail: any
  ) {
    if (lineId === null) return;

    const updateLines = details?.vouchers.map((item: Voucher) =>
      item.id === id
        ? {
            ...item,
            check: value,
          }
        : item
    );

    const updateBankDetails: BankLineModel = {
      ...details!,
      vouchers: updateLines || [],
    };

    setDetail(updateBankDetails);

    setDetails(updateBankDetails, clousingId, lineId);
  }

  function updateLineClousing(detailsValidated: BankLineModel) {
    const tdcData = tdc?.[clousingId];

    const newPhysical = detailsValidated.vouchers
      .filter((item: Voucher) => item.status)
      .reduce((acc: number, curr: Voucher) => {
        // Redondeo en cada paso de la acumulación
        return Number((acc + curr.amountConversion).toFixed(2));
      }, 0);

    const successCount = detailsValidated.vouchers.filter(
      (item: Voucher) => item.status
    ).length;

    const successCountAdyen = detailsValidated.vouchers.filter(
      (item: Voucher) => item.successAdyen
    );

    const newPhysicalAdyen = successCountAdyen
      .map((item: Voucher) => item.amount)
      .reduce((acc: number, curr: number) => acc + curr, 0);

    const updateLines = tdcData?.lines?.map((item: BankLineModel) =>
      lineId === item.id
        ? {
            ...item,
            voucherAmountDisplay:
              detailsValidated.bank === "ADYEN"
                ? successCountAdyen.length
                : successCount,
            physical:
              detailsValidated.bank === "ADYEN"
                ? newPhysicalAdyen
                : newPhysical,
            vouchers: detailsValidated.vouchers,
          }
        : item
    );

    const newTotalPhysical = updateLines?.reduce(
      (acc: number, curr: BankLineModel) =>
        Number((acc + curr.physical).toFixed(2)),
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

    updateTotal(newTotalPhysical || 0, clousingId, CLOUSING_KEY.TDC);

    setTDCData(updateTDCData, clousingId);
  }

  return { handleInputData, updateLineClousing };
};
