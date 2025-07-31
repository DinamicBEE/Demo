import { createContext, useContext, useState, useMemo,
  useCallback, ReactNode, useRef } from "react";
import { calculateClousingTotals, getGeneralInfo } from "@services/homeService";
import { ClousingContextType, ClousingLinesModel, ClousingModel,
  HeaderClousingModel, TDC, TotalsModel, Currency, } from "@models/common.clousing.model";

const clousingContext = createContext<ClousingContextType>(
  {} as ClousingContextType
);

export const useClousing = () => useContext(clousingContext);

export function ClousingProvider({ children }: { children: ReactNode }) {
  const [header, setHeader] = useState<HeaderClousingModel>(
    {} as HeaderClousingModel);
  const [data, setData] = useState<ClousingLinesModel[]>(
    [] as ClousingLinesModel[]);
  const [totals, setTotals] = useState<TotalsModel>({} as TotalsModel);
  const [originalData, setOriginalData] = useState<ClousingLinesModel[]>(
    [] as ClousingLinesModel[]);
  const [pagination, setPagination] = useState({
    totaRegistros: 0,
    totalPagina: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [dataRow, setDataRow] = useState<ClousingLinesModel>(
    {} as ClousingLinesModel
  );
  const dataCache = useRef<{ [key: string]: ClousingModel }>({});
  const [tdcHeader, setTdcHeader] = useState<TDC[]>([]);
  const [currHeader, setCurrHeader] = useState<Currency[]>([]);

  const accumulatedHeader = (queryKey: string) => {
    const accumulatedHeaders = {
      totalPOS: 0,
      totalPhysical: 0,
      difference: 0,
    };
    Object.keys(dataCache.current).forEach((key) => {
      if (key.startsWith(queryKey)) {
        const pageData = dataCache.current[key];
        if (pageData && pageData.header) {
          accumulatedHeaders.totalPOS += pageData.header.totalPOS || 0;
          accumulatedHeaders.totalPhysical +=
            pageData.header.totalPhysical || 0;
          accumulatedHeaders.difference += pageData.header.difference || 0;
        }
      }
    });
    return accumulatedHeaders;
  };

  const getInfo = useCallback(
    async (
      store: number,
      page: number,
      startDate: Date,
      endDate: Date,
      isSearch: boolean = false
    ) => {
      try {
        setError('');
        const queryKey = `${store}-${startDate.toISOString()}-${endDate.toISOString()}`;

        const pageKey = `${queryKey}-page-${page}`;

        if (isSearch) {
          dataCache.current = {};
        }

        if (dataCache.current[pageKey] && !isSearch) {
          const accumulated = accumulatedHeader(queryKey);
          const data = {
            ...dataCache.current[pageKey].header,
            totalPOS: accumulated.totalPOS,
            totalPhysical: accumulated.totalPhysical,
            difference: accumulated.difference,
          };

          const totals = calculateClousingTotals(
            dataCache.current[pageKey].clousingLines
          );
          setHeader(data);
          setPagination(dataCache.current[pageKey].pagination);

          const currentPageData = dataCache.current[pageKey].clousingLines;

          setData(currentPageData);
          setTotals(totals);
          setOriginalData(currentPageData);
          setTdcHeader(dataCache.current[pageKey].clousingLines[0]?.tdc || []);
          setCurrHeader(dataCache.current[pageKey].clousingLines[0]?.currencies || []);
          return;
        }

        setLoading(true);
        
        const response = await getGeneralInfo(
          store,
          page,
          startDate,
          endDate
        );

        dataCache.current[pageKey] = response;

        const accumulated = accumulatedHeader(queryKey);
        const data = {
          ...response.header,
          totalPOS: accumulated.totalPOS,
          totalPhysical: accumulated.totalPhysical,
          difference: accumulated.difference,
        };

        setHeader(data);
        setPagination(response.pagination);

        const currentPageData = response.clousingLines;

        const totals = calculateClousingTotals(currentPageData);

        setData(currentPageData.sort((a,b) => a.employe.localeCompare(b.employe)));
        setTotals(totals);
        setOriginalData(currentPageData);
        setTdcHeader(response.clousingLines[0]?.tdc || []);
        setCurrHeader(response.clousingLines[0]?.currencies || []);
        
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));

        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const filterDataAdyen = useCallback(
    (isAdyen: boolean) => {
      if (isAdyen) {
        // Filtrar solo elementos con adyenTotal definido
        const dataAdyen = originalData.filter((item) => {
          return item.tdc !== undefined;
        });
        setData(dataAdyen);
      } else {
        // Restaurar los datos originales
        setData(originalData);
      }
    },
    [originalData]
  );

  const value = useMemo(
    () => ({
      header,
      data,
      totals,
      pagination,
      loading,
      error,
      getInfo,
      dataRow,
      setDataRow,
      filterDataAdyen,
      tdcHeader,
      currHeader,
    }),
    [
      header,
      data,
      totals,
      loading,
      error,
      getInfo,
      dataRow,
      setDataRow,
      filterDataAdyen,
      pagination,
      tdcHeader,
      currHeader,
    ]
  );

  return (
    <clousingContext.Provider value={value}>
      {children}
    </clousingContext.Provider>
  );
}
