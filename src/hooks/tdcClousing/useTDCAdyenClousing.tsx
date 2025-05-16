import { ProcessResult } from "@models/adyen.model";
import { Bank, LotClosure } from "@models/lotClosure.model";
import { BankLineModel, Voucher } from "@models/tdc.model";
import { toast } from "../../utils/index";
import React from "react";

export const useHandleTDCAdyen = () => {
  const updateLocalBanksAdyen = (
    dataFilesProcess: ProcessResult,
    detailsLocal: BankLineModel,
    setDetailsLocal: React.Dispatch<
      React.SetStateAction<BankLineModel | undefined>
    >,
    setVisibleItems: React.Dispatch<React.SetStateAction<Voucher[]>>,
    setLocalAmount: React.Dispatch<React.SetStateAction<number>>,
    setVouchersSelected: React.Dispatch<React.SetStateAction<number>>,
    startRange: number,
    endRange: number
  ) => {
    // Validación temprana
    if (!dataFilesProcess.consolidatedData || !detailsLocal?.vouchers) {
      return;
    }

    // Crear conjuntos únicos para comparación eficiente
    const checkDate = new Set<string>(
      dataFilesProcess.consolidatedData.map((item) => item.date as string)
    );
    const checkCheck = new Set<number>(
      dataFilesProcess.consolidatedData.map((item) => Number(item.check))
    );
    const checkAmount = new Set<number>(
      dataFilesProcess.consolidatedData.map((item) => Number(item.amount))
    );

    // Separar los vouchers en dos grupos: los que están en false y los que están en true
    const vouchersToUpdate = detailsLocal.vouchers.filter(
      (detail) => detail.status === false
    );
    const vouchersAlreadyTrue = detailsLocal.vouchers.filter(
      (detail) => detail.status === true
    );

    // Actualizar solo los vouchers que necesitan actualización
    const updatedVouchers = vouchersToUpdate.map((detail) => {
      const dateMatch = checkDate.has(detail.dateDisplay ?? "");
      const checkMatch = checkCheck.has(Number(detail.check));
      const amountMatch = checkAmount.has(Number(detail.amount));
      const allMatches = dateMatch && checkMatch && amountMatch;

      return {
        ...detail,
        status: allMatches ? true : detail.status,
      };
    });

    // Combinar los vouchers actualizados con los que ya tenían status true
    const allVouchers = [...vouchersAlreadyTrue, ...updatedVouchers];

    // Actualizar el estado con todos los vouchers
    setDetailsLocal((prev) => ({
      ...prev!,
      vouchers: allVouchers,
    }));
    setVisibleItems(
      allVouchers.filter((item) => item.status).slice(startRange, endRange)
    );
    setLocalAmount(
      Number(
        allVouchers
          .filter((item) => item.status)
          .reduce((acc, curr) => acc + curr.amount, 0)
          .toFixed(2)
      )
    );
    setVouchersSelected(allVouchers.filter((item) => item.status).length);
    toast(
      `Se agregaron ${updatedVouchers.filter((item) => item.status).length} vouchers`,
      updatedVouchers.filter((item) => item.status).length === 0
        ? "warning"
        : "success"
    );
  };

  return { updateLocalBanksAdyen };
};
