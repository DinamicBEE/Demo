import { useEffect, useState } from "react";
import { Box, Table, Text, FormatNumber, Input } from "@chakra-ui/react";
import { TableInput } from "@components/NumericInput";
import { useFooter } from "@context/home/footerClousingContext";
import { useSpecialCustContext } from "@context/clousing/specialCustClousingContext"
import { useHandleSpecialCustomer } from "@hooks/SpecialCustomerClousing/useHandleSpecialCustomerData";
import { SpecialCustomerLines, SpecialCustomerModel } from "@models/specialCustome.model";
import { CLOUSING_KEY } from "@models/constants.model";
import { useHeaders } from "@context/home/headerContext";
import Loading from "@components/Loading";


function SpecialCustomersClousing({ data, subsidiary }: any) {
  const [specialCustomer, setSpecialCustomer] = useState<SpecialCustomerModel>()

  const { setFooterData } = useFooter();
  const { getSpecialCustData, specialCustLoading } = useSpecialCustContext();
  const { handleInputTextData, handleUpdateAmountMXN } = useHandleSpecialCustomer(specialCustomer || {} as SpecialCustomerModel, setSpecialCustomer, data?.id)
  const { updateTotal } = useHeaders();

  useEffect(() => {
    async function fetchData() {
      const specialCustomer: SpecialCustomerModel = await getSpecialCustData(data?.id, subsidiary.idCurrency);
      if (specialCustomer) setFooterData(specialCustomer.total, data.id, CLOUSING_KEY.SPECIALCUSTOMER);
      setSpecialCustomer(specialCustomer);
      updateTotal(specialCustomer.total?.totalPhysical  || 0, data.id, CLOUSING_KEY.SPECIALCUSTOMER);
    }

    fetchData();

  }, [])


  return (
    <Box>
      {/* <Toaster /> */}

      <Table.ScrollArea rounded="md" borderWidth="1px">
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader textAlign="center">Cheque</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Consumo</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Precio cupón</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Diferencia</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Tipo de cambio</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Cliente</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">PAX</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Folio cupones</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Folio cupones USD</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" minW="100px">Valor</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Valor USD</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center" minW="120px">Vuelo</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Nombre pasajero</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Monto MXN</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {specialCustomer?.lines?.map((item: SpecialCustomerLines) => (
              <Table.Row key={item.id}>

                <Table.Cell textAlign="center">
                  <Text>
                    {item.check}
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber value={item.bill} style="currency" currency="USD" />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <FormatNumber value={item.couponPrice} style="currency" currency="USD" />
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
                    <FormatNumber value={item.pax} />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text>
                    <Input textAlign="center" value={item.couponFolio} onChange={(e) => handleInputTextData(e.target.value, item.id, "couponFolio")}
                      disabled={data?.closingConfirmation} />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text>
                    <Input textAlign="center" value={item.couponFolioUSD} onChange={(e) => handleInputTextData(e.target.value, item.id, "couponFolioUSD")}
                      disabled={data?.closingConfirmation} />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <TableInput value={item.ammount} id={item.id} currency={false} keyValue={"ammount"} onChange={handleUpdateAmountMXN}
                      disabled={data?.closingConfirmation} />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <TableInput value={item.ammountUSD} id={item.id} currency={false} keyValue={"ammountUSD"} onChange={handleUpdateAmountMXN}
                      disabled={data?.closingConfirmation} />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text>
                    <Input textAlign="center" value={item.flight} onChange={(e) => handleInputTextData(e.target.value, item.id, "flight")}
                      disabled={data?.closingConfirmation} />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text>
                    <Input textAlign="center" value={item.passengerName} onChange={(e) => handleInputTextData(e.target.value, item.id, "passengerName")}
                      disabled={data?.closingConfirmation} />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber value={item.ammountMXN} style="currency" currency="USD" />
                  </Text>
                </Table.Cell>

              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {specialCustLoading && (
        <Box position="fixed" top="50%" left="50%" zIndex="1">
          <Loading />
        </Box>
      )}

    </Box>
  )
}

export default SpecialCustomersClousing;