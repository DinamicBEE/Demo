import { ProcessResult } from "@models/adyen.model";
import { Bank, LotClosure } from "@models/lotClosure.model";
import { BankDetails } from "@models/tdc.model";
import React from "react";

export const useHandleTDCAdyen = () => {
  const updateLocalBanksAdyen = (
    dataFilesProcess: ProcessResult,
    detailsLocal: BankDetails,
    setDetailsLocal: React.Dispatch<
      React.SetStateAction<BankDetails | undefined>
    >
  ) => {
    // Validación temprana
    if (!dataFilesProcess.consolidatedData || !detailsLocal?.details) {
      return;
    }

    // Verificación de error general
    if (detailsLocal.details.length !== dataFilesProcess.consolidatedData.length) {
      console.error("La cantidad de detalles locales no coincide con la cantidad de datos consolidados.");
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

    // Actualizar detalles y encontrar diferencias
    const updatedDetails = detailsLocal.details.map((detail) => {
      const dateMatch = checkDate.has(detail.date);
      const checkMatch = checkCheck.has(Number(detail.check));
      const amountMatch = checkAmount.has(Number(detail.amount));

      const isGeneralError = !dateMatch && !checkMatch && !amountMatch;

      return {
        ...detail,
        successAdyen: dateMatch && checkMatch && amountMatch,
        differences: {
          date: isGeneralError ? null : !dateMatch ? "Fecha no coincide" : null,
          check: isGeneralError ? null : !checkMatch ? "Check no coincide" : null,
          amount: isGeneralError ? null : !amountMatch ? "Monto no coincide" : null,
          general: isGeneralError ? "Este dato no viene en los datos consolidados" : null,
        },
      };
    });

    // Verificar cambios
    const hasChanges = updatedDetails.some(
      (detail, index) => detail.successAdyen !== detailsLocal.details[index].successAdyen
    );

    // Actualizar si hay cambios
    if (hasChanges) {
      setDetailsLocal((prev) => ({
        ...prev!,
        details: updatedDetails,
      }));

      // Llamar a updateLocalBanksTotal después de actualizar los detalles
      updateLocalBanksTotal({ ...detailsLocal, details: updatedDetails }, setDetailsLocal);
    }
  };

  const updateLocalBanksTotal = (
    detailsLocal: BankDetails,
    setDetailsLocal: React.Dispatch<React.SetStateAction<BankDetails | undefined>>
  ) => {
    if (detailsLocal.details) {
      const total = detailsLocal.details
        .filter(detail => detail.successAdyen) // Filtrar solo los detalles con successAdyen en true
        .reduce(
          (acc, detail) => {
            return {
              amount: acc.amount + Number(detail.amount),
            };
          },
          { amount: 0 } // Inicializar el acumulador con amount en 0
        );

      setDetailsLocal((prev) => ({
        ...prev!,
        total: total.amount,
      }));
    }
  };

  return { updateLocalBanksAdyen, updateLocalBanksTotal };
};