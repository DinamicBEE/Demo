import { useCallback, useEffect, useState } from "react";
import { Box, Grid, Table, Text, FormatNumber, HStack } from "@chakra-ui/react";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";
import { Toaster } from "@components/ui/toaster";
import { CurrencyInput, EditableCurrencyInput, TableInput, } from "@components/NumericInput";
import { useFooter } from "@context/home/footerClousingContext";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { useHandleCashData } from "@hooks/cashClousing/useHandleCashData";
import { CLOUSING_KEY } from "@models/common.const";
import Loading from "@components/Loading";
import { CashLines, CashModel } from "@models/cash.model";
import { Button } from "@components/ui/button";
import { CiSquarePlus } from "react-icons/ci";
import { CashClousingDetails } from "./CashClousingDetails";

const pageSize = 10;

function CashClousing({ data, idCurrency }: any) {
  const [cashData, setCashData] = useState<CashModel>({} as CashModel);
  const { cashLoading, getCashData, setCashClousingSelect, cashClousing } = useCashClousing();
  const { handleChangeTips, handleInputChange } = useHandleCashData(cashData, setCashData, data?.id);
  const { setFooterData } = useFooter();
  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<CashLines[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [tips, setTips] = useState<string>("");

  const [selectedCurrencyId, setSelectedCurrencyId] = useState<string | null>(null);

  const startRange = (page - 1) * pageSize
  const endRange = startRange + pageSize

  useEffect(() => {
    
    async function fetchData() {
      const cashData = await getCashData(data.id, idCurrency, false);
      setTips(cashData.tips?.toString() || "0")
      
      if (cashData.total != undefined) {
        setFooterData(cashData.total, data.id, CLOUSING_KEY.CASH);
      }

      setCashData(cashData);
      
      const items = cashData?.currencies?.slice(startRange, endRange);

      setVisibleItems(items);
    }
    
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cashClousing]);

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

  const handleSaveFromDialog = (currencyId: string, total: number, totalMXN: number, updatedDenominations: any) => {

    handleInputChange(currencyId, totalMXN.toString(), updatedDenominations);

    // Actualiza también las denominaciones si lo necesitas:
    setCashData((prev: any) => {
      const updatedCurrencies = prev.currencies.map((currency: any) => currency.id == currencyId ?
        { ...currency, totalFisico: totalMXN, denominations: updatedDenominations } : currency);

      return { ...prev, currencies: updatedCurrencies };
    });

  };

  useEffect(() => {
    handleChangeTips(tips);
  }, [tips])

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
            value={Number(tips)}
            loading={cashLoading}
            onChange={setTips}
            disabled={data?.status === "Cerrado" || !cashData.isRoleEditable ? true : false}
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
                  Moneda Original
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
                          disabled={true}
                        />

                        <Button marginLeft={4} 
                          onClick={() => openDialog(String(item.id), item)}
                          disabled={(Number(item.totalFisico) < 0) ? true : false
                        }>
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
                        value={item.exchangeRate !== 0 ? (item.totalFisico || 0)/ (item.exchangeRate || 0) : 0}
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
          <Box position="fixed" top="50%" left="50%"  zIndex={1000}>
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
            data={data}
            isRoleEditable={cashData.isRoleEditable}
          />
        </Box>
      )}

    </>

  );
}

export default CashClousing;
