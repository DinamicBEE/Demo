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
      if (banks.length > 0 && banks[0].lotClosureId === lotId) return banks;
      setLoadingBanks(true);
      try {
        const response = await getBanks(lotId);
        setBanks(response);
        return response;
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
        return [];
      } finally {
        setLoadingBanks(false);
      }
    },
    [banks]
  );

  const updateBankAfilations = useCallback(
    (bankId: number, amount: string, afilationId: number) => {
      const auxAmount = Number(amount.replace(/[^\d.]/g, ""));
      if (auxAmount < 0) return;

      setBanks((prevBanks) =>
        prevBanks.map((bank) =>
          bank.id === bankId
            ? {
                ...bank,
                afilations: bank.afilations.map((afilation) =>
                  afilation.id === afilationId
                    ? { ...afilation, amount: auxAmount }
                    : afilation
                ),
              }
            : bank
        )
      );
    },
    []
  );

  const value = useMemo(
    () => ({
      lotsClosure,
      loadingBanks,
      banks,
      setBanks,
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
      setBanks,
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
