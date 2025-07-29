import { useEffect, useState } from "react";
import { Box, Button, createListCollection, Field, Grid, Heading, HStack, ListCollection, VStack, GridItem } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "@components/ui/select";
import { selectOption } from "@models/common.model";
import DatePicker from "../LotClosure/components/DatePicker";
import { fetchAndSetData } from "../../utils/selectManagement";
import { getCDCStarbucks } from "@services/starbucksService";
import Loading from "@components/Loading";
import StarbucksTable from "./components/Tables/StarbucksTable";


function StarbucksClosure() {

    const [cdc, setCDC] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));
    const [selectedCDC, setSelectedCDC] = useState<number>(0);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        null,
        null,
    ]);
    const [startDate, endDate] = dateRange;
    const [showTable, setShowTable] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
  
    useEffect(() => {
        async function fetchData() {
            try {

                await Promise.all([
                    fetchAndSetData(getCDCStarbucks, setCDC),
                ]);
                
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, 
    []);

    return (
        <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
            <VStack align="start">
                <Heading>
                    Portal de Starbucks
                </Heading>

                <HStack w="100%">
                    <Grid
                        templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
                        gap={4}
                        mb={4}
                        w="100%"
                        alignItems="end"
                    >
                        
                        <SelectRoot
                            collection={cdc}
                            onValueChange={(event) => {
                                const selectedCountries = event.items.map((item: selectOption) => ({
                                    value: item.value,
                                    label: item.label,
                                }));

                                setSelectedCDC(selectedCountries[0].value);
                            }}
                        >
                            <SelectLabel fontFamily="heading">
                            Centro de consumo
                            </SelectLabel>
                            <SelectTrigger>
                            <SelectValueText placeholder="Selecciona un Centro de consumo" />
                            </SelectTrigger>
                            <SelectContent>
                            {cdc.items.length > 0 && cdc.items.map((item: selectOption) => (
                                <SelectItem item={item} key={item.value}>
                                {item.label}
                                </SelectItem>
                            ))}
                            </SelectContent>
                        </SelectRoot>

                        <Field.Root>
                            <Field.Label>Rango de fechas</Field.Label>
                            <DatePicker
                                startDate={startDate}
                                endDate={endDate}
                                onChange={setDateRange}
                            />
                        </Field.Root>

                        <GridItem colSpan={1} />

                        <Button
                            colorPalette="meraInfo"
                            alignSelf={"flex-end"}
                            onClick={() => {
                                setLoading(true);
                                console.log("Searching with CDC:", selectedCDC, "Start Date:", startDate, "End Date:", endDate);
                                setShowTable(true);
                                setLoading(false);
                            }}
                            disabled={
                                selectedCDC !== 0 &&
                                startDate !== null &&
                                endDate !== null
                                ? false
                                : true
                            }
                            >
                            Buscar
                        </Button>
                        
                    </Grid>
                </HStack>

            </VStack>

            {loading && (
                <Box position="fixed" top="50%" left="50%" zIndex={1000}>
                    <Loading />
                </Box>
            )
            }

            
            { showTable && (
                
                <>
                
                    <StarbucksTable></StarbucksTable>
            
                </>

            )}
        </Box>
    );
}

export default StarbucksClosure;