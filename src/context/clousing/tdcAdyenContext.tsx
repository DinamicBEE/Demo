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

const tdcAdyenContext = createContext<TDCAdyenContextType>(
  {} as TDCAdyenContextType
);

export const useTDCAdyenContext = () => useContext(tdcAdyenContext);

export function TDCAdyenClousingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [dataFilesProcess, setDataFilesProcess] = useState<any>([]);

  const fetchProcessFiles = useCallback(async (Files: File[]) => {
    const data = await processFiles(Files);
    setDataFilesProcess(data);
    return data;
  }, []);

  const value = useMemo(
    () => ({
      dataFilesProcess,
      fetchProcessFiles,
    }),
    [dataFilesProcess, fetchProcessFiles]
  );

  return (
    <tdcAdyenContext.Provider value={value}>
      {children}
    </tdcAdyenContext.Provider>
  );
}
