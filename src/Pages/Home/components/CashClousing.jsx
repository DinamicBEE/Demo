import { useEffect, useState } from "react";
import { Box, Grid, Table, Text, FormatNumber  } from "@chakra-ui/react";
import { Toaster } from "@components/ui/toaster";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { useHandleCashData } from "../../../hook/cashClousing/useHandleCashData";
import { CurrencyInput, EditableCurrencyInput, TableInput } from "@components/NumericInput";
import FooterClousing from "./FooterClousing";

function CashClousing ({ data }) {
    const [cashData, setCashData] = useState(true)
    const { cashLoading, getCashData } = useCashClousing();
    const { handleInputChange, handleChangeTips, sendClousing } =  useHandleCashData(cashData, setCashData);

    useEffect(() => {
      async function fetchData() {
        const cashData = await getCashData(data.id, data.employe);

        setCashData(cashData);
      }
      fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
      <Box>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
          gap={4}
          mb={4}
        >
          <CurrencyInput name={"Propina electrónica"} value={cashData.electronicTips} loading={cashLoading} />

          <EditableCurrencyInput name={"Propina de fondo"} value={cashData.tips} loading={cashLoading} onChange={handleChangeTips} />

        </Grid>

        <Toaster />

        <Table.ScrollArea rounded="md" borderWidth="1px">
          <Table.Root size="sm" variant="outline" striped>
            <Table.Header>
              <Table.Row>
                <Table.Cell textAlign="center">Moneda</Table.Cell>
                <Table.Cell textAlign="center">Total POS</Table.Cell>
                <Table.Cell textAlign="center">Total físico</Table.Cell>
                <Table.Cell textAlign="center">Diferencia</Table.Cell>
                <Table.Cell textAlign="center">Tipo de cambio</Table.Cell>
                <Table.Cell textAlign="center">Moneda original</Table.Cell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {cashData?.currencies?.map((item) => (
                <Table.Row key={item.id}>
                  
                  <Table.Cell textAlign="center">
                    <Text>{item.currency}</Text>
                  </Table.Cell>

                  <Table.Cell textAlign="end">
                    <Text>
                      <FormatNumber value={item.totalPOS} style="currency" currency="USD" />
                    </Text>
                  </Table.Cell>

                  <Table.Cell>
                    <TableInput value={item.totalFisico} id={item.id} onChange={handleInputChange} />
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

                  <Table.Cell textAlign="end">
                    <Text>
                      <FormatNumber value={item.originalCurrency} style="currency" currency="USD" />
                    </Text>
                  </Table.Cell>

                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        <FooterClousing data={cashData} loading={cashLoading} onChange={sendClousing} />

      </Box>
    );
}

export default CashClousing;
