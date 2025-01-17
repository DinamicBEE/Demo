import { useState } from "react";
import { Box, Table, Text, FormatNumber  } from "@chakra-ui/react";
import FooterClousing from "../FooterClousing";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { useHandleCashData } from "@hooks/cashClousing/useHandleCashData";

function SpecialCustomersClousing() {
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
                  <Table.Cell textAlign="center">Cheque</Table.Cell>
                  <Table.Cell textAlign="center">Consumo</Table.Cell>
                  <Table.Cell textAlign="center">Precio cupón</Table.Cell>
                  <Table.Cell textAlign="center">Diferencia</Table.Cell>
                  <Table.Cell textAlign="center">Tipo de cambio</Table.Cell>
                  <Table.Cell textAlign="center">Cliente</Table.Cell>
                  <Table.Cell textAlign="center">PAX</Table.Cell>
                  <Table.Cell textAlign="center">Folio cupones</Table.Cell>
                  <Table.Cell textAlign="center">Folio cupones USD</Table.Cell>
                  <Table.Cell textAlign="center">Valor</Table.Cell>
                  <Table.Cell textAlign="center">Valor USD</Table.Cell>
                  <Table.Cell textAlign="center">Vuelo</Table.Cell>
                  <Table.Cell textAlign="center">Nombre pasajero</Table.Cell>
                  <Table.Cell textAlign="center">Monto MXN</Table.Cell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {customer?.currencies?.map((item) => (
                  <Table.Row key={item.id}>
                    
                    <Table.Cell textAlign="center">
                      <Text>
                        <FormatNumber value={item.Check} />  
                      </Text>
                    </Table.Cell>
    
                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.consumption} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell>
    
                    <Table.Cell textAlign="end">
                      <FormatNumber value={item.priceCuopon} style="currency" currency="USD" />
                    </Table.Cell>
    
                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.difference} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell>

                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.exchangeRate} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell> 

                    <Table.Cell textAlign="center">
                      <Text>
                        {item.client}
                      </Text>
                    </Table.Cell>               
    
                    <Table.Cell textAlign="center">
                      <Text>
                        <FormatNumber value={item.PAX} />
                      </Text>
                    </Table.Cell>

                    <Table.Cell textAlign="center">
                      <Text>
                        {item.folioCuopon}
                      </Text>
                    </Table.Cell>

                    <Table.Cell textAlign="center">
                      <Text>
                        {item.folioCuoponUSD}
                      </Text>
                    </Table.Cell> 

                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.value} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell> 

                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.valueUSD} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell> 

                    <Table.Cell textAlign="center">
                      <Text>
                        {item.flight}
                      </Text>
                    </Table.Cell> 

                    <Table.Cell textAlign="center">
                      <Text>
                        {item.passengerName}
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
    
          {/* <FooterClousing data={customer} loading={cashLoading} onChange={sendClousing} /> */}
    
        </Box>
  )
}

export default SpecialCustomersClousing;

const customer = {
  "id": 1,
  "employeId": 150,
  "globalTotalPOS": 9622.32,
  "globalTotalFisico": 9622.32,
  "globalDifference": 0,
  "currencies": [
      {"id":1, "Check": 420, "consumption": 258.00, "priceCuopon": 0, "difference": 0, "exchangeRate": 1.0, "client": "AMERICAN AIRLINES",
        "PAX": 0, "folioCuopon": "0", "folioCuoponUSD": "0", "value": 1, "valueUSD": 1, "flight": "OFCEM", "passengerName": "JUAN PEREZ", "amountMXN": 1
      },
      {"id":2, "Check": 400, "consumption": 500.00, "priceCuopon": 0, "difference": 0, "exchangeRate": 1.0, "client": "AMERICAN AIRLINES",
        "PAX": 0, "folioCuopon": "0", "folioCuoponUSD": "0", "value": 1, "valueUSD": 1, "flight": "OGCEM", "passengerName": "JUAN PEREZ", "amountMXN": 1
      },
      {"id":3, "Check": 120, "consumption": 150.00, "priceCuopon": 0, "difference": 0, "exchangeRate": 17.00, "client": "AMERICAN AIRLINES",
        "PAX": 0, "folioCuopon": "0", "folioCuoponUSD": "0", "value": 1, "valueUSD": 1, "flight": "OFCIP", "passengerName": "JUAN PEREZ", "amountMXN": 1
      },
      {"id":4, "Check": 150, "consumption": 200.00, "priceCuopon": 0, "difference": 0, "exchangeRate": 1.0, "client": "AMERICAN AIRLINES",
        "PAX": 0, "folioCuopon": "0", "folioCuoponUSD": "0", "value": 1, "valueUSD": 1, "flight": "PFTRE", "passengerName": "JUAN PEREZ", "amountMXN": 1
      }
  ]
}