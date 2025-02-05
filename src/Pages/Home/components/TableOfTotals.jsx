import { useState } from 'react';
import { Box, Button, Grid, Table, Text } from '@chakra-ui/react'
import { Alert } from "@components/ui/alert"
import { exportCSV } from '@services/homeService'
import { useClousing } from '@context/home/clousingContext';
import Loading from '@components/loading';
import ClousingLayout from './ClousingLayout';

function TableOfTotals({ subsidiary, store }) {

    const { data, loading, error, header, getInfo } = useClousing();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    
    function handleExportCSV() {
        exportCSV({data,header})
    }

    const openDialog = (item) => {
      setSelectedEmployee(item);
      setIsDialogOpen(true);
    }

    const closeDialog = () => {
      setSelectedEmployee(null);
      setIsDialogOpen(false);
    };

  return (
    <>
      {error && (
          <Alert status="error">
          {error}
          </Alert>
      )}

      {loading && <Loading />}

      {data!=null && <Box>
        <Box mb={6}>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
            gap={4}
            mb={4}
          >
            <Text>Subsidiaria: {header.subsidiaryName || "No seleccionada"}</Text>
            <Text>Restaurante: {header.storeName || "No seleccionado"}</Text>
            <Text>Fecha: {header.date}</Text>
            <Text>Hora: {header.time}</Text>
            <Text>Total Ventas: {header.totalPOS}</Text>
            <Text>Total Ventas Registradas: {header.totalClousing}</Text>
            <Text>Diferencia: {header.difference}</Text>
            <Text></Text>
          </Grid>
        </Box>

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

            <Button className="primary-button" onClick={()=>{getInfo(subsidiary, store)}}>Actualizar Información</Button>
          </Grid>
        </Box>

        {data.length>1 && <Box>
          <Table.ScrollArea rounded="md" borderWidth="1px">
            <Table.Root size="sm" variant="outline" striped>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>Vendedor</Table.ColumnHeader>
                  <Table.ColumnHeader>Total POS</Table.ColumnHeader>
                  <Table.ColumnHeader>Total Físico</Table.ColumnHeader>
                  <Table.ColumnHeader>Diferencia</Table.ColumnHeader>
                  <Table.ColumnHeader>Estatus</Table.ColumnHeader>
                  <Table.ColumnHeader>Extas</Table.ColumnHeader>
                  <Table.ColumnHeader>MXN</Table.ColumnHeader>
                  <Table.ColumnHeader>USD</Table.ColumnHeader>
                  <Table.ColumnHeader>EUR</Table.ColumnHeader>
                  <Table.ColumnHeader>LIB</Table.ColumnHeader>
                  <Table.ColumnHeader>CAN</Table.ColumnHeader>
                  <Table.ColumnHeader>Clientes General</Table.ColumnHeader>
                  <Table.ColumnHeader>Clientes Especiales</Table.ColumnHeader>
                  <Table.ColumnHeader>Prepago</Table.ColumnHeader>
                  <Table.ColumnHeader>CXC Empleados</Table.ColumnHeader>
                  <Table.ColumnHeader>Intercompañia</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
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
                    <Table.Cell>{item.totalPOS}</Table.Cell>
                    <Table.Cell>{item.totalClousing}</Table.Cell>
                    <Table.Cell>{item.difference}</Table.Cell>
                    <Table.Cell>{item.status}</Table.Cell>
                    <Table.Cell>{item.mxm}</Table.Cell>
                    <Table.Cell>{item.mxm}</Table.Cell>
                    <Table.Cell>{item.usd}</Table.Cell>
                    <Table.Cell>{item.eur}</Table.Cell>
                    <Table.Cell>{item.lib}</Table.Cell>
                    <Table.Cell>{item.can}</Table.Cell>
                    <Table.Cell>{item.generalCXC}</Table.Cell>
                    <Table.Cell>{item.specialCXC}</Table.Cell>
                    <Table.Cell>{item.prepaid}</Table.Cell>
                    <Table.Cell>{item.employetotal}</Table.Cell>
                    <Table.Cell>{item.intercompany}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </Box>}

        {data.length===0 && <h2>
                    No hay data
                </h2>}
      </Box>}

      <ClousingLayout isOpen={isDialogOpen} employee={selectedEmployee} onClose={closeDialog}></ClousingLayout>
    </>
  );
}

export default TableOfTotals;