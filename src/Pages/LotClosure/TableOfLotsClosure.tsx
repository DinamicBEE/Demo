import { useState } from "react";
import { Box, Button, FormatNumber, Grid, Table, Text } from "@chakra-ui/react";
import LoteClosureDialog from "./LoteClosureDialog";
interface TableOfTotalsProps {
  subsidiary: number;
  store: number;
}

const data = [
  {
    id: 1,
    location: "Location 1",
    company: "Company 1",
    lotNumber: "123456",
    status: "Status 1",
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
    employe: "Employee 1",
  },
  {
    id: 2,
    location: "Location 2",
    company: "Company 2",
    lotNumber: "123456",
    status: "Status 2",
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
    employe: "Employee 2",
  },
  {
    id: 3,
    location: "Location 3",
    company: "Company 3",
    lotNumber: "123456",
    status: "Status 3",
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
    employe: "Employee 3",
  },
  {
    id: 4,
    location: "Location 4",
    company: "Company 4",
    lotNumber: "123456",
    status: "Status 4",
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
    employe: "Employee 4",
  },
  {
    id: 5,
    location: "Location 5",
    company: "Company 5",
    lotNumber: "123456",
    status: "Status 5",
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
    employe: "Employee 5",
  },
  {
    id: 6,
    location: "Location 6",
    company: "Company 6",
    lotNumber: "123456",
    status: "Status 6",
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
    employe: "Employee 6",
  },
  {
    id: 7,
    location: "Location 7",
    company: "Company 7",
    lotNumber: "123456",
    status: "Status 7",
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
    employe: "Employee 7",

    },
];

function TableOfLotClosure({ subsidiary, store }: TableOfTotalsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);

  function handleExportCSV() {
    /* exportCSV({ data, header }); */
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
      {data != null && (
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
              >
                Actualizar Información
              </Button>
            </Grid>
          </Box>

          {data.length > 1 && (
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
                    {data.map((item: any) => (
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
                          <Text>{item.status}</Text>
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

          {data.length === 0 && <h2>No hay data</h2>}
        </Box>
      )}
      <LoteClosureDialog isOpen={isDialogOpen} company={''} onClose={closeDialog}/>
    </>
  );
}

export default TableOfLotClosure;
