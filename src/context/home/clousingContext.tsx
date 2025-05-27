import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { getGeneralInfo } from "@services/homeService";
import {
  ClousingContextType,
  ClousingLinesModel,
  ClousingModel,
  HeaderClousingModel,
  TDC,
} from "@models/common.clousing.model";

const clousingContext = createContext<ClousingContextType>(
  {} as ClousingContextType
);

export const useClousing = () => useContext(clousingContext);

export function ClousingProvider({ children }: { children: ReactNode }) {
  const [header, setHeader] = useState<HeaderClousingModel>(
    {} as HeaderClousingModel
  );
  const [data, setData] = useState<ClousingLinesModel[]>(
    [] as ClousingLinesModel[]
  );
  const [originalData, setOriginalData] = useState<ClousingLinesModel[]>(
    [] as ClousingLinesModel[]
  );
  const [pagination, setPagination] = useState({
    totaRegistros: 0,
    totalPagina: 0,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [dataClousing, setDataClousing] = useState<any>({}); // por el momento no tiene un Modelo.
  const [dataRow, setDataRow] = useState<ClousingLinesModel>(
    {} as ClousingLinesModel
  );
  const dataCache = useRef<{ [key: string]: ClousingModel }>({});
  const queryKey = useRef<string>("");
  const setQueryKey = useRef<string>("");
  const [tdcHeader, setTdcHeader] = useState<TDC[]>([]);

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
      subsidiary: number,
      store: number,
      page: number,
      startDate: Date,
      endDate: Date,
      isSearch: boolean = false
    ) => {
      try {
        // Clave para identificar la consulta sin incluir página
        const queryKey = `${subsidiary}-${store}-${startDate.toISOString()}-${endDate.toISOString()}`;
        /*    queryKey.current = queryKey;
        setQueryKey.current = queryKey;
 */
        // Clave para esta página específica
        const pageKey = `${queryKey}-page-${page}`;

        if (isSearch) {
          // Limpiar caché si es una búsqueda
          dataCache.current = {};
        }

        // Verificar si esta página ya está en caché
        if (dataCache.current[pageKey] && !isSearch) {
          // Actualizar header y pagination desde los datos de esta página
          const accumulated = accumulatedHeader(queryKey);
          const data = {
            ...dataCache.current[pageKey].header,
            totalPOS: accumulated.totalPOS,
            totalPhysical: accumulated.totalPhysical,
            difference: accumulated.difference,
          };

          setHeader(data);
          setPagination(dataCache.current[pageKey].pagination);

          // Usar solo los datos de la página actual
          const currentPageData = dataCache.current[pageKey].clousingLines;

          // Actualizar con los datos de la página actual
          setData(currentPageData);
          setOriginalData(currentPageData);
          setTdcHeader(dataCache.current[pageKey].clousingLines[0]?.tdc || []);
          return;
        }

        // Necesitamos obtener esta página
        setLoading(true);

        const response = await getGeneralInfo(
          subsidiary,
          store,
          page,
          startDate,
          endDate
        );

        // Guardar esta página en caché
        dataCache.current[pageKey] = response;

       
        const accumulated = accumulatedHeader(queryKey);
        const data = {
          ...response.header,
          totalPOS: accumulated.totalPOS,
          totalPhysical: accumulated.totalPhysical,
          difference: accumulated.difference,
        };
        // Actualizar header y pagination
        setHeader(data);
        setPagination(response.pagination);

        // Usar solo los datos de la página actual
        const currentPageData = response.clousingLines;

        // Actualizar con los datos de la página actual
        setData(currentPageData);
        setOriginalData(currentPageData);
        setTdcHeader(response.clousingLines[0]?.tdc || []);

        
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

  useEffect(() => {
    if (dataClousing.id) {
      setData((prevData) =>
        prevData.map((item) =>
          item.id == dataClousing.id
            ? {
                ...item,
                closingConfirmation: dataClousing.closingConfirmation,
                totalPhysical: dataClousing.totalClousing,
                difference: dataClousing.difference,
                customer: dataClousing.customer,
                specialCustomer: dataClousing.specialCustomer,
                employees: dataClousing.employee,
                intercompany: dataClousing.intercompany,
                prepaid: dataClousing.prepaid,
                status: dataClousing.status,
                mxm: dataClousing.mxm,
                usd: dataClousing.usd,
                eur: dataClousing.eur,
                lib: dataClousing.lib,
                can: dataClousing.can,
                tdc: dataClousing.tdc,
              }
            : item
        )
      );
    }
  }, [dataClousing]);

  const value = useMemo(
    () => ({
      header,
      data,
      pagination,
      loading,
      error,
      getInfo,
      dataClousing,
      setDataClousing,
      dataRow,
      setDataRow,
      filterDataAdyen,
      tdcHeader,
    }),
    [
      header,
      data,
      loading,
      error,
      getInfo,
      dataClousing,
      setDataClousing,
      dataRow,
      setDataRow,
      filterDataAdyen,
      pagination,
      tdcHeader,
    ]
  );

  return (
    <clousingContext.Provider value={value}>
      {children}
    </clousingContext.Provider>
  );
}
