import { useEffect, useState } from "react";
import { Box, Table, Text, FormatNumber, Input } from "@chakra-ui/react";
import { TableInput } from "@components/NumericInput";
import { useFooter } from "@context/home/footerClousingContext";
import { useSpecialCustContext } from "@context/clousing/specialCustClousingContext"
import { useHandleSpecialCustomer } from "@hooks/SpecialCustomerClousing/useHandleSpecialCustomerData";
import { SpecialCustomerLines, SpecialCustomerModel } from "@models/specialCustome.model";
import { CLOUSING_KEY } from "@models/constants.model";
import Loading from "@components/Loading";

function SpecialCustomersClousing({data}: any) {
  const [specialCustomer, setSpecialCustomer] = useState<SpecialCustomerModel>() 

  const { setFooterData } = useFooter();
  const { getSpecialCustData, specialCustLoading } = useSpecialCustContext();
  const { handleInputTextData, handleUpdateAmountMXN } = useHandleSpecialCustomer(specialCustomer || {} as SpecialCustomerModel, setSpecialCustomer, data?.id)

  useEffect(()=>{
    async function fetchData() {
      const specialCustomer: SpecialCustomerModel = await getSpecialCustData(data?.id);

      if (specialCustomer) {
        setFooterData(specialCustomer.total, data.id, CLOUSING_KEY.SPECIALCUSTOMER);
      }

      setSpecialCustomer(specialCustomer);

    }

    fetchData();

  },[])


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
                {specialCustomer?.lines?.map((item: SpecialCustomerLines) => (
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
                        <TableInput value={item.value} id={item.id} currency={false} keyValue={"value"} onChange={handleUpdateAmountMXN} />
                      </Text>
                    </Table.Cell> 

                    <Table.Cell textAlign="end">
                      <Text>
                        <TableInput value={item.valueUSD} id={item.id} currency={false} keyValue={"valueUSD"} onChange={handleUpdateAmountMXN} />
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

          {specialCustLoading && (
            <Box position="fixed" top="50%" left="50%"  zIndex="1">
              <Loading />
            </Box>
          )}
    
        </Box>
  )
}

export default SpecialCustomersClousing;