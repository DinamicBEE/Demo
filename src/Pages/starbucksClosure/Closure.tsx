import { useEffect, useState } from "react";
import { Box, Button, createListCollection, Field, Grid, Heading, HStack, ListCollection, VStack, GridItem } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "@components/ui/select";
import { selectOption } from "@models/common.model";
import DatePicker from "../LotClosure/components/DatePicker";
import { fetchAndSetData } from "../../utils/selectManagement";
import { getCDCStarbucks, getStarbucksData } from "@services/starbucksService";
import Loading from "@components/Loading";
import StarbucksTable from "./components/Tables/StarbucksTable";
import { StarbucksTableDataModel, StarbucksTableHeader } from "@models/starbucks.model";


function StarbucksClosure() {

    const [cdc, setCDC] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));
    const [selectedCDC, setSelectedCDC] = useState<number>(0);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        null,
        null,
    ]);
    const [data, setData] = useState<StarbucksTableDataModel>({} as StarbucksTableDataModel)
    const [startDate, endDate] = dateRange;
    const [showTable, setShowTable] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [infoCDC, setInfoCDC] = useState<selectOption>({value: 0, label: ""})
  
    useEffect(() => {
        async function fetchData() {
          setLoading(true)
            try {

                await Promise.all([
                    fetchAndSetData(getCDCStarbucks, setCDC),
                ]);
                
            } catch (error) {
                console.error("Error fetching data:", error);
            }
          setLoading(false)
        }

        fetchData();
    }, 
    []);

    async function getTableData() {
      setLoading(true)
      
      const cdcName = getCDCDetails(selectedCDC)
      if(startDate == null || endDate == null) return
      const allData = await getStarbucksData(selectedCDC, startDate, endDate)

      if(allData.lines &&  allData.lines.length>0) 
      {
        const newLines = allData.lines.map( lines => {
          return {...lines, cdc: cdcName}
        });
          allData.lines = newLines;
          setData(allData);
          setShowTable(true);
      } 
      else {
          setData({
              headers: {} as StarbucksTableHeader,
              lines: []
          })
      }
      setLoading(false)
    }

    function getCDCDetails(id: number) {
        const foundItem = cdc.items.find((item) => item.value === id);
        return foundItem ? foundItem.label : "";
    }

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
                            onClick={getTableData}
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

                    <StarbucksTable headers={data.headers} lines={data.lines} getTableData={getTableData}></StarbucksTable>

                </>

            )}
        </Box>
    );
}

export default StarbucksClosure;