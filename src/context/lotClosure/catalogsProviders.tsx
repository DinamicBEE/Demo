import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { getCompanies, getLocations } from "@services/lotClosureService";
import {
  LotCatalogContextType,
} from "@models/lotClosure.model";
import { createListCollection, ListCollection } from "@chakra-ui/react";

const LotCatalogContext = createContext<LotCatalogContextType>(
  {} as LotCatalogContextType
);

export const useLotCatalogList = () => useContext(LotCatalogContext);

export function LotCatalogProvider({ children }: { children: ReactNode }) {
  const [comapanies, setCompanies] = useState<
    ListCollection<{ value: number; label: string }>
  >(createListCollection({ items: [] }));
  const [locations, setLocations] = useState<
    ListCollection<{ value: number; label: string }>
  >(createListCollection({ items: [] }));
  const cachedLocations = useRef<{ [key: number]: ListCollection<{ value: number; label: string }> }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchCompanies = useCallback(async () => {
    if (comapanies.items.length > 0) return;
    setLoading(true);
    try {
      const response = await getCompanies();
      setCompanies(
        createListCollection({
          items: response.map((company) => ({
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

  const fetchLocations = useCallback(
    async (companyId: number) => {
      if (cachedLocations.current[companyId]) {
        setLocations(cachedLocations.current[companyId]);
        return;
      }

      setLoading(true);
      try {
        const response = await getLocations(companyId);
        const newLocations = createListCollection({
          items: response.map((location) => ({
            value: location.id,
            label: location.name,
          })),
        });
        setLocations(newLocations);
        cachedLocations.current[companyId] = newLocations;
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
      locations,
      setLocations,
      loading,
      error,
      fetchCompanies,
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