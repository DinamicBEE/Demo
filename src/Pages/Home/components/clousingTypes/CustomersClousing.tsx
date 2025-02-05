import { useEffect, useState } from "react";
import { Box, Table, Text, FormatNumber, createListCollection, SelectValueText, SelectContent, SelectItem, ListCollection } from "@chakra-ui/react";
import { SelectRoot, SelectTrigger } from "@components/ui/select";
import FooterClousing from "../FooterClousing";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { useHandleCashData } from "@hooks/cashClousing/useHandleCashData";
import { TableInput } from "@components/NumericInput";

function CustomersClousing() {
  const [currenciesForSelect, setcurrenciesForSelect] = useState<ListCollection>();
  const [tdcData, setTDCData] = useState<any>({})
  const { cashLoading } = useCashClousing(); //Cambiar por funcion propia
  const { sendClousing } =  useHandleCashData(TDCMOCKData, setTDCData); //Cambiar por funcion propia
  
  useEffect(()=>{
    async function fetchData() {
      //const tdcData = await getCashData(data.id, data.employe);
      const tdcData = TDCMOCKData;

      let createCurrenciList = createListCollection({
        items: currenciesS
      })

      setTDCData(tdcData);
      setcurrenciesForSelect(createCurrenciList)
    }
    fetchData();
  
  }, [])

  function SelectCurrency(value:any, id:number) {
    const selectValue = value[0];
    
    const newCurrency = currenciesS.filter(item => item.value === selectValue)[0].label
    const newExchangeRage = currenciesS.filter(currency => currency.value === selectValue)[0].exchangeRate

    const updatedCurrencies = tdcData.currencies.map((item: any) =>
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

    setTDCData({ ...tdcData, currencies: updatedCurrencies });
  }

  function handleCoupons(id:number, value:string){
    
    value = value.replace(/[^\d.]/g, "");
    console.log(value)

    const updatedCurrencies = tdcData.currencies.map((item: any) =>
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

    tdcData.currencies = updatedCurrencies;

    console.log(tdcData)

    setTDCData({...tdcData})
  }

  function handleAmountPAX(id:number, value:string){
    
    value = value.replace(/[^\d.]/g, "");
    console.log(value)

    const updatedCurrencies = tdcData.currencies.map((item: any) =>
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

    tdcData.currencies = updatedCurrencies;

    console.log(tdcData)

    setTDCData({...tdcData})
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
                {tdcData?.currencies?.map((item: any) => (
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
    
          <FooterClousing data={tdcData} loading={cashLoading} onChange={sendClousing} />
    
        </Box>
  )
}

export default CustomersClousing;

const TDCMOCKData = {
  "id": 1,
  "employeId": 150,
  "globalTotalPOS": 9622.32,
  "globalTotalFisico": 9622.32,
  "globalDifference": 0,
  "currencies": [
      {"id":1, "customers": "AIR CANADA", "coupons": 0, "currency": "", "valuePAX": 0, "amount": 0, "exchangeRate": 0, "amountMXN": 0},
      {"id":2, "customers": "BRITISH ", "coupons": 0, "currency": "", "valuePAX": 0, "amount": 0, "exchangeRate": 0, "amountMXN": 0},
      {"id":3, "customers": "SUNWING", "coupons": 0, "currency": "", "valuePAX": 0, "amount": 0, "exchangeRate": 0, "amountMXN": 0},
      {"id":4, "customers": "VIVA AEROBUS", "coupons": 0, "currency": "", "valuePAX": 0, "amount": 0, "exchangeRate": 0, "amountMXN": 0},
  ]
}

const currenciesS = [
  {value:1, label: "MXN", exchangeRate: 1.0},
  {value:2, label: "USD", exchangeRate: 17.0},
  {value:3, label: "CAN", exchangeRate: 13.0},
  {value:4, label: "EUR", exchangeRate: 23.0}
]