import { useState } from "react";
import { Box, Table, Text, FormatNumber, IconButton  } from "@chakra-ui/react";
import { LuEye } from "react-icons/lu";
import { Toaster } from "@components/ui/toaster";
import FooterClousing from "../FooterClousing";
import { TDCModel } from "@models/tdc.model";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { useHandleCashData } from "@hooks/cashClousing/useHandleCashData";

function TDCClousing() {
  const [tdc2Data, setCashData] = useState<TDCModel>()
  const { cashLoading } = useCashClousing(); //Cambiar por funcion propia
  const { sendClousing } =  useHandleCashData(tdcData, setCashData); //Cambiar por funcion propia
  
  return (
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
            {tdcData?.currencies?.map((item) => (
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
                  <IconButton rounded="full" variant={"ghost"}>
                    <LuEye />
                  </IconButton>
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

export default TDCClousing;

const tdcData = {
"id": 1,
  "employeId": 150,
  "globalTotalPOS": 9622.32,
  "globalTotalFisico": 9622.32,
  "globalDifference": 0,
  "currencies": [
    {
      "id": 1,
      "bank": "BBVA",
      "POS": 2784.56,
      "physical": 0,
      "voucherAmount": 10
    },
    {
      "id": 2,
      "bank": "HSBC",
      "POS": 208.69,
      "physical": 150,
      "voucherAmount": 1
    },
    {
      "id": 3,
      "bank": "BANREGIO",
      "POS": 856.32,
      "physical": 300,
      "voucherAmount": 5
    }
  ]
}