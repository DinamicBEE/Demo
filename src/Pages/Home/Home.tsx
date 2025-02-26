import { useState, useEffect } from 'react';
import { Box, Button, Grid, VStack, HStack, Heading, createListCollection, ListCollection } from '@chakra-ui/react'
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
  } from "@components/ui/select"
import { Alert } from "@components/ui/alert"
import { useList } from '@context/home/listsContext';
import { useClousing } from '@context/home/clousingContext';
import TableOfTotals from './components/TableOfTotals';
import './Home.css'
import { StoreModel } from '@models/common.model';
import { ValueChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/select/namespace";
import Loading from '@components/Loading';

function Home() {
    const [subsidiary, setSubsidiary] = useState<ListCollection>(createListCollection({ items: [] }));
    const [SubSelect, setSubSelect] = useState<number>(0);
    const [stores, setStores] = useState<StoreModel[]>([])
    const [storeBySub, setStoreBySub] = useState<ListCollection>(createListCollection({ items: [] }));
    const [location, setLocation] = useState<number>(0);
    const [catalogLoading, setCatalogLoading] = useState<boolean>(false);
    const [showTable, setShowTable] = useState<boolean>(false);
    const { getInfo } = useClousing();
 
    const { getStoresData, error, getSubsidiariesData } = useList();

    useEffect(()=>{

        async function fetchData() {

            setCatalogLoading(true);

            const subsidiariesData = await getSubsidiariesData();

            const subList = createListCollection({
                items: subsidiariesData.map(item =>({
                    value: item.id,
                    label: item.name
                }))
            })
            
            setSubsidiary(subList);

            const storeData = await getStoresData()

            setStores(storeData);

            setCatalogLoading(false);

        }

        fetchData();

    },[])

    function filterStore(event: ValueChangeDetails<any>) {
      const subSelect = Number(event.value[0]);

      setSubSelect(subSelect)
      const selectedId = subSelect;

      let storeBySubsidiary = stores.filter(
        (item) => item.subsidiary.id === selectedId
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
                 
            <VStack spaceY={4} align="start">
                <Heading>Corte de caja</Heading>
                {catalogLoading && (
                    <Box position="fixed" top="50%" left="50%">
                    <Loading />
                    </Box>
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

                        {!catalogLoading && <SelectRoot collection={subsidiary}
                            onValueChange={(event) => filterStore(event)}
                        >
                            <SelectLabel fontFamily="heading">Selecciona Subsidiaria</SelectLabel>
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

                        {SubSelect!=0 && <SelectRoot collection={storeBySub} 
                            onValueChange={(event) => setLocation(Number(event.value[0]))}
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

                        
                        {location!=0 && <Button colorPalette="meraPrimary" onClick={()=>{
                                setShowTable(true)
                                getInfo(SubSelect, location)}
                            }>
                            Buscar
                        </Button>}

                    </Grid>
                </HStack>
            </VStack>

            {showTable && <TableOfTotals subsidiary={SubSelect} store={location} />}
                
        </Box>
        
    );
}

export default Home;