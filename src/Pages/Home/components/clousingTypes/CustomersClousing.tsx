import { useEffect, useState } from "react";
import { Box, Table, Text, FormatNumber, createListCollection, SelectValueText, SelectContent, SelectItem, ListCollection } from "@chakra-ui/react";
import { SelectRoot, SelectTrigger } from "@components/ui/select";
import { useCustomerContext } from "@context/clousing/customerClousingContext";
import { useHandleCustomer } from "@hooks/customerClousing/useHandleCustomerData";
import { TableInput } from "@components/NumericInput";
import { CustomerLines, CustomerModel } from "@models/customer.model";
import { getCurrencies } from "@services/catalogService";
import { CurrencyModel } from "@models/common.clousing.model";

function CustomersClousing({data}: any) {
  const [currenciesForSelect, setcurrenciesForSelect] = useState<ListCollection>();
  const [currencies, setCurrencies] = useState<CurrencyModel[]>()
  const [CustomersData, setCustomersData] = useState<CustomerModel>()
  const customerContext = useCustomerContext();
  const handleCustomer = useHandleCustomer(CustomersData, setCustomersData);
  
  const selectCurrency = handleCustomer?.selectCurrency;
  const handleCoupons = handleCustomer?.handleCoupons;
  const handleAmountPAX = handleCustomer?.handleAmountPAX;
  
  useEffect(()=>{
    async function fetchData() {
      const customers = customerContext?.getCustomerData
            ? await customerContext?.getCustomerData(data.id, data.employeId) : {};

      const currencies = await getCurrencies()

      let createCurrenciList = createListCollection({
        items: currencies
      })

      setCustomersData(customers);
      setcurrenciesForSelect(createCurrenciList);
      setCurrencies(currencies);
    }
    fetchData();
  
  }, [])

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
                {CustomersData?.lines?.map((item: CustomerLines) => (
                  <Table.Row key={item.id}>
                    
                    <Table.Cell textAlign="center">
                      <Text>{item.customers}</Text>
                    </Table.Cell>
    
                    <Table.Cell textAlign="center">
                      <Text>
                        <TableInput value={item.coupons} id={item.id} currency={false} onChange={handleCoupons} />
                      </Text>
                    </Table.Cell>
    
                    <Table.Cell textAlign="center">
                      <SelectRoot 
                         
                        collection={currenciesForSelect || createListCollection({ items: [] })} 
                        onValueChange={(e) => selectCurrency?.(e.value, item.id, currencies)}
                      >
                        
                        <SelectTrigger>
                          <SelectValueText placeholder="Seleccionar moneda" />
                        </SelectTrigger>
                        
                        <SelectContent>
                          {currenciesForSelect && Array.from(currenciesForSelect).map((item) => (
                            <SelectItem item={item} key={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>

                      </SelectRoot>
                    </Table.Cell>
    
                    <Table.Cell textAlign="end">
                      <Text>
                        <TableInput value={item.valuePAX} id={item.id} currency={true} onChange={handleAmountPAX} />
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
    
        </Box>
  )
}

export default CustomersClousing;


