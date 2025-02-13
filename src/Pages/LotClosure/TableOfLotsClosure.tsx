import { useState } from "react";
import {
  Box,
  Button,
  FormatNumber,
  Grid,
  Table,
  Tag,
  Text,
} from "@chakra-ui/react";
import LoteClosureDialog from "./LoteClosureDialog";
import { useLotClosureList } from "@context/lotClosure/lotClosureListContext";
import { STATUS } from "@models/status.model";
import { exportCSV } from "../../utils/exportCSV";

interface TableOfTotalsProps {
  company: number;
  location: number;
  dateRange: string;
}

function TableOfLotClosure({
  company,
  location,
  dateRange,
}: TableOfTotalsProps) {
  const { lotsClosure, fetchLotClosureData } = useLotClosureList();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const statusColor = (status: STATUS) => {
    switch (status) {
      case STATUS.CLOSED:
        return "green";
      case STATUS.REOPENED:
        return "yellow";
      case STATUS.WITH_DIFFERENCE:
        return "red";
      case STATUS.OPEN:
        return "gray";
      default:
        return "gray";
    }
  };

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
        data: lotsClosure,
      },
      "lotes-cierre"
    );
  }

  const openDialog = (item: any) => {
    setSelectedCompany(item);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setSelectedCompany(null);
    setIsDialogOpen(false);
  };

  return (
    <>
      {lotsClosure.length > 0 && (
        <Box>
          <Box>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
              gap={4}
              mb={4}
              w="100%"
            >
              <Button
                className="secondary-button"
                onClick={() => {
                  handleExportCSV();
                }}
              >
                Exportar a CSV
              </Button>

              <Button
                className="primary-button"
                onClick={() => {
                  fetchLotClosureData(dateRange, location, company);
                }}
              >
                Actualizar Información
              </Button>
            </Grid>
          </Box>

          {lotsClosure.length > 1 && (
            <Box>
              <Table.ScrollArea rounded="md" borderWidth="1px">
                <Table.Root size="sm" variant="outline" striped>
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
                    {lotsClosure.map((item: any) => (
                      <Table.Row key={item.id}>
                        <Table.Cell textAlign="center">
                          <Text>{item.location}</Text>
                        </Table.Cell>
                        <Table.Cell textAlign="end">
                          <Text
                            as="span"
                            cursor="pointer"
                            textDecoration="underline"
                            color="blue.500"
                            onClick={() => openDialog(item)}
                          >
                            {item.company}
                          </Text>
                        </Table.Cell>
                        <Table.Cell textAlign="end">
                          <Text>{item.lotNumber}</Text>
                        </Table.Cell>
                        <Table.Cell textAlign="end">
                          <Tag.Root colorPalette={statusColor(item.status)}>
                            <Tag.Label>{item.status}</Tag.Label>
                          </Tag.Root>
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
                              value={item.totalClousing}
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
                        <Table.Cell textAlign="end">
                          <Text>{item.employe}</Text>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Root>
              </Table.ScrollArea>
            </Box>
          )}

          {lotsClosure.length === 0 && <h2>No hay data</h2>}
        </Box>
      )}
      <LoteClosureDialog
        isOpen={isDialogOpen}
        company={""}
        onClose={closeDialog}
      />
    </>
  );
}

export default TableOfLotClosure;
