import { Box, Heading, HStack,  } from "@chakra-ui/react"
import { useState } from "react"
import LateralMenu from "./layouts/LateralMenu";
import Filters from "./layouts/Filters";
import ReportTable from "./layouts/ReportTable";


function Reports() {
  const [open, setOpen] = useState(false)



  return(<>
    
    <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
      <HStack>
        <LateralMenu open={open} setOpen={setOpen} />
        <Heading>Reportes 2.0</Heading>
      </HStack>
      <Filters />
      <ReportTable />
    </Box>
  </>);

}

export default Reports;