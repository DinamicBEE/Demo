import { useEffect, useState } from "react";
import { Box, Table, Text, FormatNumber, Group, InputAddon, Input, Skeleton  } from "@chakra-ui/react";
import { Toaster } from "@components/ui/toaster";
import Loading from "@components/loading";
import { usePrepaidContext } from "@context/clousing/prepaidClousingContext";
import { useFooter } from "@context/home/footerClousingContext";
import { PrepaidLineModel, PrepaidModel } from "@models/prepaid.model";
import { CLOUSING_KEY } from "@models/constants.model";

function PrepaidClousing({data}: any) {
  const [prepaid, setPrepaid] = useState<PrepaidModel>();

  const footerContext = useFooter();
  const prepaidContext = usePrepaidContext();

  const setFooterData = footerContext?.setFooterData;

  useEffect(()=>{
    async function fetchData(){
      const prepaid: PrepaidModel | undefined = prepaidContext?.getPrepaidData
            ? await prepaidContext?.getPrepaidData(data?.id, data?.employeId) : undefined;

      setPrepaid(prepaid);

      if (prepaid?.total) {
        setFooterData?.(prepaid.total, data.id, CLOUSING_KEY.PREPAID);
      }

    }

    fetchData();

  },[])
  
  
  return (
    <Box>
      {/* <Toaster /> */}

      <Group attached mb={4}>
        <InputAddon>Código de Barras</InputAddon>
        <Skeleton loading={prepaidContext?.prepaidLoading}>
          <Input placeholder="Código de Barras" />
        </Skeleton>
      </Group>

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