import { useEffect, useState } from "react";
import { Box, Table, Text, FormatNumber  } from "@chakra-ui/react";
import { Toaster } from "@components/ui/toaster";
import { PrepaidLineModel, PrepaidModel } from "@models/prepaid.model";
import { usePrepaidContext } from "@context/clousing/prepaidClousingContext";
import Loading from "@components/loading";

function PrepaidClousing({data}: any) {
  const [prepaid, setPrepaid] = useState<PrepaidModel>();

  const prepaidContext = usePrepaidContext();

  useEffect(()=>{
    async function fetchData(){
      const prepaid: PrepaidModel | undefined = prepaidContext?.getPrepaidData
            ? await prepaidContext?.getPrepaidData(data?.id, data?.employeId) : undefined;

      setPrepaid(prepaid);

    }

    fetchData();

  },[])
  
  
  return (
    <Box>
      {/* <Toaster /> */}

      <Table.ScrollArea rounded="md" borderWidth="1px">
        <Table.Root size="sm" variant="outline" striped>
          <Table.Header>
            <Table.Row>
              <Table.Cell textAlign="center">Cliente</Table.Cell>
              <Table.Cell textAlign="center">Cantidad</Table.Cell>
              <Table.Cell textAlign="center">Cantidad Complementos</Table.Cell>
              <Table.Cell textAlign="center">Precio unitario</Table.Cell>
              <Table.Cell textAlign="center">Total POS</Table.Cell>
              <Table.Cell textAlign="center">Total físico</Table.Cell>
              <Table.Cell textAlign="center">Diferencia</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {prepaid?.lines?.map((item: PrepaidLineModel) => (
              <Table.Row key={item.id}>
                
                <Table.Cell textAlign="center">
                  <Text>{item.client}</Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text>
                    <FormatNumber value={item.quantity} />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text>
                    <FormatNumber value={item.supplementsQuantity} />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber value={item.unitPrice} style="currency" currency="USD" />
                  </Text>
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

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber value={item.difference} style="currency" currency="USD" />
                  </Text>
                </Table.Cell>
            

              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {prepaidContext?.prepaidLoading && <Loading />}

    </Box>
  );
}

export default PrepaidClousing;