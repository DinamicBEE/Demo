import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormatNumber,
  Grid,
  GridItem,
  Group,
  Input,
  InputAddon,
  Skeleton,
  Table,
  Tag,
  Text,
  HStack,
} from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@components/ui/pagination";
import { exportCSV } from "@services/homeService";
import { useClousing } from "@context/home/clousingContext";
import { Alert } from "@components/ui/alert";
import { CurrencyInput } from "@components/NumericInput";
import {
  ClousingLinesModel,
  TableOfTotalsProps,
  TDC,
} from "@models/common.clousing.model";
import Loading from "@components/Loading";
import "../Home.css";
import { STATUS } from "@models/status.model";
import { getStatusColor } from "../../../utils/getStatusColor";
import ClousingLayout from "./ClousingLayout";

const pageSize = 5;

function TableOfTotals({
  subsidiary,
  store,
  endDate,
  startDate,
  page,
  setPage,
}: TableOfTotalsProps) {
  const {
    data,
    loading,
    error,
    header,
    getInfo,
    setDataRow,
    pagination,
    tdcHeader,
  } = useClousing();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<ClousingLinesModel | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const [totals, setTotals] = useState({
    totalPOS: 0,
    totalPhysical: 0,
    difference: 0,
    extra: 0,
    mxm: 0,
    usd: 0,
    eur: 0,
    lib: 0,
    can: 0,
    customer: 0,
    specialCustomer: 0,
    prepaid: 0,
    employees: 0,
    intercompany: 0,
    tips: 0,
    tdc: [] as TDC[],
  });

  const startRange = (page - 1) * pageSize;

  useEffect(() => {
    if (data.length > 0) {      
      const newTotals: any = data.reduce(
        (acc, curr) => {
          acc.totalPOS += curr.totalPOS || 0;
          acc.totalPhysical += curr.totalPhysical || 0;
          acc.difference += curr.difference || 0;
          acc.extra += curr.extra || 0;
          acc.mxm += curr.mxm || 0;
          acc.usd += curr.usd || 0;
          acc.eur += curr.eur || 0;
          acc.lib += curr.lib || 0;
          acc.can += curr.can || 0;
          acc.customer += curr.customer || 0;
          acc.specialCustomer += curr.specialCustomer || 0;
          acc.prepaid += curr.prepaid || 0;
          acc.employees += curr.employees || 0;
          acc.intercompany += curr.intercompany || 0;
          acc.tips += curr.tips || 0;
          curr.tdc.forEach((tdcItem: TDC) => {
            const existingTdc = acc.tdc.find(
              (item) => item.nameBank === tdcItem.nameBank
            );
            if (existingTdc) {
              existingTdc.total += tdcItem.total || 0;
            } else {
              acc.tdc.push({
                nameBank: tdcItem.nameBank,
                total: tdcItem.total || 0,
              });
            }
          });
          // acc.adyenTotal += curr.adyenTotal || 0;
          return acc;
        },
        {
          totalPOS: 0,
          totalPhysical: 0,
          difference: 0,
          extra: 0,
          mxm: 0,
          usd: 0,
          eur: 0,
          lib: 0,
          can: 0,
          customer: 0,
          specialCustomer: 0,
          prepaid: 0,
          employees: 0,
          intercompany: 0,
          tips: 0,
          tdc: [] as TDC[],
        }
      );
      setTotals(newTotals);
    }
  }, [data]);

  function handleExportCSV() {
    // Create a copy of the data array
    const dataWithTotals = [...data];

    // Add totals row as the last item
    dataWithTotals.push({
      id: 90000,
      employe: "TOTALES",
      totalPOS: Number(totals.totalPOS.toFixed(2)),
      totalPhysical: Number(totals.totalPhysical.toFixed(2)),
      difference: Number(totals.difference.toFixed(2)),
      extra: Number(totals.extra.toFixed(2)),
      mxm: Number(totals.mxm.toFixed(2)),
      usd: Number(totals.usd.toFixed(2)),
      eur: Number(totals.eur.toFixed(2)),
      lib: Number(totals.lib.toFixed(2)),
      can: Number(totals.can.toFixed(2)),
      customer: Number(totals.customer.toFixed(2)),
      specialCustomer: Number(totals.specialCustomer.toFixed(2)),
      prepaid: Number(totals.prepaid.toFixed(2)),
      employees: Number(totals.employees.toFixed(2)),
      intercompany: Number(totals.intercompany.toFixed(2)),
      status: "",
      closingConfirmation: true,
      discount: 0,
      iva: 0,
      service: 0,
      tips: Number(totals.tips.toFixed(2)),
      tdc: totals.tdc.map((tdcItem) => ({
        nameBank: tdcItem.nameBank,
        total: Number(tdcItem.total.toFixed(2)),
      })),
      creationDate: "",
      closingStartDate: "",
      closingEndtDate: "",
    });

    exportCSV(dataWithTotals, header, tdcHeader);
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
        <Box mb={6}>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
            gap={4}
            mb={4}
          >
            <Group>
              <InputAddon>Subsidiaria</InputAddon>
              <Skeleton loading={loading}>
                <Input
                  placeholder="No seleccionada"
                  value={subsidiary.name}
                  readOnly
                />
              </Skeleton>
            </Group>
            <Group>
              <InputAddon>Restaurante</InputAddon>
              <Skeleton loading={loading}>
                <Input
                  placeholder="No seleccionada"
                  value={store.name}
                  readOnly
                  id={store.id.toString()}
                />
              </Skeleton>
            </Group>
            <Group>
              <InputAddon>Fecha</InputAddon>
              <Skeleton loading={loading}>
                <Input
                  disabled
                  placeholder="No seleccionada"
                  defaultValue={header.date}
                />
              </Skeleton>
            </Group>
            <Group>
              <InputAddon>Hora</InputAddon>
              <Skeleton loading={loading}>
                <Input
                  disabled
                  placeholder="No seleccionada"
                  defaultValue={header.time}
                />
              </Skeleton>
            </Group>
            <CurrencyInput
              name={"Total Ventas"}
              value={header.totalPOS}
              loading={loading}
            />
            <CurrencyInput
              name={"Total Ventas Registradas"}
              value={header.totalPhysical}
              loading={loading}
            />
            <CurrencyInput
              name={"Diferencia"}
              value={header.difference}
              loading={loading}
            />

            <Text></Text>
          </Grid>
        </Box>

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
                  page - 1,
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
                    <Table.ColumnHeader textAlign="center">
                      Extras
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      MXN
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      USD
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      EUR
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      LIB
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      CAN
                    </Table.ColumnHeader>
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

                      <Table.Cell textAlign="end">
                        <Text>
                          <FormatNumber
                            value={item.extra}
                            style="currency"
                            currency="USD"
                          />
                        </Text>
                      </Table.Cell>

                      <Table.Cell textAlign="end">
                        <Text>
                          <FormatNumber
                            value={item.mxm}
                            style="currency"
                            currency="USD"
                          />
                        </Text>
                      </Table.Cell>

                      <Table.Cell textAlign="end">
                        <Text>
                          <FormatNumber
                            value={item.usd}
                            style="currency"
                            currency="USD"
                          />
                        </Text>
                      </Table.Cell>

                      <Table.Cell textAlign="end">
                        <Text>
                          <FormatNumber
                            value={item.eur}
                            style="currency"
                            currency="USD"
                          />
                        </Text>
                      </Table.Cell>

                      <Table.Cell textAlign="end">
                        <Text>
                          <FormatNumber
                            value={item.lib}
                            style="currency"
                            currency="USD"
                          />
                        </Text>
                      </Table.Cell>

                      <Table.Cell textAlign="end">
                        <Text>
                          <FormatNumber
                            value={item.can}
                            style="currency"
                            currency="USD"
                          />
                        </Text>
                      </Table.Cell>

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
                  <Table.Row bg="gray.100" fontWeight="bold">
                    <Table.Cell textAlign="center"></Table.Cell>
                    <Table.Cell textAlign="center">Totales</Table.Cell>
                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={totals.totalPOS}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={totals.totalPhysical}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={totals.difference}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>
                    <Table.Cell />
                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={totals.extra}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={totals.mxm}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={totals.usd}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={totals.eur}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={totals.lib}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={totals.can}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={totals.customer}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={totals.specialCustomer}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={totals.prepaid}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={totals.employees}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={totals.intercompany}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>
                    {tdcHeader.length > 0 &&
                      tdcHeader.map((tdcItem) => {
                        const tdcValue = totals.tdc.find(
                          (tdc) => tdc.nameBank === tdcItem.nameBank
                        );
                        return (
                          <Table.Cell key={tdcItem.nameBank} textAlign="end">
                            <FormatNumber
                              value={tdcValue ? tdcValue.total : 0}
                              style="currency"
                              currency="USD"
                            />
                          </Table.Cell>
                        );
                      })}

                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={totals.tips}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
            <PaginationRoot
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
            </PaginationRoot>
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
