import { useState } from 'react';
import { Box, Button, Grid, Table, Link, VStack, HStack, Heading, Text, createListCollection } from '@chakra-ui/react'
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
  } from "../../components/ui/select"
import './Home.css'

function Home() {
    const [subsidiary, setSubsidiary] = useState("");
    const [location, setLocation] = useState("");

    return (
        <Box
            p={6}
            boxShadow="xl"
            borderRadius="lg"
            bg="white"
        >
                 
            <VStack spacing={4} align="start">
                <Heading size="md">Selecciona Subsidiaria y Restaurante</Heading>
                <HStack w="100%">
                    <Grid
                        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} 
                        gap={4} 
                        mb={4}
                        w="100%"
                    >

                        <SelectRoot collection={frameworks}
                            value={subsidiary}
                            onValueChange={(e) => setSubsidiary(e.value)}
                        >
                            <SelectLabel>Selecciona Subsidiaria</SelectLabel>
                            <SelectTrigger>
                                <SelectValueText placeholder="Selecciona Subsidiaria" />
                            </SelectTrigger>
                            <SelectContent>
                                {frameworks.items.map((movie) => (
                                    <SelectItem item={movie} key={movie.value}>
                                        {movie.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </SelectRoot>

                        <SelectRoot collection={frameworks} 
                            value={location}
                            onValueChange={(e) => setLocation(e.value)}
                        >
                            <SelectLabel>Selecciona Centro de consumo</SelectLabel>
                            <SelectTrigger>
                                <SelectValueText placeholder="Selecciona Centro de consumo" />
                            </SelectTrigger>
                            <SelectContent>
                                {frameworks.items.map((movie) => (
                                    <SelectItem item={movie} key={movie.value}>
                                        {movie.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </SelectRoot>

                        
                        <Button className='primary-button'>
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
                    <Text>Subsidiaria: {subsidiary || "No seleccionada"}</Text>
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

const frameworks = createListCollection({
    items: [
      { label: "React.js", value: "react" },
      { label: "Vue.js", value: "vue" },
      { label: "Angular", value: "angular" },
      { label: "Svelte", value: "svelte" },
    ],
  })

  const items = [
    { id: 1, name: "Laptop", category: "Electronics", price: 999.99 },
    { id: 2, name: "Coffee Maker", category: "Home Appliances", price: 49.99 },
    { id: 3, name: "Desk Chair", category: "Furniture", price: 150.0 },
    { id: 4, name: "Smartphone", category: "Electronics", price: 799.99 },
    { id: 5, name: "Headphones", category: "Accessories", price: 199.99 },
  ]

export default Home;