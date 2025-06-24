import { ReportsSectionProvider } from "./reportsContext";
import { ReportProvider } from "./reportContext";
import { ReactNode } from "react";


export const ReportsProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ReportProvider>
      <ReportsSectionProvider>
        { children }
      </ReportsSectionProvider>
    </ReportProvider>
  );
}