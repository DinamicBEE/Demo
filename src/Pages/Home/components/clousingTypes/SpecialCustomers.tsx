import { useEffect, useState } from "react";
import { Box, Table, Text, FormatNumber, Input } from "@chakra-ui/react";
import FooterClousing from "../FooterClousing";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { useHandleCashData } from "@hooks/cashClousing/useHandleCashData";
import { TableInput } from "@components/NumericInput";

function SpecialCustomersClousing() {
  const [specialCustomer, setSpecialCustomer] = useState<any>({}) 
  const { cashLoading } = useCashClousing(); //Cambiar por funcion propia
  const { sendClousing } =  useHandleCashData(specialCustomer, setSpecialCustomer); //Cambiar por funcion propia
    
  useEffect(()=>{
    async function fetchData() {
      const specialCustomer = customer;

      setSpecialCustomer(specialCustomer)
    }

    fetchData();

  },[])

  function handleInputTextData(value:string, id: number, key:string){

    const updatedCurrencies = specialCustomer.currencies.map((item: any) =>
      item.id === id
        ? {
            ...item,
            [key]: value
          }
        : item
    );

    setSpecialCustomer({ ...specialCustomer, currencies: updatedCurrencies });

    console.log(specialCustomer)
  }

  function handleUpdateAmountMXN(id: number, value: string, key?: string){

    value = value.replace(/[^\d.]/g, "");
    console.log(value)
    let newAmoutn = 0

    if(key === "value"){
      newAmoutn = parseFloat(value)
    } else {
      newAmoutn = (parseFloat(value)*specialCustomer.currencies.filter((item:any) =>item.id === id)[0].exchangeRate)
    }

    const updatedCurrencies = specialCustomer.currencies.map((item: any) =>
      item.id === id
        ? {
            ...item,
            amountMXN: newAmoutn
          }
        : item
    );

    specialCustomer.currencies = updatedCurrencies;

    setSpecialCustomer({...specialCustomer})
    
    console.log(specialCustomer)

  }

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
                {specialCustomer?.currencies?.map((item: any) => (
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
                        <Input textAlign="center" value={item.folioCuopon} onChange={(e) => handleInputTextData(e.target.value, item.id, "folioCuopon")} />
                      </Text>
                    </Table.Cell>

                    <Table.Cell textAlign="center">
                      <Text>
                        <Input textAlign="center" value={item.folioCuoponUSD} onChange={(e) => handleInputTextData(e.target.value, item.id, "folioCuoponUSD")} />
                      </Text>
                    </Table.Cell> 

                    <Table.Cell textAlign="end">
                      <Text>
                        <TableInput value={item.value} id={item.id} currency={false} key={"value"} onChange={handleUpdateAmountMXN} />
                      </Text>
                    </Table.Cell> 

                    <Table.Cell textAlign="end">
                      <Text>
                        <TableInput value={item.valueUSD} id={item.id} currency={false} key={"valueUSD"} onChange={handleUpdateAmountMXN} />
                      </Text>
                    </Table.Cell> 

                    <Table.Cell textAlign="center">
                      <Text>
                        <Input textAlign="center" value={item.flight} onChange={(e) => handleInputTextData(e.target.value, item.id, "flight")} />
                      </Text>
                    </Table.Cell> 

                    <Table.Cell textAlign="center">
                      <Text>
                        <Input textAlign="center" value={item.passengerName} onChange={(e) => handleInputTextData(e.target.value, item.id, "passengerName")} />
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