import { ReportProvider } from "./reportsContext";
import { ReactNode } from "react";


export const ReportsProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ReportProvider>
      { children }
    </ReportProvider>
  );
}