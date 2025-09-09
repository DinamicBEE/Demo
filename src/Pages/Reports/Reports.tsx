import { Box, Heading, HStack, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import LateralMenu from "./layouts/LateralMenu";
import Filters from "./layouts/Filters";
import ReportTable from "./layouts/ReportTable";
import { REPORT_KEY } from "@models/const/reports.const";

function Reports() {
  const [open, setOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState<number | null>(REPORT_KEY.REPMIX_01);
  const [reportName, setReportName] = useState<string>('Reporte no seleccionado')
  
  // Función para manejar el cambio de reporte
  const handleReportChange = (reportCode: number) => {
    setCurrentReport(reportCode);
  };

  const handleReportNameChange = (name: string) => {
    setReportName(name || 'Reporte no seleccionado')
  }

  return (
    <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
      <VStack align={"start"} gap={1}>
        <LateralMenu 
          open={open} 
          setOpen={setOpen}
          currentReport={currentReport}
          onReportClick={handleReportChange} // Pasamos el manejador como prop
        />
        
        <Heading paddingLeft={4}> {reportName} </Heading>
      </VStack>
      
      <Filters currentReport={currentReport} reportName={handleReportNameChange}/>
      
      { currentReport !== null && <ReportTable currentReport={currentReport} /> }

    </Box>
  );
}

export default Reports;