import { ReporGeneralRequesttModel, ReportContextType } from "@models/reports.model";
import { getReports } from "@services/reportService";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

const reportsContext = createContext<ReportContextType>({} as ReportContextType);

export const useReportsContext = () => useContext(reportsContext);

export function ReportsSectionProvider({ children } : { children : ReactNode }){

    const [reportData, setReportData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false)

    const getReportData = useCallback(
      async (reportRequest: ReporGeneralRequesttModel) => {

        try {

          setLoading(true)
          const response = await getReports(reportRequest);
          console.log(response)
          setReportData(response);

          return response;
        } catch (error) {

          console.error(error);
          return {};
        } finally {
          setLoading(false)
        }
      },
      [reportData]
    );

    const cleanReportData = () => {
      setReportData([]);
    }

    const value = useMemo(
        () => ({
          reportData,
          loading,
          getReportData,
          cleanReportData
        }),
        [reportData, loading, getReportData, cleanReportData]
      );
    return(
        <reportsContext.Provider value={value}>
            { children }
        </reportsContext.Provider>
    )
}