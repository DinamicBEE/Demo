import { ReactNode, useRef } from "react";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { processFiles } from "@services/clousingService";
import { TDCAdyenContextType } from "@models/tdc.model";
import { ProcessResult } from "@models/adyen.model";
import { useList } from "@context/home/listsContext";

const tdcAdyenContext = createContext<TDCAdyenContextType>(
  {} as TDCAdyenContextType
);

export const useTDCAdyenContext = () => useContext(tdcAdyenContext);

export function TDCAdyenClousingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [dataFilesProcess, setDataFilesProcess] = useState<ProcessResult>(
    {} as ProcessResult
  );
  const { getStoresData, getSubsidiariesData } = useList();

  const fetchProcessFiles = useCallback(
    async (Files: File[], store: number, location: number) => {
      const storesData = await getStoresData();
      const subsidiaries = await getSubsidiariesData();


      

      const storeName = storesData.find(
        (storeContext) => storeContext.id === location
      )?.name;
      const locationName = subsidiaries.find(
        (subsidiary) => subsidiary.id === store
      )?.name;



      if (!storeName || !locationName) {
        return;
      }

      const data = await processFiles(Files, storeName, locationName);
      setDataFilesProcess(data);
      return data;
    },
    []
  );

  const value = useMemo(
    () => ({
      dataFilesProcess,
      fetchProcessFiles,
      setDataFilesProcess,
    }),
    [dataFilesProcess, fetchProcessFiles, setDataFilesProcess]
  );

  return (
    <tdcAdyenContext.Provider value={value}>
      {children}
    </tdcAdyenContext.Provider>
  );
}
