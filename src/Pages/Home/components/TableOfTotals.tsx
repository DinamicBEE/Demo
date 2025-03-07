import { useState } from 'react';
import { Box, Button, FormatNumber, Grid, GridItem, Group, Input, InputAddon, Skeleton, Table, Tag, Text } from '@chakra-ui/react'
import { exportCSV } from '@services/homeService'
import { useClousing } from '@context/home/clousingContext';
import ClousingLayout from './ClousingLayout';
import { Alert } from '@components/ui/alert';
import { CurrencyInput } from '@components/NumericInput';
import { ClousingLinesModel, TableOfTotalsProps } from '@models/common.clousing.model';
import Loading from '@components/loading';
import '../Home.css'
import { STATUS } from '@models/status.model';
import { getStatusColor } from '../../../utils/getStatusColor';


function TableOfTotals({ subsidiary, store }: TableOfTotalsProps) {

    const { data, loading, error, header, getInfo } = useClousing();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<ClousingLinesModel | null>(null);
    
    function handleExportCSV() {
        exportCSV(data,header)
    }

    const openDialog = (item: any) => {
      setSelectedEmployee(item);
      setIsDialogOpen(true);
    }

    const closeDialog = () => {
      setSelectedEmployee(null);
      setIsDialogOpen(false);
    };

    function statusColor(status: STATUS) {
      return getStatusColor(status);
    }

  return (
    <>
      {error && (
          <Alert status="error">
          {error}
          </Alert>
      )}

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
                <Input placeholder="No seleccionada" defaultValue={header.subsidiaryName} />
              </Skeleton>
            </Group>
            <Group>
              <InputAddon>Restaurante</InputAddon>
              <Skeleton loading={loading}>
                <Input placeholder="No seleccionada" defaultValue={header.storeName} />
              </Skeleton>
            </Group>
            <Group>
              <InputAddon>Fecha</InputAddon>
              <Skeleton loading={loading}>
                <Input placeholder="No seleccionada" defaultValue={header.date} />
              </Skeleton>
            </Group>
            <Group>
              <InputAddon>Hora</InputAddon>
              <Skeleton loading={loading}>
                <Input placeholder="No seleccionada" defaultValue={header.time} />
              </Skeleton>
            </Group>
            <CurrencyInput name={"Total Ventas"} value={header.totalPOS} loading={loading} />
            <CurrencyInput name={"Total Ventas Registradas"} value={header.totalPhysical} loading={loading} />
            <CurrencyInput name={"Diferencia"} value={header.difference} loading={loading} />

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
            <GridItem colSpan={1}>            
            </GridItem>
              <Button
                colorPalette="meraPrimary"
                onClick={() => {
                  handleExportCSV();
                }}
              >
                Exportar a CSV
              </Button>

            <Button colorPalette="meraInfo" onClick={()=>{getInfo(subsidiary, store)}}>Actualizar Información</Button>
          </Grid>
        </Box>

        {data.length>1 && <Box>
          <Table.ScrollArea rounded="md" borderWidth="1px">
            <Table.Root size="sm" variant="outline">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader textAlign="center">Vendedor</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Total POS</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Total Físico</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Diferencia</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Estatus</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Extas</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">MXN</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">USD</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">EUR</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">LIB</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">CAN</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Clientes General</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Clientes Especiales</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Prepago</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">CXC Empleados</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Intercompañia</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data.map((item: ClousingLinesModel) => (
                  <Table.Row key={item.id}>
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
                        <FormatNumber value={item.totalPOS} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell>

                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.totalPhysical} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell>
                    
                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.difference} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell>

                    <Table.Cell textAlign="center">
                      <Tag.Root colorPalette={statusColor(item.status as STATUS)}>
                        <Tag.Label>{item.status}</Tag.Label>
                      </Tag.Root>
                    </Table.Cell>

                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.extra} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell>

                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.mxm} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell>

                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.usd} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell>

                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.eur} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell>

                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.lib} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell>

                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.can} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell>

                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.customer} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell>

                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.specialCustomer} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell>

                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.prepaid} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell>

                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.employees} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell>

                    <Table.Cell textAlign="end">
                      <Text>
                        <FormatNumber value={item.intercompany} style="currency" currency="USD" />
                      </Text>
                    </Table.Cell>

                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </Box>}

        {data.length===0 && <h2>
                    No hay data
                </h2>}
      </Box>

      <ClousingLayout isOpen={isDialogOpen} employee={selectedEmployee} onClose={closeDialog}></ClousingLayout>
    </>
  );
}

export default TableOfTotals;