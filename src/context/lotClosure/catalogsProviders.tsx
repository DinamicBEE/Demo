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
import { createListCollection, ListCollection } from "@chakra-ui/react";
import { selectOption } from "@models/common.model";
import { getLocations, getZones } from "@services/catalogService";

const LotCatalogContext = createContext<LotCatalogContextType>(
  {} as LotCatalogContextType
);

export const useLotCatalogList = () => useContext(LotCatalogContext);

export function LotCatalogProvider({ children }: { children: ReactNode }) {
  const [comapanies, setCompanies] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] })
  );
  const [zones, setZones] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] })
  );
  const [locations, setLocations] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] })
  );
  const cachedLocations = useRef<{
    [key: number]: ListCollection<selectOption>;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchCompanies = useCallback(async () => {
    if (comapanies.items.length > 0) return;
    setLoading(true);
    try {
      const response = await getCompanies();
      setCompanies(
        createListCollection({
          items: response.map((company: { id: any; name: any; }) => ({
            value: company.id,
            label: company.name,
          })),
        })
      );
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [comapanies]);

  const fetchZones = useCallback(
    async (companyId: number[]) => {

      setLoading(true);
      try {
        const response = await getZones(companyId);
        const newZones = createListCollection({
          items: response.map((zone: { id: number; name: string; }) => ({
            value: zone.id,
            label: zone.name,
          })),
        });
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
        const newLocations = createListCollection({
          items: response.map((location: { id: number; name: string; }) => ({
            value: location.id,
            label: location.name,
          })),
        });
        setLocations(newLocations);
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [cachedLocations]
  );

  const value = useMemo(
    () => ({
      comapanies,
      zones,
      locations,
      setLocations,
      loading,
      error,
      fetchCompanies,
      fetchZones,
      fetchLocations,
    }),
    [comapanies, locations, loading, error, fetchCompanies, fetchLocations, setLocations]
  );

  return (
    <LotCatalogContext.Provider value={value}>
      {children}
    </LotCatalogContext.Provider>
  );
}