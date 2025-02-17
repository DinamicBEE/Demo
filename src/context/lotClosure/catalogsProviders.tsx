import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
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

      if (locations.items.length > 0 && locations.items[0].value === companyId)
        return;



      setLoading(true);
      try {
        const response = await getLocations(companyId);
        setLocations(
          createListCollection({
            items: response.map((location) => ({
              value: location.id,
              label: location.name,
            })),
          })
        );
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [locations]
  );

  const value = useMemo(
    () => ({
      comapanies,
      locations,
      loading,
      error,
      fetchCompanies,
      fetchLocations,
    }),
    [comapanies, locations, loading, error, fetchCompanies, fetchLocations]
  );

  return (
    <LotCatalogContext.Provider value={value}>
      {children}
    </LotCatalogContext.Provider>
  );
}
