import { Box } from "@chakra-ui/react";
import TableOfTotals from "./components/table/TableOfTotals";
import { useLocation } from 'react-router-dom';
import { HomeParamsProps } from "@models/common.clousing.model";

function Home_v3() {
    const location = useLocation();
    const { homeParams } = location.state as { homeParams: HomeParamsProps };
    
  return (
    <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
      
      <TableOfTotals
        subsidiary={homeParams.subsidiary!}
        store={homeParams.store!}
        startDate={new Date(`${homeParams.date}T00:00:00`) ?? new Date()}
        endDate={new Date(`${homeParams.date}T00:00:00`) ?? new Date()}
        isReport={false}
      />

    </Box>
  );
}

export default Home_v3;
