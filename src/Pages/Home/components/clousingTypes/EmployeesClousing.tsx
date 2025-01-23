import { useState } from "react";
import { Box, Table, Text, FormatNumber, Button  } from "@chakra-ui/react";
import { Toaster } from "@components/ui/toaster";
import FooterClousing from "../FooterClousing";
import { TDCModel } from "@models/tdc.model";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { useHandleCashData } from "@hooks/cashClousing/useHandleCashData";

function EmployeesClousing() {
  const [tdc2Data, setCashData] = useState<TDCModel>()
  const { cashLoading } = useCashClousing(); //Cambiar por funcion propia
  //const { sendClousing } =  useHandleCashData(tdcData, setCashData); //Cambiar por funcion propia
  
  return (
    <Box>
      {/* <Toaster /> */}

      <Button mb={2} >Agregar</Button>

      <Table.ScrollArea rounded="md" borderWidth="1px">
        <Table.Root size="sm" variant="outline" striped>
          <Table.Header>
            <Table.Row>
              <Table.Cell textAlign="center">Empleado</Table.Cell>
              <Table.Cell textAlign="center">No. Empleado</Table.Cell>
              <Table.Cell textAlign="center">Monto</Table.Cell>
              <Table.Cell textAlign="center">Motivo</Table.Cell>
              <Table.Cell textAlign="center">Ticket</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tdcData?.currencies?.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell textAlign="center">
                  <Text> {item.employee} </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text> {item.employeId} </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber
                      value={item.amount}
                      style="currency"
                      currency="USD"
                    />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text> {item.reason} </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text> {item.ticket} </Text>
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

export default EmployeesClousing;

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
      "amount": 125.00,
      "reason": "Diferencia de efectivo",
      "ticket": "---"
    },
    {
      "id": 2,
      "employee": "Luis Castillo",
      "employeId": "0029",
      "amount": 150.00,
      "reason": "Consumo empelado",
      "ticket": "123"
    },
    {
      "id": 3,
      "employee": "BANREGIO",
      "employeId": "0105",
      "amount": 300.00,
      "reason": "Mala elaboración del producto",
      "ticket": "---"
    }
  ]
}