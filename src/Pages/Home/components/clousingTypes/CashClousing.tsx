import { useCallback, useEffect, useState } from "react";
import { Box, Grid, Table, Text, FormatNumber, HStack } from "@chakra-ui/react";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";
import { Toaster } from "@components/ui/toaster";
import { CurrencyInput, EditableCurrencyInput, TableInput, } from "@components/NumericInput";
import { useFooter } from "@context/home/footerClousingContext";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { useHandleCashData } from "@hooks/cashClousing/useHandleCashData";
import { CLOUSING_KEY } from "@models/constants.model";
import { useHeaders } from "@context/home/headerContext";
import Loading from "@components/Loading";
import { CashLines, CashModel } from "@models/cash.model";
import { Button } from "@components/ui/button";
import { CiSquarePlus } from "react-icons/ci";
import { CashClousingDetails } from "./CashClousingDetails";

const pageSize = 10;

function CashClousing({ data, idCurrency, isEdit }: any) {
  const [cashData, setCashData] = useState<CashModel>({} as CashModel);
  const { cashLoading, getCashData, setCashClousingSelect } = useCashClousing();
  const { handleChangeTips, handleInputChange } = useHandleCashData(cashData, setCashData, data?.id);
  const { setFooterData } = useFooter();
  const { updateTotal } = useHeaders();
  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<CashLines[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const [selectedCurrencyId, setSelectedCurrencyId] = useState<string | null>(null);

  const startRange = (page - 1) * pageSize
  const endRange = startRange + pageSize

  useEffect(() => {
    async function fetchData() {
      const cashData = await getCashData(data.id, idCurrency);

      if (cashData.total) {
        setFooterData(cashData.total, data.id, CLOUSING_KEY.CASH);
      }
      setCashData(cashData);
      if (cashData.total) {
        updateTotal(cashData.total.totalPhysical, data.id, CLOUSING_KEY.CASH);
      }

      const items = cashData?.currencies?.slice(startRange, endRange);
      setVisibleItems(items);
    }

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPage(page);
    const items = cashData?.currencies?.slice(startRange, endRange);
    setVisibleItems(items);
  }, [page, cashData])

  const openDialog = useCallback((currencyId: string, item: any) => {
    setIsDialogOpen(true);
    setSelectedCurrencyId(currencyId);
    setCashClousingSelect(item);
  }, []);

  const closeDialog = useCallback(() => setIsDialogOpen(false), []);

  const handleSaveFromDialog = (currencyId: string, total: number, updatedDenominations: any[]) => {
    handleInputChange(currencyId, total.toString());

    // Actualiza también las denominaciones si lo necesitas:
    setCashData((prev) => {
      const updatedCurrencies = prev.currencies.map((currency) => currency.id === currencyId ? { ...currency, totalFisico: total, denominations: updatedDenominations } : currency);
      return { ...prev, currencies: updatedCurrencies };
    });
  };

  return (
    <>
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
                <Table.ColumnHeader textAlign="center">
                  Moneda
                </Table.ColumnHeader>
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
              {visibleItems?.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell textAlign="center">
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

                  <Table.Cell width={24}>
                    {data != null && (

                      <>
                        <TableInput
                          value={item.totalFisico}
                          id={item.id}
                          currency={true}
                          onChange={handleInputChange}
                          disabled={true}
                        />

                        <Button marginLeft={4} onClick={() => openDialog(String(item.id), item)}>
                          <CiSquarePlus />
                        </Button>
                      </>

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
        <PaginationRoot count={cashData?.currencies?.length ?? 0} pageSize={pageSize} page={page} onPageChange={(e) => setPage(e.page)}>
          <HStack>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>

        {cashLoading && (
          <Box position="fixed" top="50%" left="50%" zIndex="1">
            <Loading />
          </Box>
        )}
      </Box>

      {isDialogOpen && selectedCurrencyId !== null && (
        <Box position="fixed" top="50%" left="50%" zIndex="1"
          transform="translate(-50%, -50%)" width="100%" height="100%">
          <CashClousingDetails
            isOpen={isDialogOpen}
            onClose={closeDialog}
            onSave={handleSaveFromDialog}
            currencyId={selectedCurrencyId}
          />
        </Box>
      )}

    </>

  );
}

export default CashClousing;
