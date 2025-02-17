import { useEffect, useState } from "react";
import { LuEye } from "react-icons/lu";
import { Box, Table, Text, FormatNumber, IconButton  } from "@chakra-ui/react";
import Loading from "@components/loading";
import TDCDetails from "./TDCDetails";
import { useTDCContext } from "@context/clousing/tdcClousingContex";
import { useFooter } from "@context/home/footerClousingContext";
import { BankLineModel, TDCModel } from "@models/tdc.model";
import { CLOUSING_KEY } from "@models/constants.model";

function TDCClousing({data}: any) {
  const [tdcData, setCashData] = useState<TDCModel>();
  const [lineSelected, setLineSeleted] = useState<number | null>(null);
  const [details, setDetails] = useState<boolean>(false);

  const { setFooterData } = useFooter();
  const { getTDCData, tdc, tdcLoading } = useTDCContext();

  useEffect(()=>{
    async function fetchData() {
      const tdc: TDCModel = await getTDCData(data?.id,);
      
      if(tdc?.total){
        setFooterData(tdc.total, data.id, CLOUSING_KEY.TDC);
      }

      setCashData(tdc);

    }

    fetchData();

  },[tdc])

  const openDiaolog = (id: number) =>{
    setLineSeleted(id);
    setDetails(true);
  }

  const closeDiaolog = () => {
    setLineSeleted(null);
    setDetails(false);
  }

  
  return (
    <>
    
      <Box>
        {/* <Toaster /> */}

        <Table.ScrollArea rounded="md" borderWidth="1px">
          <Table.Root size="sm" variant="outline" striped>
            <Table.Header>
              <Table.Row>
                <Table.Cell textAlign="center">Banco</Table.Cell>
                <Table.Cell textAlign="center">POS</Table.Cell>
                <Table.Cell textAlign="center">Físico</Table.Cell>
                <Table.Cell textAlign="center">Cantidad Vouchers</Table.Cell>
                <Table.Cell textAlign="center">Acciones</Table.Cell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {tdcData?.lines?.map((item: BankLineModel) => (
                <Table.Row key={item.id}>
                  
                  <Table.Cell textAlign="center">
                    <Text>{item.bank}</Text>
                  </Table.Cell>

                  <Table.Cell textAlign="end">
                    <Text>
                      <FormatNumber value={item.POS} style="currency" currency="USD" />
                    </Text>
                  </Table.Cell>

                  <Table.Cell textAlign="end">
                    <Text>
                      <FormatNumber value={item.physical} style="currency" currency="USD" />
                    </Text>
                  </Table.Cell>

                  <Table.Cell textAlign="center">
                    <Text>
                      <FormatNumber value={item.voucherAmount} />
                    </Text>
                  </Table.Cell>

                  <Table.Cell textAlign="center">
                    <IconButton 
                      rounded="full" 
                      variant={"ghost"}
                      onClick={() => openDiaolog(item.id)}
                    >
                      <LuEye />
                    </IconButton>
                  </Table.Cell>
              

                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        {tdcLoading && (
          <Box position="fixed" top="50%" left="50%">
            <Loading />
          </Box>
        )}

      </Box>

      <TDCDetails clousingId={data?.id} lineId={lineSelected} isOpen={details} onClose={closeDiaolog}></TDCDetails>
    </>
  );
}

export default TDCClousing;