import { Suspense, useEffect, useState } from "react";
import { Box, Button, FormatNumber, Grid, Skeleton, Table, Tag, Text } from "@chakra-ui/react";
import LoteClosureDialog from "./LoteClosureDialog";
import { useLotClosureList } from "@context/lotClosure/lotClosureListContext";
import { STATUS } from "@models/const/status.const";
import { exportCSV } from "../../utils/exportCSV";
import { LotClosure } from "@models/lotClosure.model";
import { TableLotsClosureProps } from "@models/lotClosure.model";
import { getStatusColor } from "../../utils/getStatusColor";
import "./LotStyles.css";

const pageSize = 150;
function TableOfLotClosure({
  locations,
  date,
  showTable,
  status
}: TableLotsClosureProps) {
  const { lotsClosure, fetchLotClosureData, loading, lotTotals } = useLotClosureList();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedLot, setSelectedLot] = useState<LotClosure>({} as LotClosure);
  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<LotClosure[]>([]);
  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  useEffect(() => {
    setPage(page);
    const items = lotsClosure.slice(startRange, endRange);    
    setVisibleItems(items);
  }, [page, lotsClosure]);

  function statusColor(status: STATUS) {
    return getStatusColor(status);
  }

  function handleExportCSV() {
    exportCSV(
      {
        heders: [
          { label: "Ubicación", key: "location" },
          { label: "Empresa", key: "company" },
          { label: "Estado", key: "status" },
          { label: "Total POS", key: "totalPOS" },
          { label: "Total Lote", key: "totalLot" },
          { label: "Diferencia", key: "difference" },
          { label: "Empleado (Realizado por)", key: "employe" },
        ],
        data: lotsClosure.map((item) => ({
          location: item.consumerCenter,
          company: item.subsidiary,
          status: item.status,
          totalPOS: item.totalPos,
          totalLot: item.totalLote,
          difference: item.difference,
          employe: item.employeeCreator === null ? " --- " : item.employeeCreator,
        })),
      },
      "lotes-cierre"
    );
  }

  const openDialog = (item: LotClosure) => {
    setSelectedLot(item);
    setIsDialogOpen(true);
  };

  const closeDialog = (isRefresh:boolean) => {
    isRefresh ? fetchLotClosureData(date, locations, status, true) : null;
    setSelectedLot({} as LotClosure);
    setIsDialogOpen(false);
  };

  return (
    <>

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
                  fetchLotClosureData(date, locations, status, true);
                }}
                disabled={loading}
              >
                Actualizar Información
              </Button>
            </Grid>
          </Box>

          <Box>
            <Table.ScrollArea rounded="md" borderWidth="1px" h="500px" mb="8px">
              <Table.Root size="sm" variant="outline" stickyHeader>
                <Table.Header>
                  <Table.Row zIndex={1}>
                    <Table.ColumnHeader textAlign="center" style={{left: "0px", position: "sticky", minWidth: "294px"}}>
                      Zona
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center" style={{left: "294px", position: "sticky"}}>
                      CDC
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      Estado
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      Total POS
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      Total Corte de Caja
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
                  {loading && Array.from({ length: 12 }).map((_, rowIndex) => (
                      <Table.Row key={rowIndex}>
                        {Array.from({ length: 8 }).map((_, colIndex) => (
                          <Table.Cell key={colIndex} textAlign="center">
                            <Skeleton height="20px" />
                          </Table.Cell>
                        ))}
                      </Table.Row>
                    )
                  )}
                  {lotsClosure.length === 0 && !loading && (
                    <Table.Row>
                      <Table.Cell colSpan={8} textAlign="center">
                        <Text>No hay información disponible</Text>
                      </Table.Cell>
                    </Table.Row>
                  )}
                  {visibleItems.length > 0 &&
                    !loading &&
                    visibleItems.map((item) => (
                      <Table.Row key={item.id} className="row_bg">
                        <Table.Cell textAlign="center" className="row_bg_column1">
                          <Text>
                            {item.zone}
                          </Text>
                        </Table.Cell>
                        <Table.Cell textAlign="center" className="row_bg_column2">
                          <Text
                            as="span"
                            cursor="pointer"
                            textDecoration="underline"
                            color="blue.500"
                            onClick={() => openDialog(item)}
                          >
                            {item.consumerCenter}
                          </Text>
                        </Table.Cell>
                        
                        <Table.Cell textAlign="center">
                          <Tag.Root colorPalette={statusColor(item.status)}>
                            <Tag.Label>{item.status}</Tag.Label>
                          </Tag.Root>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <Text>
                            <FormatNumber
                              value={item.totalPos}
                              style="currency"
                              currency="USD"
                            />
                          </Text>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <Text>
                            <FormatNumber
                              value={item.totalPos}
                              style="currency"
                              currency="USD"
                            />
                          </Text>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <Text>
                            <FormatNumber
                              value={item.totalLote}
                              style="currency"
                              currency="USD"
                            />
                          </Text>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <Text>
                            <FormatNumber
                              value={item.difference}
                              style="currency"
                              currency="USD"
                            />
                          </Text>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <Text>{item.employeeCreator === null ? " --- " : item.employeeCreator}</Text>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
                <Table.Footer>
                  <Table.Row bg="bg.subtle" fontWeight="bold" style={{position:"sticky", bottom:0}}>
                    <Table.Cell textAlign="center" css={{position:"sticky"}} bg="bg.subtle" left="0"></Table.Cell>
                    <Table.Cell textAlign="center" css={{position:"sticky"}} bg="bg.subtle" left="100px">Totales</Table.Cell>
                    <Table.Cell textAlign="center" css={{position:"sticky"}} bg="bg.subtle" left="0"></Table.Cell>
                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={lotTotals.totalPos || 0}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>                    
                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={lotTotals.totalClosure || 0}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>                    
                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={lotTotals.totalLote || 0}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="end">
                      <FormatNumber
                        value={lotTotals.difference || 0}
                        style="currency"
                        currency="USD"
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center" css={{position:"sticky"}} bg="bg.subtle" left="0"></Table.Cell>
                  </Table.Row>
                </Table.Footer>
              </Table.Root>
            </Table.ScrollArea>
            <p className="bt-2"> Mostrando <span style={{fontWeight: "bold"}}>1</span> a <span style={{fontWeight: "bold"}}>{lotsClosure.length}</span> de <span style={{fontWeight: "bold"}}>{lotsClosure.length}</span> Registros </p>
          </Box>
        </Box>
      )}
      <Suspense>
        <LoteClosureDialog
          isOpen={isDialogOpen}
          lot={selectedLot}
          onClose={closeDialog}
          date={date}
        />
      </Suspense>
    </>
  );
}

export default TableOfLotClosure;
