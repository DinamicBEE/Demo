import { useState } from "react";
import { Box, Table, Text, FormatNumber, Button  } from "@chakra-ui/react";
import { Toaster } from "@components/ui/toaster";
import FooterClousing from "../FooterClousing";
import { TDCModel } from "@models/tdc.model";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { useHandleCashData } from "@hooks/cashClousing/useHandleCashData";

function IntercompanyClousing() {
  const [tdc2Data, setCashData] = useState<TDCModel>()
  const { cashLoading } = useCashClousing(); //Cambiar por funcion propia
  const { sendClousing } =  useHandleCashData(tdcData, setCashData); //Cambiar por funcion propia
  
  return (
    <Box>
      {/* <Toaster /> */}

      <Button mb={2} >Agregar</Button>

      <Table.ScrollArea rounded="md" borderWidth="1px">
        <Table.Root size="sm" variant="outline" striped>
          <Table.Header>
            <Table.Row>
              <Table.Cell textAlign="center">Empleado</Table.Cell>
              <Table.Cell textAlign="center">Subsidiaria</Table.Cell>
              <Table.Cell textAlign="center">Monto POS</Table.Cell>
              <Table.Cell textAlign="center">Ticket</Table.Cell>
              <Table.Cell textAlign="center">Importe físico</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tdcData?.currencies?.map((item) => (
              <Table.Row key={item.id}>
                
                <Table.Cell textAlign="center">
                  <Text> {item.employee} </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text> {item.subsidiary} </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber
                      value={item.amountPOS}
                      style="currency"
                      currency="USD"
                    />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text> {item.ticket} </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                    <FormatNumber
                      value={item.physical}
                      style="currency"
                      currency="USD"
                    />
                </Table.Cell>

              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
      
      {/* <FooterClousing
        data={tdcData}
        loading={cashLoading}
        onChange={sendClousing}
      /> */}
    </Box>
  );
}

export default IntercompanyClousing;

const tdcData = {
"id": 1,
  "employeId": 150,
  "globalTotalPOS": 9622.32,
  "globalTotalFisico": 9622.32,
  "globalDifference": 0,
  "currencies": [
    {
      "id": 1,
      "employee": "Mario Vásquez",
      "employeId": "0015",
      "subsidiary": "ABT2",
      "subsidiaryId": 1,
      "amountPOS": 125.00,
      "ticket": "654",
      "physical": 125.00
    },
    {
      "id": 2,
      "employee": "Luis Castillo",
      "employeId": "0029",
      "subsidiary": "ABT1",
      "subsidiaryId": 2,
      "amountPOS": 150.00,
      "ticket": "123",
      "physical": 150.00
    },
    {
      "id": 3,
      "employee": "Victor Garrido",
      "employeId": "0105",
      "subsidiary": "ABT2",
      "subsidiaryId": 3,
      "amountPOS": 300.00,
      "ticket": "789",
      "physical": 300.00
    }
  ]
}