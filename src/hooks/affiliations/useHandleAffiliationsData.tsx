import { Bank, LotClosure } from "@models/lotClosure.model";
import React from "react";
import { set } from "react-hook-form";

export const useHandleAffiliationsData = () => {
  // Function to handle input data and update local banks
  const handleInputData = (
    bankId: number,
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
      if (bank.id === bankId) {
        const updatedAffiliations = bank.afilations.map((affiliation) => {
          if (affiliation.id.toString() === affiliationKey) {
            return { ...affiliation, amount: cleanedValue };
          }
          return affiliation;
        });
        return { ...bank, afilations: updatedAffiliations };
      }
      return bank;
    });

    const banksWithTotalLot = calculateTotalLot(updatedBanks);
    const banksWithDifference = calculateDifference(banksWithTotalLot);

    const totalLot = banksWithDifference.reduce(
      (acc, bank) => acc + bank.lot,
      0
    );
    const totalDifference = banksWithDifference.reduce(
      (acc, bank) => acc + bank.difference,
      0
    );

    setLocalLot({ ...localLot, totalLot, difference: totalDifference });
    setLocalBanks(banksWithDifference);
  };

  // Helper function to calculate total lot for each bank
  const calculateTotalLot = (banks: Bank[]) => {
    return banks.map((bank) => {
      const totalLot = bank.afilations.reduce(
        (acc, affiliation) => acc + affiliation.amount,
        0
      );
      return { ...bank, lot: totalLot };
    });
  };

  // Helper function to calculate difference for each bank
  const calculateDifference = (banks: Bank[]) => {
    return banks.map((bank) => {
      const difference = bank.totalPOS - bank.lot;
      return { ...bank, difference };
    });
  };

  return { handleInputData };
};
