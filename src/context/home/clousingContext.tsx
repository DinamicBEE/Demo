import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { getGeneralInfo } from "@services/homeService";
import {
  ClousingContextType,
  ClousingLinesModel,
  HeaderClousingModel,
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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [dataClousing, setDataClousing] = useState<any>({}); // por el momento no tiene un Modelo.
  const [dataRow, setDataRow] = useState<ClousingLinesModel>({} as ClousingLinesModel);
  
  const getInfo = useCallback(async (subsidiary:number, store:number) => {
    try {
      setLoading(true);

      const response = await getGeneralInfo(subsidiary, store);

      setHeader(response.header);
      setData(response.clousingLines);
      setOriginalData(response.clousingLines);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));

      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const filterDataAdyen = useCallback((isAdyen: boolean) => {
    if (isAdyen) {
      // Filtrar solo elementos con adyenTotal definido
      const dataAdyen = originalData.filter(
        (item) => {
          return item.adyenTotal !== undefined;
        }
      );
      setData(dataAdyen);
    } else {
      // Restaurar los datos originales
      setData(originalData);
    }
  }, [originalData]);

  useEffect(() => {
    if (dataClousing.id) {
      setData((prevData) =>
        prevData.map((item) =>
          item.id == dataClousing.id
            ? {
                ...item,
                closingConfirmation: true,
                totalPhysical: dataClousing.totalClousing,
                difference: dataClousing.difference,
                customer: dataClousing.customer,
                specialCustomer: dataClousing.specialCustomer,
                employees: dataClousing.employee,
                intercompany: dataClousing.intercompany,
                prepaid: dataClousing.prepaid,
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
      loading,
      error,
      getInfo,
      dataClousing,
      setDataClousing,
      dataRow,
      setDataRow,
      filterDataAdyen,
    }),
    [header, data, loading, error, getInfo, dataClousing, setDataClousing, dataRow, setDataRow, filterDataAdyen,]
  );

  return (
    <clousingContext.Provider value={value}>
      {children}
    </clousingContext.Provider>
  );
}
