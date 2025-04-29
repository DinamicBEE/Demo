import { Bank, LotClosure } from "@models/lotClosure.model";
import React from "react";
import { set } from "react-hook-form";

export const useHandleAffiliationsData = () => {
  // Function to handle input data and update local banks
  const handleInputData = (
    bankId: number | string,
    inputValue: string,
    setLocalBanks: React.Dispatch<React.SetStateAction<Bank[]>>,
    localBanks: Bank[],
    localLot: LotClosure,
    setLocalLot: React.Dispatch<React.SetStateAction<LotClosure>>,
    affiliationKey?: string
  ) => {
    const cleanedValue = Number(inputValue.replace(/[^\d.]/g, ""));
    if (cleanedValue < 0) return;

    const updatedBanks = localBanks.map((bank) => {
      if (bank.bankTerminalId === bankId) {
        const updatedAffiliations = bank.affiliationList.map((affiliation) => {
          if (affiliation.affiliationId.toString() === affiliationKey) {
            return { ...affiliation, amount: cleanedValue };
          }
          return affiliation;
        });
        return { ...bank, affiliationList: updatedAffiliations };
      }
      return bank;
    });

    const banksWithTotalLot = calculateTotalLot(updatedBanks);
    const banksWithDifference = calculateDifference(banksWithTotalLot);

    const totalLot = banksWithDifference.reduce(
      (acc, bank) => acc + bank.totalBatch,
      0
    );
    const totalDifference = banksWithDifference.reduce(
      (acc, bank) => acc + bank.difference,
      0
    );

    setLocalLot({
      ...localLot,
      totalLote: totalLot,
      difference: totalDifference,
    });
    setLocalBanks(banksWithDifference);
  };

  // Helper function to calculate total lot for each bank
  const calculateTotalLot = (banks: Bank[]) => {
    return banks.map((bank) => {
      const totalLot = bank.affiliationList.reduce(
        (acc, affiliation) => acc + affiliation.amount,
        0
      );
      return { ...bank, totalBatch: totalLot };
    });
  };

  // Helper function to calculate difference for each bank
  const calculateDifference = (banks: Bank[]) => {
    return banks.map((bank) => {
      const difference = bank.totalPos - bank.totalBatch;
      return { ...bank, difference };
    });
  };

  return { handleInputData };
};
