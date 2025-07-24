import { ReactNode, createContext, useContext, useState,
  useMemo, useCallback, useRef } from "react";
import { getBanks, getLotsClosure, updateBankService } from "@services/lotClosureService";
import { LotClosureContextType, LotClosure, Bank, LotsClosureContext } from "@models/lotClosure.model";

const LotClosureListContext = createContext<LotClosureContextType>(
  {} as LotClosureContextType
);

export const useLotClosureList = () => useContext(LotClosureListContext);

export function LotClosureProvider({ children }: { children: ReactNode }) {
  const [lotsClosure, setLotsClosure] = useState<LotClosure[]>([]);
  const lostClosureCache = useRef<LotsClosureContext>({});
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [updateBankLoading, setUpdateBankLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const bankCache = useRef<{ [key: number]: Bank[] }>({});

  const filterDataLots = (date: string, locationId: number[]) => {
    if(locationId.length > 0) {
      const filteredLots = lostClosureCache.current[date].filter(
            (lot) => locationId.includes(lot.consumerCenterId));
      setLotsClosure(filteredLots);
    } else {
      setLotsClosure(lostClosureCache.current[date]);
    }
  }


  const fetchLotClosureData = useCallback(
    async (
      date: string,
      locationId: number[],
      isRefresh?: boolean
    ) => {
      if (
        lostClosureCache.current[date] &&
        !isRefresh 
      ) {
        filterDataLots(date, locationId);
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
        const response = await getLotsClosure(date);
        lostClosureCache.current[date] = response;
        filterDataLots(date, locationId);
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
      setError("");
      setUpdateBankLoading(true);
      try {
        const body = {
          ...localLotClosure,
          batchClosureId: typeof localLotClosure.id === "number" ? localLotClosure.id : null,
          batchDetailsRequest: localBank.map((bank) => ({
            ...bank,
            batchDetailsId: typeof bank.batchDetailsId === "string" ? null : bank.batchDetailsId,
            lines: bank.affiliationList.map((line) => ({
              ...line
            })),
          })),
        };

        await updateBankService(body);

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
    async (cdcId: number, date:string) => {
      if (bankCache.current[cdcId]) return bankCache.current[cdcId]; // Cambiar referencia por tipo [key:number]: [key:string]: Bank[] validar formato
      setLoadingBanks(true);
      try {
        const response = await getBanks(cdcId, date);
        setBanks(response);
        bankCache.current[cdcId] = response;
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
    ]
  );

  return (
    <LotClosureListContext.Provider value={value}>
      {children}
    </LotClosureListContext.Provider>
  );
}
