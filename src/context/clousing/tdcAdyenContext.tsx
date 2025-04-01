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
    async (Files: File[], store: string, location: string) => {




      if (!store || !location) {
        return;
      }
console.log("store", store);
console.log("location", location);


      const data = await processFiles(Files, store, location);
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
