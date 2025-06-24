import { Box, Heading, HStack } from "@chakra-ui/react"
import { useState } from "react"
import LateralMenu from "./layouts/LateralMenu";
import Filters from "./layouts/Filters";
import ReportTable from "./layouts/ReportTable";

function Reports() {
  const [open, setOpen] = useState(false);
  const [currentReport, setCurrentReport] = useState<number | null>(null);

  // Función para manejar el cambio de reporte
  const handleReportChange = (reportCode: number) => {
    setCurrentReport(reportCode);
    // Aquí puedes agregar lógica adicional cuando cambia el reporte
    console.log("Reporte cambiado a:", reportCode);
  };

  return (
    <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
      <HStack>
        <LateralMenu 
          open={open} 
          setOpen={setOpen} 
          currentReport={currentReport}
          onReportClick={handleReportChange} // Pasamos el manejador como prop
        />
        <Heading>Reportes 2.0</Heading>
      </HStack>
      
      <Filters currentReport={currentReport}/>
      
      { currentReport !== null && <ReportTable currentReport={currentReport} /> }

    </Box>
  );
}

export default Reports;