import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { getLotsClosure } from "@services/lotCloaureService";
import { LotClosureContextType, lotClosure } from "@models/lotClosure.model";
import { STATUS } from "@models/status.model";

const LotClosureListContext = createContext<LotClosureContextType>(
  {} as LotClosureContextType
);

export const useLotClosureList = () => useContext(LotClosureListContext);

export function LotClosureProvider({ children }: { children: ReactNode }) {
  const [lotsClosure, setLotsClosure] = useState<lotClosure[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchLotClosureData = useCallback(
    async (dateRange: string, locationId: number, companyId: number) => {
      setLoading(true);
      try {
        const response = await getLotsClosure(dateRange, locationId, companyId);
        console.log(response);

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

  const updateStatus = useCallback((lotId: number, status: STATUS) => {
    const updatedLots = lotsClosure.map((lot) =>
      lot.id === lotId ? { ...lot, status } : lot
    );

    setLotsClosure(updatedLots)
  }, [lotsClosure]);

  const value = useMemo(
    () => ({
      lotsClosure,
      error,
      loading,
      fetchLotClosureData,
      updateStatus,
    }),
    [lotsClosure, loading, error, fetchLotClosureData, updateStatus]
  );

  return (
    <LotClosureListContext.Provider value={value}>
      {children}
    </LotClosureListContext.Provider>
  );
}
