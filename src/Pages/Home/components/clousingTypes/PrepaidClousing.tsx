import { useState } from "react";
import { Box, Table, Text, FormatNumber  } from "@chakra-ui/react";
import { Toaster } from "@components/ui/toaster";
import FooterClousing from "../FooterClousing";
import { TDCModel } from "@models/tdc.model";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { useHandleCashData } from "@hooks/cashClousing/useHandleCashData";

function PrepaidClousing() {
  const [tdc2Data, setCashData] = useState<TDCModel>()
  // const { cashLoading } = useCashClousing(); //Cambiar por funcion propia
  // const { sendClousing } =  useHandleCashData(tdcData, setCashData); //Cambiar por funcion propia
  
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
            {tdcData?.currencies?.map((item) => (
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
                    <FormatNumber value={item.quantitySupplements} />
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

      {/* <FooterClousing data={tdcData} loading={cashLoading} onChange={sendClousing} /> */}

    </Box>
  );
}

export default PrepaidClousing;

const tdcData = {
"id": 1,
  "employeId": 150,
  "globalTotalPOS": 9622.32,
  "globalTotalFisico": 9622.32,
  "globalDifference": 0,
  "currencies": [
    {
      "id": 1,
      "client": "Thomas Moore",
      "quantity": 3,
      "quantitySupplements": 0,
      "unitPrice": 111.67,
      "POS": 2784.56,
      "physical": 0,
      "difference": 10
    },
    {
      "id": 2,
      "client": "SSIA",
      "quantity": 5,
      "quantitySupplements": 0,
      "unitPrice": 110.00,
      "POS": 208.69,
      "physical": 150,
      "difference": 1
    },
    {
      "id": 3,
      "client": "SEEK AND GO",
      "quantity": 8,
      "quantitySupplements": 0,
      "unitPrice": 115.00,
      "POS": 856.32,
      "physical": 300,
      "difference": 5
    }
  ]
}