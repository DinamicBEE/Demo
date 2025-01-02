import { useState, useEffect } from 'react';
import { Box, Button, Grid, Table, Link, VStack, HStack, Heading, Text, Spinner, createListCollection } from '@chakra-ui/react'
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
  } from "../../components/ui/select"
import { Alert } from "../../components/ui/alert"
import './Home.css'
import { useList } from '../../context/home/listsContext';
import { getSubsidiaries, getStores } from '../../services/catalogService';
import { getGeneralInfo } from '../../services/homeService'

function Home() {
    const [SubSelect, setSubSelect] = useState("");
    const [location, setLocation] = useState("");
    const [storeBySub, setStoreBySub] = useState(null);

    const [header, setHeader] = useState(null);
    const [dataTable, setdataTable] = useState([]);

    const {
        subsidiary,
        setSubsidiary,
        store,
        setStore,
        isLoading,
        error,
        getData,
      } = useList();

    useEffect(()=>{
        console.log(subsidiary)
        console.log(store)
        if (!subsidiary) {
          getData(getSubsidiaries, setSubsidiary);
        }
        if (!store) {
          getData(getStores, setStore);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    async function getInfo () {
        console.log(SubSelect, location)
        const response = await getGeneralInfo(SubSelect, location)

        console.log(response)
        setHeader(response.header)
        setdataTable(response.employees)
    }

    function exportCSV() {
        const csvString = [
            ["Vendedor", "Total POS", "Total Físico", "Diferencia",
             "Estatus", "Extras", "MXN", "USD", "EUR", "LIB", "CAN",
             "Clientes General", "Clientes Especiales", "Prepago",
             "CXC Empleados", "Intercompañia"
            ],
            ...dataTable.map(item => [
                item.employe, item.totalPOS, item.totalClousing, 
                item.difference, item.status, item.mxm, item.mxm,
                item.usd, item.eur, item.lib, item.can, item.generalCXC,
                item.specialCXC, item.prepaid, item.employetotal,
                item.intercompany 
            ])
        ]
        .map(row => row.join(","))
        .join("\n");

        const blob = new Blob([csvString], {type: 'text/csv'});

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${header.subsidiaryName}_${header.storeName}_${header.date}`;        document.body.appendChild(link)
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    function filterStore(subSelect) {

      setSubSelect(subSelect)
      const selectedId = subSelect[0];

      let storeBySubsidiary = store.filter(
        (item) => item.parent.id === selectedId
      );

      if (storeBySubsidiary.length > 0) {
        const mappedStores = storeBySubsidiary.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        
        let storeFilter = createListCollection({
          items: mappedStores,
        });

        setStoreBySub(storeFilter);

      } else {
        console.warn("No se encontraron tiendas para esta subsidiaria.");
      }

    }


    return (
        <Box
            p={6}
            boxShadow="xl"
            borderRadius="lg"
            bg="white"
        >
                 
            <VStack spacing={4} align="start">
                <Heading size="md">Selecciona Subsidiaria y Restaurante</Heading>
                {isLoading && (
                    <VStack colorPalette="teal">
                        <Spinner color="colorPalette.600" />
                        <Text color="colorPalette.600">Loading...</Text>
                    </VStack>
                )}

                {error && (
                    <Alert status="error">
                    {error}
                    </Alert>
                )}
                <HStack w="100%">
                    <Grid
                        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} 
                        gap={4} 
                        mb={4}
                        w="100%"
                    >

                        {subsidiary!=null && <SelectRoot collection={subsidiary}
                            value={SubSelect}
                            onValueChange={(e) => filterStore(e.value)}
                        >
                            <SelectLabel>Selecciona Subsidiaria</SelectLabel>
                            <SelectTrigger>
                                <SelectValueText placeholder="Selecciona Subsidiaria" />
                            </SelectTrigger>
                           <SelectContent>
                                {subsidiary.items.map((item) => (
                                    <SelectItem item={item} key={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </SelectRoot>}

                        {storeBySub!=null && <SelectRoot collection={storeBySub} 
                            value={location}
                            onValueChange={(e) => setLocation(e.value)}
                        >
                            <SelectLabel>Selecciona Centro de consumo</SelectLabel>
                            <SelectTrigger>
                                <SelectValueText placeholder="Selecciona Centro de consumo" />
                            </SelectTrigger>
                            <SelectContent>
                                {storeBySub.items.map((movie) => (
                                    <SelectItem item={movie} key={movie.value}>
                                        {movie.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </SelectRoot>}

                        
                        <Button className='primary-button' onClick={getInfo}>
                            Buscar
                        </Button>

                    </Grid>
                </HStack>
            </VStack>

            {header!=null && <Box mb={6}>

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

            </Box>}

            {dataTable.length>1 && <Box>
                
                <Grid 
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} 
                    gap={4} 
                    mb={4}
                    w="100%"
                >

                    <Button className='secondary-button' onClick={()=>{exportCSV()}}>
                        Exportar a CSV
                    </Button>

                    <Button className='primary-button' onClick={getInfo}>
                        Actualizar Información
                    </Button>
                
                </Grid>

            </Box>}

            {dataTable.length>1 && <Box>

                <Table.ScrollArea rounded="md" borderWidth="1px" >
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
                            {dataTable.map((item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell>
                                    <Link variant="plain" href="#">
                                        {item.employe}
                                    </Link>
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

        </Box>
        
    );
}

export default Home;