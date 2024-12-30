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

function Home() {
    const [SubSelect, setSubSelect] = useState("");
    const [location, setLocation] = useState("");
    const [storeBySub, setStoreBySub] = useState(null);

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

    function getGeneralInfo () {
        console.log(SubSelect, location)
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

                        
                        <Button className='primary-button' onClick={getGeneralInfo}>
                            Buscar
                        </Button>

                    </Grid>
                </HStack>
            </VStack>

            <Box mb={6}>

                <Grid 
                    templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} 
                    gap={4} 
                    mb={4}
                >
                    <Text>Subsidiaria: {SubSelect || "No seleccionada"}</Text>
                    <Text>Restaurante: {location || "No seleccionado"}</Text>
                    <Text>Fecha: {new Date().toLocaleDateString()}</Text>
                    <Text>Hora: {new Date().toLocaleTimeString()}</Text>
                    <Text>Total Ventas: $2000</Text>
                    <Text>Total Ventas Registradas: $1980</Text>
                    <Text>Diferencia: $20</Text>
                    <Text>Estado: Sincronizado</Text>
                </Grid>



            </Box>

            <Box>
                
                <Grid 
                    templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} 
                    gap={4} 
                    mb={4}
                    w="100%"
                >

                    <Button className='secondary-button'>
                        Exportar a CSV
                    </Button>

                    <Button className='primary-button'>
                        Actualizar Información
                    </Button>
                
                </Grid>

            </Box>

            <Box>

                <Table.ScrollArea rounded="md" borderWidth="1px" maxW="xl">
                    <Table.Root size="sm" variant="outline" striped>
                        <Table.Header>
                            <Table.Row>
                            <Table.ColumnHeader>Product</Table.ColumnHeader>
                            <Table.ColumnHeader>Category</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="end">Price</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {items.map((item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell>
                                    <Link variant="plain" href="#">
                                        {item.name}
                                    </Link>
                                </Table.Cell>
                                <Table.Cell>{item.category}</Table.Cell>
                                <Table.Cell textAlign="end">{item.price}</Table.Cell>
                            </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>

            </Box>

        </Box>
        
    );
}

  const items = [
    { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
    { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
    { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
    { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
    { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
  ]

export default Home;