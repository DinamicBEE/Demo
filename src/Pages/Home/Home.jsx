import { useState, useEffect } from 'react';
import { Box, Button, Grid, VStack, HStack, Heading, Text, Spinner, createListCollection } from '@chakra-ui/react'
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
  } from "@components/ui/select"
import { Alert } from "@components/ui/alert"
import { getSubsidiaries, getStores } from '@services/catalogService';
import { useList } from '@context/Home/listsContext';
import TableOfTotals from './components/TableOfTotals';
import './Home.css'
import { useClousing } from '@context/home/clousingContext';

function Home() {
    const [SubSelect, setSubSelect] = useState("");
    const [location, setLocation] = useState("");
    const [storeBySub, setStoreBySub] = useState(null);
    const { data, getInfo } = useClousing();
 
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
        if (!subsidiary) {
          getData(getSubsidiaries, setSubsidiary);
        }
        if (!store) {
          getData(getStores, setStore);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

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

                        
                        <Button className='primary-button' onClick={()=>{getInfo(SubSelect, location)}}>
                            Buscar
                        </Button>

                    </Grid>
                </HStack>
            </VStack>

            {data!=null && data.length>1 && <TableOfTotals subsidiary={SubSelect} store={location} />}
            
            {data!=null && data.length===0 && <h2>
                    No hay data
                </h2>}
        
        </Box>
        
    );
}

export default Home;