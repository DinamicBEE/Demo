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
} from "@services/lotClosureService";
import {
  LotClosureContextType,
  LotClosure,
  Bank,
} from "@models/lotClosure.model";
import { STATUS } from "@models/status.model";
import { format } from "date-fns";

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
  const [dateRangeLocal, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);

  const fetchLotClosureData = useCallback(
    async (
      dateRange: [Date | null, Date | null],
      locationId: number,
      companyId: number,
      isRefresh?: boolean
    ) => {
      setDateRange(dateRange);
      const [startDate, endDate] = dateRange;

      // Función helper para formatear fechas y manejar valores nulos
      const formatDateOrDefault = (date: Date | null): string =>
        format(date || new Date(), "yyyy-MM-dd");

      // Formatear fechas del nuevo rango
      const formattedStartDate = formatDateOrDefault(startDate);
      const formattedEndDate = formatDateOrDefault(endDate);
      const dateRangeString = `${formattedStartDate} - ${formattedEndDate}`;

      // Formatear fechas del rango en caché
      const cachedStartDate = formatDateOrDefault(dateRangeLocal[0]);
      const cachedEndDate = formatDateOrDefault(dateRangeLocal[1]);
      const dateRangeCache = `${cachedStartDate} - ${cachedEndDate}`;
      
      if (
        lostClosureCache.current[locationId] &&
        !isRefresh &&
        dateRangeCache === dateRangeString
      ) {
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
        lostClosureCache.current[locationId] = response;
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

  const updateBank = useCallback(
    async (lotId: number, localBank: Bank[], localLotClosure: LotClosure) => {
      setError("");
      setUpdateBankLoading(true);
      try {
        const body = {
          cashRegisterClosureId: localLotClosure.cashRegisterClosureId,
          batchClosureId: localLotClosure.id,
          totalPos: localLotClosure.totalPos,
          totalLote: localLotClosure.totalLote,
          difference: localLotClosure.difference,
          batchDetailsRequest: localBank.map((bank) => ({
            batchDetailsId: bank.batchDetailsId,
            bankTerminalId: bank.bankTerminalId,
            totalPos: bank.totalPos,
            totalCrc: bank.totalCrc,
            totalBatch: bank.totalBatch,
            difference: bank.difference,
            lines: bank.affiliationList.map((line) => ({
              affiliationDetailsId: line.affiliationDetailsId,
              affiliationId: line.affiliationId,
              amount: line.amount,
            })),
          })),
        };

        const response = await updateBankService(body);

        if (response === "CONFIRMED") {
          setBanks(localBank);
          bankCache.current[lotId] = localBank;
          const updatedLot = {
            ...localLotClosure,
            status:
              localLotClosure.difference === 0
                ? STATUS.Close
                : STATUS.WITH_DIFFERENCE,
            difference: localLotClosure.difference,
          };
          const prevLots =
            lostClosureCache.current[localLotClosure.consumerCenterId];
          const updatedLots = prevLots.map((lot) =>
            lot.id === lotId ? updatedLot : lot
          );
          setLotsClosure(updatedLots);
          lostClosureCache.current[localLotClosure.consumerCenterId] =
            updatedLots;
        }
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
