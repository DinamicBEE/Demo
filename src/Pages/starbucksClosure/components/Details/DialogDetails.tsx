import { useEffect, useMemo, useState } from "react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
  DialogFooter,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import {
  CashStarbucksModel,
  CXCModel,
  DenominationsPropModel,
  HeaderDetailsInfoModel,
  StarbucksDetailsProps,
  StarbucksTableRow,
  TDCStarbucksModel,
} from "@models/starbucks.model";
import {
  Box,
  FormatNumber,
  Grid,
  GridItem,
  Group,
  Input,
  InputAddon,
  Skeleton,
  Table,
  Text,
} from "@chakra-ui/react";
import { CurrencyInput, TableInput } from "@components/NumericInput";
import { getDetailStarbucks, saveStarbucksClousing } from "@services/starbucksService";
import { CiSquarePlus } from "react-icons/ci";
import DenominationsDetaisl from "./DenominationsDetails";
import ExitDialog from "../../../Home/components/notifications/ExitDialog";
import ConfirmDialog from "../../../Home/components/notifications/ConfirmDialog";
import Loading from "@components/Loading";
import { formatToDDMMYYYY } from "@utils/dateFormatter";
import { HStack } from '@chakra-ui/react';

function DialogDetails({ isOpen, line, onClose, banks }: StarbucksDetailsProps) {
  const [cashRows, setCashRows] = useState<CashStarbucksModel[]>([]);
  const [tdcRows, setTdcRows] = useState<TDCStarbucksModel[]>([]);
  const [cxcRows, setCxcRows] = useState<CXCModel[]>([]);
  const [generalData, setGeneralData] = useState<HeaderDetailsInfoModel>(
    {} as HeaderDetailsInfoModel
  );
  const [selectedDenomination, setSelectedDenominatio] =
    useState<DenominationsPropModel>({} as DenominationsPropModel);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [openDialogExit, setOpenDialogExit] = useState<boolean>(false);
  const [dialogLoading, setDialogLoading] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [isConfirm, setIsConfirm] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      setDialogLoading(true);      
      const newLine = {
        ...line,
        fgUpt: line.total !== 0 ? false : true,
      }
      
      const data = await getDetailStarbucks(newLine, banks);
      
      setGeneralData(data.data);
      setCashRows(data.cash);
      setTdcRows(data.tdc);
      setCxcRows(data.cxc);

      setDialogLoading(false);
    }

    fetchData();
  }, [line]);

  function openDialog(id: number, item: CashStarbucksModel) {
    setSelectedDenominatio({
      currencyId: id,
      denominations: item.denominations,
    });
    setIsDialogOpen(true);
  }

  function onCloseDenominations() {
    setSelectedDenominatio({} as DenominationsPropModel);
    setIsDialogOpen(false);
  }

  function onSaveDenominations(denominations: DenominationsPropModel) {
    
    const updatedCashRows = cashRows.map((row: CashStarbucksModel, index: number) => {
      if (index === denominations.currencyId) {
        const newTotal = denominations.denominations.reduce(
          (acc, denom) => acc + (denom?.subtotal ?? 0),
          0
        );

        return {
          ...row,
          denominations: denominations.denominations,
          total:
            row.currency === "MXN" ? newTotal : newTotal * row.exchangeRate,
          originalCurrency: newTotal,
        };
      }      
      return row;
    });
    const totalCash = updatedCashRows.reduce(
      (acc, row) => (row.currency != "Total (MXN)" ? acc + row.total : acc),
      0
    );
    const newChashRows = updatedCashRows.map((row) =>
      row.currency != "Total (MXN)"
        ? row
        : {
            ...row,

            total: totalCash,
          }
    );
    setCashRows(newChashRows);
    onCloseDenominations();
  }

  const totalCash = useMemo(
    () =>
      cashRows.reduce(
        (acc, row) => (row.currency !== "Total (MXN)" ? acc + row.total : acc),
        0
      ),
    [cashRows]
  );
 

  const totalTDC = useMemo(
    () =>
      tdcRows.reduce(
        (acc, row) =>
          row.nameBank !== "Total (MXN)" ? acc + row.total : acc,//originalCurrency
        0
      ),
    [tdcRows]
  );

  const totalCXC = useMemo(
    () =>
      cxcRows.reduce(
        (acc, row) =>
          row.currency !== "Total (MXN)" ? acc + row.originalCurrency : acc,
        0
      ),
    [cxcRows]
  );

  const totalGlobal = useMemo(
    () => totalCash + totalTDC + totalCXC,
    [totalCash, totalTDC, totalCXC]
  );

  useEffect(() => {
    setGeneralData((prev) => ({ ...prev, total: totalGlobal }));
  }, [totalGlobal]);

  function updateAmmount(id: number | string, value: string, key?: string) {
    
    value = value.replace(/[^\d.]/g, "");

    let newValue = 0;
    let newValueOriginalCurrency = 0;

    if (!value || isNaN(parseFloat(value))) return;

    const keyValue = key?.split("-");

    if (keyValue && keyValue[0] === "BANK" && keyValue.length > 1) {
      // const exchangeRate =
      //   tdcRows.find((item) => item.id === id)?.exchangeRate || 0;
      // newValue =
      //   keyValue[1] === "total"
      //     ? parseFloat(value)
      //     : parseFloat(value) / exchangeRate;
      // newValueOriginalCurrency =
      //   keyValue[1] === "total"
      //     ? parseFloat(value) * exchangeRate
      //     : parseFloat(value);
      const updatedTdcRows = tdcRows.map((item: TDCStarbucksModel) =>
        item.idBank === id
          ? {
              ...item,
              total: parseFloat(value),//newValue,
              originalCurrency: parseFloat(value),//newValueOriginalCurrency,
            }
          : item
      );
      
      const totalTDC = updatedTdcRows.reduce(
        (acc, row) =>
          row.nameBank != "Total (MXN)" ? acc + row.total : acc,//originalCurrency
        0
      );
      const newTdcRows = updatedTdcRows.map((row) =>
        row.nameBank != "Total (MXN)"
          ? row
          : {
              ...row,

              originalCurrency: totalTDC,
            }
      );
      setTdcRows(newTdcRows);
    } else if (keyValue && keyValue[0] === "CXC" && keyValue.length > 1) {
      const exchangeRate =
        cxcRows.find((item) => item.id === id)?.exchangeRate || 0;
      newValue =
        keyValue[1] === "total"
          ? parseFloat(value)
          : parseFloat(value) / exchangeRate;
      newValueOriginalCurrency =
        keyValue[1] === "total"
          ? parseFloat(value) * exchangeRate
          : parseFloat(value);
      const updatedCxcRows = cxcRows.map((item: CXCModel) =>
        item.id === id
          ? {
              ...item,
              total: newValue,
              originalCurrency: newValueOriginalCurrency,
            }
          : item
      );
      const totalCXC = updatedCxcRows.reduce(
        (acc, row) =>
          row.currency != "Total (MXN)" ? acc + row.originalCurrency : acc,
        0
      );
      const newCxcRows = updatedCxcRows.map((row) =>
        row.currency != "Total (MXN)"
          ? row
          : {
              ...row,

              originalCurrency: totalCXC,
            }
      );
      setCxcRows(newCxcRows);
    }
  }

  async function sendClousing(isConfirm: boolean) {
    setDialogLoading(true);

    const cashTotalIndex = cashRows.findIndex(row => row.currency === "Total (MXN)");
    const tdcTotalIndex = tdcRows.findIndex(row => row.nameBank === "Total (MXN)");
    const cxcTotalIndex = cxcRows.findIndex(row => row.currency === "Total (MXN)");
    
    cashRows.splice(cashTotalIndex, 1);
    tdcRows.splice(tdcTotalIndex, 1);
    cxcRows.splice(cxcTotalIndex, 1);
    
    const body:StarbucksTableRow = {
      data: generalData,
      cash: cashRows,
      tdc: tdcRows,
      cxc: cxcRows
    }

    try {

      const response = await saveStarbucksClousing(line.id, body, isConfirm);
      if (response === "saved cash register closure starbucks") {
        onClose(true);
      }
      setDialogLoading(false);
      setButtonLoading(false);
      
    } catch (error) {
      console.error("Error saving Starbucks closing:", error);
      setDialogLoading(false);
      setButtonLoading(false);
    }
  }

  return (
    <Box>
      <DialogRoot
        scrollBehavior="inside"
        size="full"
        open={isOpen}
        onOpenChange={() => setOpenDialogExit(true)}
        closeOnEscape={false}
        closeOnInteractOutside={false}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Corte de caja</DialogTitle>
            <HStack>
              <HStack w={"150%"}>
                <InputAddon>CDC</InputAddon>
                  <Skeleton loading={false} width={"100%"}>
                    <Input
                      value={generalData.cdc || " "}
                      placeholder="CDC"
                      readOnly
                    />
                  </Skeleton>
              </HStack>
              <Group w={"988px"}>
                  <InputAddon>Fecha</InputAddon>
                  <Skeleton loading={false} width={"100%"}>
                    <Input
                      value={formatToDDMMYYYY(new Date(generalData.date)) || " "}
                      placeholder="Fecha"
                      readOnly
                    />
                  </Skeleton>
                </Group>
                <Box w={"100%"}>
                  <CurrencyInput
                  value={generalData.total || 0}
                  name={"Total Físico"}
                  loading={false}
                />
                </Box>
                <Box w={"100%"}>
                  <CurrencyInput
                  value={generalData.totalPOS || 0}
                  name={"Total POS"}
                  loading={false}
                />

                </Box>
                <Box w={"100%"}>
                  <CurrencyInput
                  value={(generalData.total || 0) - (generalData.totalPOS || 0)}
                  name={"Diferencia"}
                  loading={false}
                />

                </Box>
                
                
                
            </HStack>
            {/* <Grid
              templateColumns={{ base: "1fr", md: "repeat(6, 1fr)" }}
              gap={1}
              mb={4}
            >
              <GridItem colSpan={2}>
                <Group width={"100%"}>
                  <InputAddon>CDC</InputAddon>
                  <Skeleton loading={false} width={"100%"}>
                    <Input
                      value={generalData.cdc || " "}
                      placeholder="CDC"
                      readOnly
                    />
                  </Skeleton>
                </Group>
              </GridItem>

              <GridItem colSpan={1}>
                <Group>
                  <InputAddon>Fecha</InputAddon>
                  <Skeleton loading={false} width={"100%"}>
                    <Input
                      value={formatToDDMMYYYY(new Date(generalData.date)) || " "}
                      placeholder="Fecha"
                      readOnly
                    />
                  </Skeleton>
                </Group>
              </GridItem>

              <GridItem colSpan={1}>
                <CurrencyInput
                  value={generalData.total || 0}
                  name={"Total Físico"}
                  loading={false}
                />
              </GridItem>
              <GridItem colSpan={1}>
                <CurrencyInput
                  value={generalData.totalPOS || 0}
                  name={"Total POS"}
                  loading={false}
                />
              </GridItem>
              <GridItem colSpan={1}>
                <CurrencyInput
                  value={(generalData.total || 0) - (generalData.totalPOS || 0)}
                  name={"Diferencia"}
                  loading={false}
                />
              </GridItem>
            </Grid> */}
          </DialogHeader>

          <DialogBody>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(6, 1fr)" }}
              gap={4}
              mb={4}
            >
              <GridItem colSpan={3}>
                <Table.ScrollArea rounded="md" borderWidth="1px">
                  <Table.Root size="sm" variant="outline">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader textAlign="center">
                          Moneda
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">
                          Total
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
                      {cashRows.length > 0 &&
                        cashRows.map((row: CashStarbucksModel, index:number) => (
                          <Table.Row key={index}>
                            <Table.Cell textAlign="center">
                              <Text>{row.currency}</Text>
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                              {row.currency != "Total (MXN)" ? (
                                <Box
                                  display={"flex"}
                                  direction={"row"}
                                  justifyContent={"space-evenly"}
                                  alignItems={"center"}
                                >
                                  <Text>
                                    <FormatNumber
                                      value={row.total}
                                      style="currency"
                                      currency="USD"
                                    />
                                  </Text>

                                  <Button
                                    // disabled={!row.isOpen}
                                    onClick={() => openDialog(index, row)}
                                  >
                                    <CiSquarePlus />
                                  </Button>
                                </Box>
                              ) : (
                                <Text>
                                  <FormatNumber
                                    value={row.total}
                                    style="currency"
                                    currency="USD"
                                  />
                                </Text>
                              )}
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                              <Text>
                                {row.currency != "Total (MXN)" ? (
                                  <FormatNumber
                                    value={row.exchangeRate}
                                    style="currency"
                                    currency="USD"
                                  />
                                ) : (
                                  ""
                                )}
                              </Text>
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                              <Text>
                                {row.currency != "Total (MXN)" ? (
                                  <FormatNumber
                                    value={row.originalCurrency}
                                    style="currency"
                                    currency="USD"
                                  />
                                ) : (
                                  ""
                                )}
                              </Text>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                    </Table.Body>
                  </Table.Root>
                </Table.ScrollArea>
              </GridItem>

              <GridItem colSpan={3}>
                <Table.ScrollArea rounded="md" borderWidth="1px">
                  <Table.Root size="sm" variant="outline">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader textAlign="center">
                          Banco
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">
                          Importe
                        </Table.ColumnHeader>
                        {/* <Table.ColumnHeader textAlign="center">
                          Tasa de cambio
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">
                          Monto MXN
                        </Table.ColumnHeader> */}
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {tdcRows.length > 0 &&
                        tdcRows.map((row: TDCStarbucksModel, index:number) => (
                          <Table.Row key={index}>
                            <Table.Cell textAlign="center">
                              <Text>{row.nameBank}</Text>
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                              <Text>
                                {row.nameBank != "Total (MXN)" ? (
                                  <TableInput
                                    disabled={!row.isOpen}
                                    value={row.total}
                                    id={row.idBank}
                                    currency={true}
                                    keyValue={"BANK-total"}
                                    onChange={updateAmmount}
                                  />
                                ) : (
                                  <FormatNumber
                                    value={row.originalCurrency}
                                    style="currency"
                                    currency="USD"
                                  />
                                )}
                              </Text>
                            </Table.Cell>
                            {/* <Table.Cell textAlign="center">
                              <Text>
                                {row.nameBank != "Total (MXN)" ? (
                                  <FormatNumber
                                    value={row.exchangeRate}
                                    style="currency"
                                    currency="USD"
                                  />
                                ) : (
                                  ""
                                )}
                              </Text>
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                              <Text textAlign={row.nameBank != "Total (MXN)" ? "center": "right"}>
                                {row.nameBank != "Total (MXN)" ? (
                                  <TableInput
                                    disabled={!row.isOpen}
                                    value={row.originalCurrency}
                                    id={row.id}
                                    currency={true}
                                    keyValue={"BANK-original"}
                                    onChange={updateAmmount}
                                  />
                                ) : (
                                  <FormatNumber
                                    value={row.originalCurrency}
                                    style="currency"
                                    currency="USD"
                                  />
                                )}
                              </Text>
                            </Table.Cell> */}
                          </Table.Row>
                        ))}
                    </Table.Body>
                  </Table.Root>
                </Table.ScrollArea>
              </GridItem>

              <GridItem colSpan={3} />

              <GridItem colSpan={3}>
                <Table.ScrollArea rounded="md" borderWidth="1px">
                  <Table.Root size="sm" variant="outline">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader textAlign="center">
                          Moneda
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">
                          Importe
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">
                          Tasa de cambio
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">
                          Monto MXN
                        </Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>

                    <Table.Body>
                      {cxcRows.length > 0 &&
                        cxcRows.map((row: CXCModel, index:number) => (
                          <Table.Row key={index}>
                            <Table.Cell textAlign="center">
                              <Text>
                                {row.currency != "Total (MXN)"
                                  ? "CXC - " + row.currency
                                  : row.currency}
                              </Text>
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                              <Text>
                                {row.currency != "Total (MXN)" ? (
                                  <TableInput
                                    disabled={!row.isOpen}
                                    value={row.total}
                                    id={row.id || 0}
                                    currency={true}
                                    keyValue={"CXC-total"}
                                    onChange={updateAmmount}
                                  />
                                ) : (
                                  ""
                                )}
                              </Text>
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                              <Text>
                                {row.currency != "Total (MXN)" ? (
                                  <FormatNumber
                                    value={row.exchangeRate}
                                    style="currency"
                                    currency="USD"
                                  />
                                ) : (
                                  ""
                                )}
                              </Text>
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                              <Text textAlign={row.currency != "Total (MXN)" ? "center": "right"}>
                                {row.currency != "Total (MXN)" ? (
                                  <TableInput
                                    disabled={!row.isOpen}
                                    value={row.originalCurrency}
                                    id={row.id || 0}
                                    currency={true}
                                    keyValue={"CXC-original"}
                                    onChange={updateAmmount}
                                  />
                                ) : (
                                  <FormatNumber
                                    value={row.originalCurrency}
                                    style="currency"
                                    currency="USD"
                                  />
                                )}
                              </Text>
                            </Table.Cell>
                          </Table.Row>
                        ))}
                    </Table.Body>
                  </Table.Root>
                </Table.ScrollArea>
              </GridItem>
            </Grid>
          </DialogBody>

          <DialogFooter>
            <Button
              colorPalette="meraWarning"
              disabled={cashRows.length > 0 ? !cashRows[0].isOpen : false}
              onClick={() => {
                setButtonLoading(true);
                setIsConfirm(true);
              }}
            >
              Guardar Corte
            </Button>

            <Button
              colorPalette="meraPrimary"
              disabled={!cashRows[0]?.isOpen}
              onClick={() => {
                setButtonLoading(true);
                setIsConfirm(false);
              }}
            >
              Confirmar Corte
            </Button>
          </DialogFooter>

          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>

      {isDialogOpen && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          zIndex="1500"
          transform="translate(-50%, -50%)"
          width="100%"
          height="100%"
        >
          <DenominationsDetaisl
            isOpen={isDialogOpen}
            onClose={onCloseDenominations}
            onSave={onSaveDenominations}
            denominations={selectedDenomination}
            disabled={line.status === "Cerrado"}
          ></DenominationsDetaisl>
        </Box>
      )}
      <ExitDialog
        closeDialog={() => {
          setOpenDialogExit(false);
        }}
        closeOnExit={() => {
          setOpenDialogExit(false);
          onClose(false);
        }}
        isOpen={openDialogExit}
      ></ExitDialog>

      <ConfirmDialog
        isOpen={buttonLoading}
        closeDialog={() => setButtonLoading(false)}
        sendData={sendClousing}
        isConfirm={isConfirm}
      />

      {dialogLoading && (
          <Box position="fixed" top="50%" left="50%" zIndex={1600}>
              <Loading />
          </Box>
        )
      }
    </Box>
  );
}

export default DialogDetails;
