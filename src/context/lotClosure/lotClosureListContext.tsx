import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  getBanks,
  getLotsClosure,
  updateBankService,
  updateLotClosure,
} from "@services/lotClosureService";
import {
  LotClosureContextType,
  LotClosure,
  Bank,
} from "@models/lotClosure.model";

const LotClosureListContext = createContext<LotClosureContextType>(
  {} as LotClosureContextType
);

export const useLotClosureList = () => useContext(LotClosureListContext);

export function LotClosureProvider({ children }: { children: ReactNode }) {
  const [lotsClosure, setLotsClosure] = useState<LotClosure[]>([]);
  const lostClosureCache = useRef<{ [key: number]: LotClosure[] }>({});
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [updateBankLoading, setUpdateBankLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const bankCache = useRef<{ [key: number]: Bank[] }>({});

  const fetchLotClosureData = useCallback(
    async (
      dateRange: [Date | null, Date | null],
      locationId: number,
      companyId: number,
      isRefresh?: boolean
    ) => {
      if (lostClosureCache.current[locationId] && !isRefresh) {
        setLotsClosure(lostClosureCache.current[locationId]);
        return;
      }
      setLoading(true);
      try {
        if (isRefresh) {
          setBanks([]);
          bankCache.current = {};
          setLotsClosure([]);
          lostClosureCache.current = {};
        }
        const response = await getLotsClosure(dateRange, locationId, companyId);
        const transformedResponse = response.map((lot) => ({
          ...lot,
          difference: lot.totalPOS - lot.totalLot,
        }));
        setLotsClosure(transformedResponse);
        lostClosureCache.current[locationId] = transformedResponse;
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [lotsClosure]
  );

  const updateBank = useCallback(
    async (lotId: number, localBank: Bank[], localLotClosure: LotClosure) => {
      setUpdateBankLoading(true);
      try {
        const reponseUpdatedBanks = await updateBankService(localBank);
        setBanks(reponseUpdatedBanks);
        bankCache.current[lotId] = reponseUpdatedBanks;
        const responseUpdatedLotClosure = await updateLotClosure(
          lotId,
          localLotClosure
        );
        const prevLots = lostClosureCache.current[localLotClosure.location.id];
        const updatedLots = prevLots.map((lot) =>
          lot.id === lotId ? responseUpdatedLotClosure : lot
        );
        setLotsClosure(updatedLots);
        lostClosureCache.current[localLotClosure.location.id] = updatedLots;
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
        throw error;
      } finally {
        setUpdateBankLoading(false);
      }
    },
    [lotsClosure, banks]
  );

  const fetchBanks = useCallback(
    async (lotId: number) => {
      if (bankCache.current[lotId]) return bankCache.current[lotId];
      setLoadingBanks(true);
      try {
        const response = await getBanks(lotId);
        setBanks(response);
        bankCache.current[lotId] = response;
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
      setLotsClosure,
      lotClosureCache: lostClosureCache.current,
      loadingBanks,
      banks,
      setBanks,
      bankCache: bankCache.current,
      error,
      loading,
      updateBankLoading,
      fetchLotClosureData,
      fetchBanks,
      updateBank,
      updateBankAfilations,
    }),
    [
      lotsClosure,
      setLotsClosure,
      loadingBanks,
      lostClosureCache,
      updateBankLoading,
      banks,
      setBanks,
      bankCache,
      loading,
      error,
      fetchLotClosureData,
      updateBank,
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
