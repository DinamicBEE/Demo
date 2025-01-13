import { Box, Table, Text, FormatNumber, IconButton  } from "@chakra-ui/react";

function CustomersClousing() {
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
    
                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.coupons} style="currency" currency="USD" />
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
    
          {/* <FooterClousing data={tdcData} loading={cashLoading} onChange={sendClousing} /> */}
    
        </Box>
  )
}

export default CustomersClousing;

const customer = {
  "id": 1,
  "employeId": 150,
  "currencies": [
      {"id":1, "customers": "AIR CANADA", "coupons": 59, "currency": "MXN", "valuePAX": 300, "amount": 17700.00, "exchangeRate": 1.0, "amountMXN": 17700.00},
      {"id":2, "customers": "BRITISH ", "coupons": 2, "currency": "MXN", "valuePAX": 344, "amount": 688.00, "exchangeRate": 1.0, "amountMXN": 688.00},
      {"id":3, "customers": "SUNWING", "coupons": 7, "currency": "USD", "valuePAX": 20, "amount": 140.00, "exchangeRate": 17.05, "amountMXN": 2380.00},
      {"id":4, "customers": "VIVA AEROBUS", "coupons": 2, "currency": "MXN", "valuePAX": 230, "amount": 466.00, "exchangeRate": 1.0, "amountMXN": 466.00},
  ]
}