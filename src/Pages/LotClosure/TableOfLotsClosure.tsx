import { Suspense, useState } from "react";
import {
  Box,
  Button,
  FormatNumber,
  Grid,
  Skeleton,
  Table,
  Tag,
  Text,
} from "@chakra-ui/react";
import LoteClosureDialog from "./LoteClosureDialog";
import { useLotClosureList } from "@context/lotClosure/lotClosureListContext";
import { STATUS } from "@models/status.model";
import { exportCSV } from "../../utils/exportCSV";
import { LotClosure } from "@models/lotClosure.model";
import { TableLotsClosureProps } from "@models/lotClosure.model";
import { getStatusColor } from "../../utils/getStatusColor";

function TableOfLotClosure({
  companyId,
  locationId,
  dateRange,
  showTable,
}: TableLotsClosureProps) {
  const { lotsClosure, fetchLotClosureData, loading } = useLotClosureList();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<LotClosure>({} as LotClosure);

  function statusColor(status: STATUS) {
    return getStatusColor(status);
  }

  function handleExportCSV() {
    exportCSV(
      {
        heders: [
          { label: "Ubicación", key: "location" },
          { label: "Empresa", key: "company" },
          { label: "Numero de lote", key: "lotNumber" },
          { label: "Estado", key: "status" },
          { label: "Total POS", key: "totalPOS" },
          { label: "Total Lote", key: "totalClousing" },
          { label: "Diferencia", key: "difference" },
          { label: "Empleado (Realizado por)", key: "employe" },
        ],
        data: lotsClosure.map((item) => ({
          location: item.location.name,
          company: item.company.name,
          lotNumber: item.lotNumber,
          status: item.status,
          totalPOS: item.totalPOS,
          totalClousing: item.totalClousing,
          difference: item.difference,
          employe: item.employe,
        })),
      },
      "lotes-cierre"
    );
  }

  const openDialog = (item: LotClosure) => {
    setSelectedLot(item);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedLot({} as LotClosure);
    setIsDialogOpen(false);
  };

  return (
    <>
      {/*  {loading && <Loading />} */}
      {showTable && (
        <Box>
          <Box>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={4}
              mb={4}
              w="100%"
            >
              <Button
                colorPalette="meraPrimary"
                onClick={() => {
                  handleExportCSV();
                }}
                disabled={lotsClosure.length === 0 || loading}
              >
                Exportar a CSV
              </Button>

              <Button
                colorPalette="meraInfo"
                onClick={() => {
                  fetchLotClosureData(dateRange, locationId, companyId, true);
                }}
                disabled={loading}
              >
                Actualizar Información
              </Button>
            </Grid>
          </Box>

          <Box>
            <Table.ScrollArea rounded="md" borderWidth="1px">
              <Table.Root size="sm" variant="outline">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader textAlign="center">
                      Ubicación
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      Empresa
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      Numero de lote
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      Estado
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      Total POS
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      Total Lote
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      Diferencia
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      Empleado (Realizado por)
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {loading && (
                    <Table.Row>
                      <Table.Cell textAlign="center">
                        <Skeleton height="20px" />
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Skeleton height="20px" />
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Skeleton height="20px" />
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Skeleton height="20px" />
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Skeleton height="20px" />
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Skeleton height="20px" />
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Skeleton height="20px" />
                      </Table.Cell>
                      <Table.Cell textAlign="center">
                        <Skeleton height="20px" />
                      </Table.Cell>
                    </Table.Row>
                  )}
                  {lotsClosure.length === 0 && !loading && (
                    <Table.Row>
                      <Table.Cell colSpan={8} textAlign="center">
                        <Text>No hay información disponible</Text>
                      </Table.Cell>
                    </Table.Row>
                  )}
                  {lotsClosure.length > 0 &&
                    !loading &&
                    lotsClosure.map((item) => (
                      <Table.Row key={item.id}>
                        <Table.Cell textAlign="center">
                          <Text>{item.location.name}</Text>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <Text
                            as="span"
                            cursor="pointer"
                            textDecoration="underline"
                            color="blue.500"
                            onClick={() => openDialog(item)}
                          >
                            {item.company.name}
                          </Text>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <Text>{item.lotNumber}</Text>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <Tag.Root colorPalette={statusColor(item.status)}>
                            <Tag.Label>{item.status}</Tag.Label>
                          </Tag.Root>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <Text>
                            <FormatNumber
                              value={item.totalPOS}
                              style="currency"
                              currency="USD"
                            />
                          </Text>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <Text>
                            <FormatNumber
                              value={item.totalLot}
                              style="currency"
                              currency="USD"
                            />
                          </Text>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <Text>
                            <FormatNumber
                              value={
                                item.status === STATUS.OPEN
                                  ? 0
                                  : item.totalPOS - item.totalLot
                              }
                              style="currency"
                              currency="USD"
                            />
                          </Text>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <Text>{item.employe}</Text>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          </Box>
        </Box>
      )}
      <Suspense>
        <LoteClosureDialog
          isOpen={isDialogOpen}
          lot={selectedLot}
          onClose={closeDialog}
        />
      </Suspense>
    </>
  );
}

export default TableOfLotClosure;
