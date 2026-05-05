import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { getCompanies } from "@services/lotClosureService";
import {
  LotCatalogContextType,
} from "@models/lotClosure.model";
import { selectOption } from "@models/common.model";
import { getLocations, getStatusLot, getZones } from "@services/catalogService";
import { getStatus } from "@utils/getStatus";

const LotCatalogContext = createContext<LotCatalogContextType>(
  {} as LotCatalogContextType
);

export const useLotCatalogList = () => useContext(LotCatalogContext);

export function LotCatalogProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<selectOption[]>([]);
  const [companies, setCompanies] = useState<selectOption[]>([]);
  const [zones, setZones] = useState<selectOption[]>([]);
  const [locations, setLocations] = useState<selectOption[]>([]);
  const cachedLocations = useRef<{
    [key: number]: selectOption[];
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchCompanies = useCallback(async () => {
    if (companies.length > 0) return;
    setLoading(true);
    try {
      const response = await getCompanies();
      setCompanies(
          response.map((company: { id: any; name: any; }) => ({
            value: company.id,
            label: company.name,
        })
      ));
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [companies]);

  const fetchZones = useCallback(
    async (companyId: number[]) => {
      if (companyId.length === 0 || companyId === null || companyId === undefined) {
        
        setZones([]);
        setLocations([]);
        return;
      }
      setLoading(true);
      try {
        const response = await getZones(companyId);
        const newZones = response.map((zone: { id: number; name: string; }) => ({
            value: zone.id,
            label: zone.name,
          }));
        setZones(newZones);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [cachedLocations]
  );

  const fetchLocations = useCallback(
    async (zones: number[]) => {

      setLoading(true);
      try {
        const response = await getLocations(zones);
        const newLocations = response.map((location: { id: number; name: string; }) => ({
            value: location.id,
            label: location.name,
          }));
        setLocations(newLocations);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [cachedLocations]
  );

    const getStatusList = useCallback(
      async () => {
        if (status.length > 0) return status;
        setLoading(true);
        try {
          const response = await getStatusLot();
          const data = response.map((status: { id: any; name: any; }) =>{
            return {
              value: status.id,
              label: getStatus(status.name),
            }
          })
          setStatus(data);
          setLoading(false);
          return data;
        } catch (error) {
          setLoading(false);
          //setError(error instanceof Error ? error.message : String(error));
          throw error;
        }
      }, [status]
    )

  const value = useMemo(
    () => ({
      status,
      companies,
      zones,
      locations,
      setLocations,
      loading,
      error,
      getStatusList,
      fetchCompanies,
      fetchZones,
      fetchLocations,
    }),
    [status, companies, locations, loading, error, getStatusList, fetchCompanies, fetchLocations, setLocations]
  );

  return (
    <LotCatalogContext.Provider value={value}>
      {children}
    </LotCatalogContext.Provider>
  );
}