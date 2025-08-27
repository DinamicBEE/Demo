import { ReporGeneralRequesttModel, ReportContextType } from "@models/reports.model";
import { REPORT_EXECPTION } from "@models/reportsConstService.model";
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
          //TODO: validar logica
          setLoading(true)
          const isException = REPORT_EXECPTION.includes(reportRequest.report);
          const response = await getReports(reportRequest);
          let newResponse: any;
          //if(isException){
            newResponse = response;
          // } else {
          //   newResponse = response.map((item: any) => {
          //     const date = new Date(`${item.date}T00:00:00`);
          //     const day = date.getDate().toString().padStart(2, "0");
          //     const month = (date.getMonth() + 1).toString().padStart(2, "0");
          //     const year = date.getFullYear();
          //     return {
          //       ...item,
          //       date: `${day}/${month}/${year}`,
          //     };
          //   })
          // }
          console.log(newResponse);
          
          setReportData(newResponse);

          return response;
        } catch (error) {
          //TODO: Gestionar error
          console.error(error);
          return {};
        } finally {
          setLoading(false)
        }
      },
      [reportData]
    );


    const value = useMemo(
        () => ({
          reportData,
          loading,
          getReportData
        }),
        [reportData, loading, getReportData]
      );
    return(
        <reportsContext.Provider value={value}>
            { children }
        </reportsContext.Provider>
    )
}