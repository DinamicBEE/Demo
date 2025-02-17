import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { getBanks, getLotsClosure } from "@services/lotClosureService";
import {
  LotClosureContextType,
  LotClosure,
  Bank,
} from "@models/lotClosure.model";
import { STATUS } from "@models/status.model";

const LotClosureListContext = createContext<LotClosureContextType>(
  {} as LotClosureContextType
);

export const useLotClosureList = () => useContext(LotClosureListContext);

export function LotClosureProvider({ children }: { children: ReactNode }) {
  const [lotsClosure, setLotsClosure] = useState<LotClosure[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchLotClosureData = useCallback(
    async (
      dateRange: [Date | null, Date | null],
      locationId: number,
      companyId: number
    ) => {
      setLoading(true);
      try {
        const response = await getLotsClosure(dateRange, locationId, companyId);
        setLotsClosure(response);
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [lotsClosure]
  );

  const updateStatus = useCallback(
    (lotId: number, status: STATUS) => {
      const updatedLots = lotsClosure.map((lot) =>
        lot.id === lotId ? { ...lot, status } : lot
      );

      setLotsClosure(updatedLots);
    },
    [lotsClosure]
  );

  const fetchBanks = useCallback(
    async (lotId: number) => {
      if (banks.length > 0 && banks[0].lotClosureId === lotId) return;
      console.log("fetchBanks");
      setLoadingBanks(true);
      try {
        const response = await getBanks(lotId);
        setBanks(response);
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
      } finally {
        setLoadingBanks(false);
      }
    },
    [banks]
  );

  const updateBankAfilations = useCallback(
    (bankId: number, amount: number, afilationId: number) => {
      const bank = banks.find((bank) => bank.id === bankId);
      if (!bank) return;
      const updatedAfilations = bank.afilations.map((afilation) =>
        afilationId === afilation.id ? { ...afilation, amount } : afilation
      );

      const updatedBanks = banks.map((bank) =>
        bank.id === bankId ? { ...bank, afilations: updatedAfilations } : bank
      );

      setBanks(updatedBanks);
    },
    [banks]
  );

  const value = useMemo(
    () => ({
      lotsClosure,
      loadingBanks,
      banks,
      error,
      loading,
      fetchLotClosureData,
      fetchBanks,
      updateStatus,
      updateBankAfilations,
    }),
    [
      lotsClosure,
      loadingBanks,
      banks,
      loading,
      error,
      fetchLotClosureData,
      updateStatus,
      fetchBanks,
      updateBankAfilations,
    ]
  );

  return (
    <LotClosureListContext.Provider value={value}>
      {children}
    </LotClosureListContext.Provider>
  );
}
