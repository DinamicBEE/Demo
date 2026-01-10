import { useEffect, useState } from "react";
import { Box, Button, FormatNumber, Grid, GridItem, Table, Tag, Text } from "@chakra-ui/react";
import { exportCSV } from "@services/homeService";
import { useClousing } from "@context/home/clousingContext";
import { Alert } from "@components/ui/alert";
import { ClousingLinesModel, Currency, TableOfTotalsProps, TDC } from "@models/common.clousing.model";
import Loading from "@components/Loading";
import { STATUS, STATUS_CLOSED_DIALOG_EXCEPTIONS } from "@models/const/status.const";
import { getStatusColor } from "@utils/getStatusColor";
import ClousingLayout from "../layout/ClousingLayout";
import TotalsRow from "./TotalsRow";
import GeneralInfo from "./GeneralInfo";
import useSortableTable from "@hooks/useSortableTable/useSortableTable";
import { SortableHeader } from "@utils/table";
import { updateSalesTicket } from "@services/clousingService";
import { toast } from "@utils/Toast";

function TableOfTotals({
  subsidiary,
  store,
  endDate,
  startDate,
  isReport,
  isStarbucks
}: TableOfTotalsProps) {
  
  const { data, totals, setLoading, loading, error, header, getInfo, setDataRow,
    tdcHeader, currHeader } = useClousing();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<ClousingLinesModel>({} as ClousingLinesModel);
  const [isEdit, setIsEdit] = useState(false);
  const { sortedData, handleSort, getSortIcon } = useSortableTable<ClousingLinesModel>(data);
  //const [updateLoading, setUpdateLoading] = useState(false);

  //TODO: eliminar SOLO USO DE DEBUG
  // useEffect(()=>{
  //   const ids = data.map(d=>d.id)
  //   console.log(ids)
  // },[data])

  

  function handleExportCSV() {

    const dataWithTotals = [...data];

    const newTotals ={
      ...totals,
      id: 90000,
      employe: "TOTALES",
      status: "",
      closingConfirmation: true,
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
    item.closingConfirmation = STATUS_CLOSED_DIALOG_EXCEPTIONS.includes(item.status.toLowerCase()) ? false : true;
        
    setSelectedEmployee(item);
    setIsDialogOpen(true);
    setIsEdit(true);
    setDataRow(item);
  };

  const closeDialog = (isRefresh: boolean) => {
    setSelectedEmployee({} as ClousingLinesModel);
    setIsDialogOpen(false);
    if(isRefresh) {
      getInfo(store.id, 0, startDate, endDate, true);
    }
  };

  function statusColor(status: STATUS) {
    return getStatusColor(status);
  }

  const updateticket = async () => {
    setLoading(true);

    try {
      
      const response = await updateSalesTicket(startDate, endDate, sortedData[0].revenueId ||0);
  
      if(response){
      
        await getInfo( store.id, 0, startDate, endDate, true );
      
      } else {
        toast("Se ha realizado una carga previamente espere 5 minutos e intente de nuevo", "error");
      }
      
      setLoading(false);
    } catch (error) {
      toast("Error al actualizar el ticket", "error");
      setLoading(false);
    } 
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
              onClick={() => updateticket()}
            >
              Actualizar ventas
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
                    <SortableHeader columnKey="employe" label="Vendedor" handleSort={handleSort} getSortIcon={getSortIcon} />
                    <SortableHeader columnKey="totalPOS" label="Total POS" handleSort={handleSort} getSortIcon={getSortIcon} />
                    <SortableHeader columnKey="totalPhysical" label="Total Físico" handleSort={handleSort} getSortIcon={getSortIcon} />
                    <SortableHeader columnKey="difference" label="Diferencia" handleSort={handleSort} getSortIcon={getSortIcon} />
                    <SortableHeader columnKey="status" label="Estatus" handleSort={handleSort} getSortIcon={getSortIcon} columnProps={{width: "200px", minWidth: "150px", maxWidth: "250px"}} />

                    {currHeader.length > 0 &&
                      currHeader.map((item: Currency) => (
                        <Table.ColumnHeader
                          key={item.id}
                          textAlign="center"
                        >
                          {item.symbol.toUpperCase()}
                        </Table.ColumnHeader>
                      ))}
                    
                    <SortableHeader columnKey="customer" label="Clientes General" handleSort={handleSort} getSortIcon={getSortIcon} />
                    <SortableHeader columnKey="specialCustomer" label="Clientes Especiales" handleSort={handleSort} getSortIcon={getSortIcon} />
                    <SortableHeader columnKey="prepaid" label="Prepago" handleSort={handleSort} getSortIcon={getSortIcon} />
                    <SortableHeader columnKey="employees" label="CXC Empleados" handleSort={handleSort} getSortIcon={getSortIcon} />
                    <SortableHeader columnKey="intercompany" label="Intercompañia" handleSort={handleSort} getSortIcon={getSortIcon} />

                    {tdcHeader.length > 0 &&
                      tdcHeader.map((item: TDC) => (
                        <Table.ColumnHeader
                          key={item.nameBank}
                          textAlign="center"
                        >
                          {item.nameBank.toUpperCase()}
                        </Table.ColumnHeader>
                      ))}

                    <SortableHeader columnKey="tips" label="Propinas electrónicas" handleSort={handleSort} getSortIcon={getSortIcon} />
                    <SortableHeader columnKey="specialCustomer" label="Diferencia de cupones" handleSort={handleSort} getSortIcon={getSortIcon} />
                    <SortableHeader columnKey="modificationUser" label="Empleado (Realizado por)" handleSort={handleSort} getSortIcon={getSortIcon} />
                    
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
                          <Tag.Label>{item.status === "Cerrado Starbucks" ? "Abierto" : item.status}</Tag.Label>
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
                      <Table.Cell textAlign="end">
                        <Text>
                          <FormatNumber
                            value={item.diferenciaCupones || 0}
                            style="currency"
                            currency="USD"
                          />
                        </Text>
                      </Table.Cell>
                      <Table.Cell textAlign="end">
                        <Text textAlign="center">
                          {item.modificationUser}
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
        isStarbucks={isStarbucks}
      ></ClousingLayout>
    </>
  );
}

export default TableOfTotals;