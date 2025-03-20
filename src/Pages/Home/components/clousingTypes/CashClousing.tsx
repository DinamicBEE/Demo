import { useEffect, useState } from "react";
import { Box, Grid, Table, Text, FormatNumber } from "@chakra-ui/react";
import { Toaster } from "@components/ui/toaster";
import {
  CurrencyInput,
  EditableCurrencyInput,
  TableInput,
} from "@components/NumericInput";
import { useFooter } from "@context/home/footerClousingContext";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { useHandleCashData } from "@hooks/cashClousing/useHandleCashData";
import { CLOUSING_KEY } from "@models/constants.model";
import { useHeaders } from "@context/home/headerContext";
import Loading from "@components/loading";
import { CashModel } from "@models/cash.model";

function CashClousing({ data }: any) {
  const [cashData, setCashData] = useState<CashModel>({} as CashModel);
  const { cashLoading, getCashData } = useCashClousing();
  const { handleInputChange, handleChangeTips } = useHandleCashData(
    cashData,
    setCashData,
    data?.id
  );
  const { setFooterData } = useFooter();
  const { updateTotal } = useHeaders();

  useEffect(() => {
    async function fetchData() {
      const cashData = await getCashData(data.id);

      if (cashData.total) {
        setFooterData(cashData.total, data.id, CLOUSING_KEY.CASH);
      }
      setCashData(cashData);
      if (cashData.total) {
        updateTotal(cashData.total.totalPhysical, data.id, CLOUSING_KEY.CASH);
      }
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box>
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
        gap={4}
        mb={4}
      >
        <CurrencyInput
          name={"Propina electrónica"}
          value={cashData.electronicTips}
          loading={cashLoading}
        />

        <EditableCurrencyInput
          name={"Propina de fondo"}
          value={cashData.tips}
          loading={cashLoading}
          onChange={handleChangeTips}
        />
      </Grid>

      <Toaster />

      <Table.ScrollArea rounded="md" borderWidth="1px">
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader textAlign="center">Moneda</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Total POS
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Total físico
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Diferencia
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Tipo de cambio
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Moneda original
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {cashData?.currencies?.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell textAlign="center">
                  <Text>{item.id}</Text>
                  <Text>{item.currency}</Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber
                      value={item.totalPOS}
                      style="currency"
                      currency="USD"
                    />
                  </Text>
                </Table.Cell>

                <Table.Cell>
                  {data != null && (
                    <TableInput
                      value={item.totalFisico}
                      id={item.id}
                      currency={true}
                      onChange={handleInputChange}
                      disabled={data.closingConfirmation}
                    />
                  )}
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber
                      value={item.difference}
                      style="currency"
                      currency="USD"
                    />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber
                      value={item.exchangeRate}
                      style="currency"
                      currency="USD"
                    />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber
                      value={item.originalCurrency}
                      style="currency"
                      currency="USD"
                    />
                  </Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {cashLoading && (
        <Box position="fixed" top="50%" left="50%" zIndex="1">
          <Loading />
        </Box>
      )}
    </Box>
  );
}

export default CashClousing;
