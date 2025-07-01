import { useState } from "react";
import { Box, Button, FormatNumber, Grid, GridItem, Table, Tag, Text } from "@chakra-ui/react";
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

function TableOfTotals({
  subsidiary,
  store,
  endDate,
  startDate,
  isReport
}: TableOfTotalsProps) {
  
  const { data, totals, loading, error, header, getInfo, setDataRow,
    pagination, tdcHeader, currHeader } = useClousing();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<ClousingLinesModel | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  //const [page, setPage] = useState<number>(1);
  

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

  const closeDialog = () => {
    setSelectedEmployee(null);
    setIsDialogOpen(false);
  };

  function statusColor(status: STATUS) {
    return getStatusColor(status);
  }

  return (
    <>
      {error && <Alert status="error">{error}</Alert>}

      {loading && (
        <Box position="fixed" top="50%" left="50%" zIndex="1">
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
                  subsidiary.id,
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

        {data.length >= 1 && (
          <Box>
            <Table.ScrollArea rounded="md" borderWidth="1px">
              <Table.Root size="sm" variant="outline">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader textAlign="center">
                      Fecha
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      Vendedor
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      Total POS
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      Total Físico
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      Diferencia
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center" minW="110px">
                      Estatus
                    </Table.ColumnHeader>
                    {/* <Table.ColumnHeader textAlign="center">
                      Extras
                    </Table.ColumnHeader> */}
                    {currHeader.length > 0 &&
                      currHeader.map((item: Currency) => (
                        <Table.ColumnHeader
                          key={item.id}
                          textAlign="center"
                        >
                          {item.symbol.toUpperCase()}
                        </Table.ColumnHeader>
                      ))}
                    
                    <Table.ColumnHeader textAlign="center">
                      Clientes General
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      Clientes Especiales
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      Prepago
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      CXC Empleados
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      Intercompañia
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
                    <Table.ColumnHeader textAlign="center">
                      Propinas electrónica
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {data.map((item: ClousingLinesModel) => (
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
{/* 
                      <Table.Cell textAlign="end">
                        <Text>
                          <FormatNumber
                            value={item.extra}
                            style="currency"
                            currency="USD"
                          />
                        </Text>
                      </Table.Cell> */}

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
            {/* <PaginationRoot
              count={pagination.totaRegistros}
              pageSize={10}
              page={page}
              onPageChange={(e) => {
                setPage(e.page);
                getInfo(
                  subsidiary.id,
                  store.id,
                  e.page - 1,
                  startDate,
                  endDate,
                  false
                );
              }}
            >
              <HStack>
                <PaginationPrevTrigger />
                <PaginationItems />
                <PaginationNextTrigger />
              </HStack>
            </PaginationRoot> */}
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