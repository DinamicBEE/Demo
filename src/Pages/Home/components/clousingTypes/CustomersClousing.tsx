import { useState } from "react";
import { Box, Table, Text, FormatNumber, IconButton  } from "@chakra-ui/react";
import FooterClousing from "../FooterClousing";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { useHandleCashData } from "@hooks/cashClousing/useHandleCashData";

function CustomersClousing() {
  const [tdc2Data, setCashData] = useState() //Cambiar por funcion propia
  const { cashLoading } = useCashClousing(); //Cambiar por funcion propia
  const { sendClousing } =  useHandleCashData(customer, setCashData); //Cambiar por funcion propia
    

  return (
        <Box>
          {/* <Toaster /> */}
    
          <Table.ScrollArea rounded="md" borderWidth="1px">
            <Table.Root size="sm" variant="outline" striped>
              <Table.Header>
                <Table.Row>
                  <Table.Cell textAlign="center">Clientes</Table.Cell>
                  <Table.Cell textAlign="center">Cupones</Table.Cell>
                  <Table.Cell textAlign="center">Moneda</Table.Cell>
                  <Table.Cell textAlign="center">Valor PAX</Table.Cell>
                  <Table.Cell textAlign="center">Monto</Table.Cell>
                  <Table.Cell textAlign="center">Tasa de cambio</Table.Cell>
                  <Table.Cell textAlign="center">Monto MXN</Table.Cell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {customer?.currencies?.map((item) => (
                  <Table.Row key={item.id}>
                    
                    <Table.Cell textAlign="center">
                      <Text>{item.customers}</Text>
                    </Table.Cell>
    
                    <Table.Cell textAlign="center">
                      <Text>
                        <FormatNumber value={item.coupons} />
                      </Text>
                    </Table.Cell>
    
                    <Table.Cell textAlign="center">
                      <Text>{item.currency}</Text>
                    </Table.Cell>
    
                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.valuePAX} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell>

                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.amount} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell> 

                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.exchangeRate} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell> 

                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.amountMXN} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell>               
    
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
    
          <FooterClousing data={customer} loading={cashLoading} onChange={sendClousing} />
    
        </Box>
  )
}

export default CustomersClousing;

const customer = {
  "id": 1,
  "employeId": 150,
  "globalTotalPOS": 9622.32,
  "globalTotalFisico": 9622.32,
  "globalDifference": 0,
  "currencies": [
      {"id":1, "customers": "AIR CANADA", "coupons": 59, "currency": "MXN", "valuePAX": 300, "amount": 17700.00, "exchangeRate": 1.0, "amountMXN": 17700.00},
      {"id":2, "customers": "BRITISH ", "coupons": 2, "currency": "MXN", "valuePAX": 344, "amount": 688.00, "exchangeRate": 1.0, "amountMXN": 688.00},
      {"id":3, "customers": "SUNWING", "coupons": 7, "currency": "USD", "valuePAX": 20, "amount": 140.00, "exchangeRate": 17.05, "amountMXN": 2380.00},
      {"id":4, "customers": "VIVA AEROBUS", "coupons": 2, "currency": "MXN", "valuePAX": 230, "amount": 466.00, "exchangeRate": 1.0, "amountMXN": 466.00},
  ]
}