import { useEffect, useState } from "react";
import { Box, Table, Text, FormatNumber, createListCollection, SelectValueText, SelectContent, SelectItem, ListCollection } from "@chakra-ui/react";
import { SelectRoot, SelectTrigger } from "@components/ui/select";
import FooterClousing from "../FooterClousing";
import { useCustomerContext } from "@context/clousing/customerClousingContext";
//import { useHandleCashData } from "@hooks/cashClousing/useHandleCashData";
import { TableInput } from "@components/NumericInput";
import { CustomerLines, CustomerModel } from "@models/customer.model";
import { getCurrencies } from "@services/catalogService";
import { CurrencyModel } from "@models/common.clousing.model";

function CustomersClousing({data}: any) {
  const [currenciesForSelect, setcurrenciesForSelect] = useState<ListCollection>();
  const [currencies, setCurrencies] = useState<CurrencyModel[]>()
  const [CustomersData, setCustomersData] = useState<CustomerModel>()
  const customerContext = useCustomerContext();
  //const handleCashData = useHandleCashData(CustomersData, setCustomersData); //Cambiar por funcion propia
  
  // const sendClousing = handleCashData?.sendClousing ?? (() => Promise.resolve(false));
  // const customerLoading = customerContext?.customerLoading ?? false;
  const getCustomerData = customerContext?.getCustomerData;
  
  useEffect(()=>{
    async function fetchData() {
      const customers = getCustomerData ? await getCustomerData(data.id, data.employe) : {};

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

  function SelectCurrency(value:any, id:number) {
    const selectValue = value[0];
    
    const newCurrency = currencies?.filter((item:CurrencyModel) => item.value === selectValue)[0]?.label || "";
    const newExchangeRage = currencies?.filter((currency:CurrencyModel) => currency.value === selectValue)[0]?.exchangeRate || 0;

    if (!CustomersData) return;

    const updatedCurrencies = CustomersData.lines.map((item: CustomerLines) =>
      item.id === id
        ? {
            ...item,
            currency: newCurrency,
            exchangeRate: newExchangeRage,
            amountMXN: item.amount > 0
              ? (newExchangeRage * item.amount)
              : item.amountMXN,
          }
        : item
    );

    setCustomersData({ ...CustomersData, lines: updatedCurrencies });
  }

  function handleCoupons(id:number, value:string){
    
    value = value.replace(/[^\d.]/g, "");

    if (!CustomersData) return;

    const updatedCurrencies = CustomersData.lines.map((item: CustomerLines) =>
      item.id === id
        ? {
            ...item,
            coupons: parseFloat(value),
            amount: item.valuePAX > 0 
              ? (parseFloat(value) * item.valuePAX)
              : item.amount,
            amountMXN: item.valuePAX > 0 && item.exchangeRate > 0
              ? ((parseFloat(value) * item.valuePAX) * item.exchangeRate)
              : item.amountMXN,
          }
        : item
    );

    CustomersData.lines = updatedCurrencies;

    setCustomersData({...CustomersData})
  }

  function handleAmountPAX(id:number, value:string){
    
    value = value.replace(/[^\d.]/g, "");

    if (!CustomersData) return;

    const updatedCurrencies = CustomersData.lines.map((item: CustomerLines) =>
      item.id === id
        ? {
            ...item,
            valuePAX: parseFloat(value),
            amount: item.coupons > 0 
              ? (parseFloat(value) * item.coupons)
              : item.amount,
            amountMXN: item.coupons > 0 && item.exchangeRate > 0
              ? ((parseFloat(value) * item.coupons) * item.exchangeRate)
              : item.amountMXN,
          }
        : item
    );

  CustomersData.lines = updatedCurrencies;

    setCustomersData({...CustomersData})
  }

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
                        onValueChange={(e) => {SelectCurrency(e.value, item.id)}}
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
    
          {/* <FooterClousing data={CustomersData?.total} loading={customerLoading} onChange={sendClousing} /> */}
    
        </Box>
  )
}

export default CustomersClousing;


