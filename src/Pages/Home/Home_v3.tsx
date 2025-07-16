import { Box, Heading, IconButton, VStack } from "@chakra-ui/react";
import TableOfTotals from "./components/table/TableOfTotals";
import { useLocation, useNavigate } from 'react-router-dom';
import { HomeParamsProps } from "@models/common.clousing.model";
import { IoReturnUpBack } from "react-icons/io5";
import { useEffect } from "react";
import { useClousing } from "@context/home/clousingContext";

function Home_v3() {
    const location = useLocation();
    const navigate = useNavigate();
    const { getInfo } = useClousing();
    const { homeParams } = location.state as { homeParams: HomeParamsProps };
  
    useEffect(() => {

      if (!homeParams || !homeParams.subsidiary || !homeParams.store || !homeParams.date) {
        navigate("/homeV2");
      } else {
        getInfo(homeParams.store?.id ?? 0, 0, new Date(homeParams.date + "T00:00:00"), new Date(homeParams.date + "T00:00:00"), true)
      }

    }, []);
    
  return (
    <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
      <VStack align={"start"} gap={1} flexDirection="row" alignItems="center" mb={4}>

        <IconButton aria-label="Call support" variant="ghost" colorPalette="meraWarning" onClick={() => navigate("/homeV2")}>
          <IoReturnUpBack />
        </IconButton>

        <Heading>Corte de caja</Heading>
        
      </VStack>
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
