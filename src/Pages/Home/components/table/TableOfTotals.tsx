import { useMemo, useState } from "react";
import { Box, Button, FormatNumber, Grid, GridItem, HStack, Table, Tag, Text } from "@chakra-ui/react";
import { exportCSV } from "@services/homeService";
import { useClousing } from "@context/home/clousingContext";
import { Alert } from "@components/ui/alert";
import { ClousingLinesModel, Currency, TableOfTotalsProps, TDC } from "@models/common.clousing.model";
import Loading from "@components/Loading";
import { STATUS } from "@models/status.model";
import { getStatusColor } from "../../../../utils/getStatusColor";
import ClousingLayout from "../layout/ClousingLayout";
import TotalsRow from "./TotalsRow";
import GeneralInfo from "./GeneralInfo";
import useSortableTable from "@hooks/useSortableTable/useSortableTable";

function TableOfTotals({
  subsidiary,
  store,
  endDate,
  startDate,
  isReport
}: TableOfTotalsProps) {
  
  const { data, totals, loading, error, header, getInfo, setDataRow,
    tdcHeader, currHeader } = useClousing();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<ClousingLinesModel | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const { sortedData, handleSort, getSortIcon } = useSortableTable<ClousingLinesModel>(data);

  function handleExportCSV() {

    const dataWithTotals = [...data];

    const newTotals ={
      ...totals,
      id: 90000,
      employe: "TOTALES",
      status: "",
      closingConfirmation: true,
      // discount: 0, //TODO: Cambiar cuando llegue el dato del back de los decuentos
      iva: 0,
      service: 0,
      creationDate: "",
      closingStartDate: "",
      closingEndtDate: "",
      currencies: totals.currencies.map((currency) => ({
        id: currency.id,
        symbol: currency.symbol,
        total: Number(currency.total.toFixed(2))
      })),
    }

    dataWithTotals.push(newTotals)

    exportCSV(dataWithTotals, header, tdcHeader, currHeader);
  }

  const openDialog = (item: any) => {
    if (
      item.status.toLowerCase() === "Abierto".toLowerCase() ||
      item.status.toLowerCase() === "open".toLowerCase() ||
      item.status.toLowerCase() === "Reabierto".toLowerCase()
    ) {
      item.closingConfirmation = false;
    } else {
      item.closingConfirmation = true;
    }
        
    setSelectedEmployee(item);
    setIsDialogOpen(true);
    setIsEdit(true);
    setDataRow(item);
  };

  const closeDialog = (isRefresh: boolean) => {
    setSelectedEmployee(null);
    setIsDialogOpen(false);
    //TODO:Validar que fue un cierre de caja
    if(isRefresh) {
      getInfo(store.id, 0, startDate, endDate, true);
    }
  };

  function statusColor(status: STATUS) {
    return getStatusColor(status);
  }

  return (
    <>
      {error && <Alert status="error">{error}</Alert>}

      {loading && (
        <Box position="fixed" top="50%" left="50%" zIndex={1000}>
          <Loading />
        </Box>
      )}

      <Box>

        <GeneralInfo subsidiary={subsidiary} store={store} isReport={isReport}></GeneralInfo>

        <Box>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
            gap={4}
            mb={4}
            w="100%"
          >
            <GridItem colSpan={1}></GridItem>
            <Button
              colorPalette="meraPrimary"
              onClick={() => {
                handleExportCSV();
              }}
            >
              Exportar a CSV
            </Button>

            <Button
              colorPalette="meraInfo"
              onClick={() => {
                getInfo(
                  store.id,
                  0,
                  startDate,
                  endDate,
                  true
                );
              }}
            >
              Actualizar Información
            </Button>
          </Grid>
        </Box>

        {sortedData.length >= 1 && (
          <Box>
            <Table.ScrollArea rounded="md" borderWidth="1px">
              <Table.Root size="sm" variant="outline">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader textAlign="center">
                      Fecha
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center" onClick={() => handleSort('employe')} _hover={{textDecoration: "underline"}} cursor="pointer">
                      <HStack justify={"center"}>Vendedor {getSortIcon('employe')}</HStack>
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center" onClick={() => handleSort('totalPOS')} _hover={{textDecoration: "underline"}} cursor="pointer">
                      <HStack justify={"center"}>Total POS {getSortIcon('totalPOS')}</HStack>
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center" onClick={() => handleSort('totalPhysical')} _hover={{textDecoration: "underline"}} cursor="pointer">
                      <HStack justify={"center"}>Total Físico {getSortIcon('totalPhysical')}</HStack>
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center" onClick={() => handleSort('difference')} _hover={{textDecoration: "underline"}} cursor="pointer">
                      <HStack justify={"center"}>Diferencia {getSortIcon('difference')}</HStack>
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center" minW="110px" onClick={() => handleSort('status')} _hover={{textDecoration: "underline"}} cursor="pointer">
                      <HStack justify={"center"}>Estatus {getSortIcon('status')}</HStack>
                    </Table.ColumnHeader>

                    {currHeader.length > 0 &&
                      currHeader.map((item: Currency) => (
                        <Table.ColumnHeader
                          key={item.id}
                          textAlign="center"
                        >
                          {item.symbol.toUpperCase()}
                        </Table.ColumnHeader>
                      ))}
                    
                    <Table.ColumnHeader textAlign="center" onClick={() => handleSort('customer')} _hover={{textDecoration: "underline"}} cursor="pointer">
                      <HStack justify={"center"}>Clientes General {getSortIcon('customer')}</HStack>
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center" onClick={() => handleSort('specialCustomer')} _hover={{textDecoration: "underline"}} cursor="pointer">
                      <HStack justify={"center"}>Clientes Especiales {getSortIcon('specialCustomer')}</HStack>
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center" onClick={() => handleSort('prepaid')} _hover={{textDecoration: "underline"}} cursor="pointer">
                      <HStack justify={"center"}>Prepago {getSortIcon('prepaid')}</HStack>
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center" onClick={() => handleSort('employees')} _hover={{textDecoration: "underline"}} cursor="pointer">
                      <HStack justify={"center"}>CXC Empleados {getSortIcon('employees')}</HStack>
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center" onClick={() => handleSort('intercompany')} _hover={{textDecoration: "underline"}} cursor="pointer">
                      <HStack justify={"center"}>Intercompañia {getSortIcon('intercompany')}</HStack>
                    </Table.ColumnHeader>
                    {tdcHeader.length > 0 &&
                      tdcHeader.map((item: TDC) => (
                        <Table.ColumnHeader
                          key={item.nameBank}
                          textAlign="center"
                        >
                          {item.nameBank.toUpperCase()}
                        </Table.ColumnHeader>
                      ))}
                    <Table.ColumnHeader textAlign="center" onClick={() => handleSort('tips')} _hover={{textDecoration: "underline"}} cursor="pointer">
                      <HStack justify={"center"}>Propinas electrónica {getSortIcon('tips')}</HStack>
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {sortedData.map((item: ClousingLinesModel) => (
                    <Table.Row key={item.id}>
                      <Table.Cell textAlign="center">
                        <Text>{item.closingStartDate}</Text>
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Text
                          as="span"
                          cursor="pointer"
                          textDecoration="underline"
                          color="blue.500"
                          onClick={() => openDialog(item)}
                        >
                          {item.employe}
                        </Text>
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

                      <Table.Cell textAlign="end">
                        <Text>
                          <FormatNumber
                            value={item.totalPhysical}
                            style="currency"
                            currency="USD"
                          />
                        </Text>
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

                      <Table.Cell textAlign="center">
                        <Tag.Root
                          colorPalette={statusColor(item.status as STATUS)}
                        >
                          <Tag.Label>{item.status}</Tag.Label>
                        </Tag.Root>
                      </Table.Cell>

                      {currHeader.length > 0 &&
                        item.currencies.length > 0 &&
                        currHeader.map((currItem) => {
                          const currValue = item.currencies.find(
                            (curr) => curr.symbol === currItem.symbol
                          );
                          return (
                            <Table.Cell key={currItem.symbol} textAlign="end">
                              <Text>
                                <FormatNumber
                                  value={currValue ? currValue.total : 0}
                                  style="currency"
                                  currency="USD"
                                />
                              </Text>
                            </Table.Cell>
                          );
                        })}

                      
                      <Table.Cell textAlign="end">
                        <Text>
                          <FormatNumber
                            value={item.customer}
                            style="currency"
                            currency="USD"
                          />
                        </Text>
                      </Table.Cell>

                      <Table.Cell textAlign="end">
                        <Text>
                          <FormatNumber
                            value={item.specialCustomer}
                            style="currency"
                            currency="USD"
                          />
                        </Text>
                      </Table.Cell>

                      <Table.Cell textAlign="end">
                        <Text>
                          <FormatNumber
                            value={item.prepaid}
                            style="currency"
                            currency="USD"
                          />
                        </Text>
                      </Table.Cell>

                      <Table.Cell textAlign="end">
                        <Text>
                          <FormatNumber
                            value={item.employees}
                            style="currency"
                            currency="USD"
                          />
                        </Text>
                      </Table.Cell>

                      <Table.Cell textAlign="end">
                        <Text>
                          <FormatNumber
                            value={item.intercompany}
                            style="currency"
                            currency="USD"
                          />
                        </Text>
                      </Table.Cell>
                      {tdcHeader.length > 0 &&
                        item.tdc.length > 0 &&
                        tdcHeader.map((tdcItem) => {
                          const tdcValue = item.tdc.find(
                            (tdc) => tdc.nameBank === tdcItem.nameBank
                          );
                          return (
                            <Table.Cell key={tdcItem.nameBank} textAlign="end">
                              <Text>
                                <FormatNumber
                                  value={tdcValue ? tdcValue.total : 0}
                                  style="currency"
                                  currency="USD"
                                />
                              </Text>
                            </Table.Cell>
                          );
                        })}

                      <Table.Cell textAlign="end">
                        <Text>
                          <FormatNumber
                            value={item.tips || 0}
                            style="currency"
                            currency="USD"
                          />
                        </Text>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                  <TotalsRow></TotalsRow>
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          </Box>
        )}

        {data.length === 0 && <h2>No hay data</h2>}
      </Box>

      <ClousingLayout
        isOpen={isDialogOpen}
        employee={selectedEmployee}
        onClose={closeDialog}
        location={store}
        subsidiary={subsidiary}
        isEdit={isEdit}
      ></ClousingLayout>
    </>
  );
}

export default TableOfTotals;