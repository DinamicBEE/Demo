import { useEffect, useState } from "react";
import { Box, Button, createListCollection, Field, Grid, GridItem, ListCollection } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "@components/ui/select";
import { selectOption } from "@models/common.model";
import { getCountries, getLocations, getStatus, getSubsidiariesByCountry } from "@services/catalogService";
import GeneralInfo from "./components/table/GeneralInfo";
import { getGeneralReports } from "@services/reportService";
import { ReportClousingLinesModel, ReportTotalsModel, TotalModel } from "@models/common.clousing.model";
import TableGeneralReport from "./components/table/TableGeneralReport";
import SimpleDatePicker from "../LotClosure/components/SimpleDatePicker";
import Loading from "@components/Loading";
import { reportTotals } from "@services/homeService";

function Home_v2() {

    const [countries, setCountries] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));
    const [subsidiaries, setSubsidiaries] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));
    const [cdc, setCDC] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));
    const [status, setStatus] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));

    const [selectedCDC, setSelectedCDC] = useState<number[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<selectOption[]>([]);
    const [rowtotals, setRowTotals] = useState<ReportTotalsModel>({} as ReportTotalsModel);
    const [totals, setTotals] = useState<TotalModel>({} as TotalModel);
    
    const [formattedDate, setFormattedDate] = useState<string>('');
    const initialDate = new Date();

    const [showTable, setShowTable] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [dataReport, setDataReport] = useState<ReportClousingLinesModel[]>([] as ReportClousingLinesModel[]);

    const mapToSelectOptions = <T extends { id: number; name: string }>(
      items: T[]
    ): selectOption[] => items.map((item) => ({
        value: item.id,
        label: item.name,
    }));

    const fetchAndSetData = async <T extends { id: number; name: string }>(
      fetchFn: () => Promise<T[]>,
      setter: (data: ReturnType<typeof createListCollection<selectOption>>) => void
    ) => {
      const data = await fetchFn();
      const options = createListCollection<selectOption>({
        items: mapToSelectOptions(data),
      });
      setter(options);
    };

    useEffect(() => {
        async function fetchData() {
            try {

                await Promise.all([
                    fetchAndSetData(getCountries, setCountries),
                    fetchAndSetData(getStatus, setStatus),
                ]);
                
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
    }, 
    []);

    async function getDataReport() {
        setShowTable(true);
        setLoading(true);

        const report = await getGeneralReports(selectedCDC, formattedDate)

        const totals = reportTotals(report);
        const newTotals: TotalModel ={
            totalPOS: totals.totalPOS,
            totalPhysical: totals.totalPhysical,
            difference: totals.difference,
        }

        setRowTotals(totals);
        setTotals(newTotals);
        setDataReport(report);

        setLoading(false);
    }

    return (
        <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
                
            <Grid
                templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
                gap={4}
                mb={4}
                w="100%"
                alignItems="end"
            >
                <SelectRoot
                    collection={countries}
                    onValueChange={(event) => {
                        const selectedCountries = event.items.map((item: selectOption) => ({
                            value: item.value,
                            label: item.label,
                        }));

                        fetchAndSetData(() => getSubsidiariesByCountry(selectedCountries[0].label), setSubsidiaries);
                    }}
                >
                    <SelectLabel fontFamily="heading">
                    Selecciona País
                    </SelectLabel>
                    <SelectTrigger>
                    <SelectValueText placeholder="Selecciona Subsidiaria" />
                    </SelectTrigger>
                    <SelectContent>
                    {countries.items.length > 0 && countries.items.map((item: selectOption) => (
                        <SelectItem item={item} key={item.value}>
                        {item.label}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </SelectRoot>
                
                <SelectRoot
                    multiple={true}
                    collection={subsidiaries}
                    onValueChange={(event) => {
                        const selectedSubsidiaries = event.items.map((item: selectOption) => ({
                            value: item.value,
                            label: item.label,
                        }));
                        const subIds = selectedSubsidiaries.map((sub) => sub.value); 
                        
                        fetchAndSetData(() => getLocations(subIds), setCDC);
                    }}
                >
                    <SelectLabel fontFamily="heading">
                    Selecciona Empresa
                    </SelectLabel>
                    <SelectTrigger>
                    <SelectValueText placeholder="Selecciona Subsidiaria" />
                    </SelectTrigger>
                    <SelectContent>
                    {subsidiaries.items.length > 0 && subsidiaries.items.map((item: selectOption) => (
                        <SelectItem item={item} key={item.value}>
                        {item.label}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </SelectRoot>
                
                <SelectRoot
                    multiple={true}
                    collection={cdc}
                    onValueChange={(event) => {
                        const selectedcdc = event.items.map((item: selectOption) => ({
                            value: item.value,
                            label: item.label,
                        }));
                        const cdcIds = selectedcdc.map((cdc) => cdc.value);

                        setSelectedCDC(cdcIds);                      
                        
                    }}
                >
                    <SelectLabel fontFamily="heading">
                    Selecciona Centro de consumo
                    </SelectLabel>
                    <SelectTrigger>
                    <SelectValueText placeholder="Selecciona Subsidiaria" />
                    </SelectTrigger>
                    <SelectContent>
                    {cdc.items.length > 0 && cdc.items.map((item: selectOption) => (
                        <SelectItem item={item} key={item.value}>
                        {item.label}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </SelectRoot>

                <SelectRoot
                    multiple={true}
                    collection={status}
                    onValueChange={(event) => {
                        const selectedStatus = event.items.map((item: selectOption) => ({
                            value: item.value,
                            label: item.label,
                        }));
                        setSelectedStatus(selectedStatus);
                    }}
                >
                    <SelectLabel fontFamily="heading">
                    Selecciona Estatus
                    </SelectLabel>
                    <SelectTrigger>
                    <SelectValueText placeholder="Selecciona Subsidiaria" />
                    </SelectTrigger>
                    <SelectContent>
                    {status.items.length > 0 && status.items.map((item: selectOption) => (
                        <SelectItem item={item} key={item.value}>
                        {item.label}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </SelectRoot>

                <Field.Root>
                    <SimpleDatePicker onDateChange={setFormattedDate} initialDate={initialDate}></SimpleDatePicker>
                </Field.Root>

                <GridItem colSpan={2} />

                {formattedDate != '' && (<Button
                alignSelf={"flex-end"}
                    colorPalette="meraInfo"
                    onClick={async () => {
                        getDataReport()
                    }}
                >
                    Buscar
                </Button>
                )}
            </Grid>

            {loading && (
                <Box position="fixed" top="50%" left="50%">
                    <Loading />
                </Box>
            )
            }

            { showTable && (
                
                <>
                
                    <GeneralInfo isReport={true} totals={totals}></GeneralInfo>
        
                    <TableGeneralReport DataReport={dataReport} Totals={rowtotals}></TableGeneralReport>
           
                </>

            )}

        </Box>
    );
}

export default Home_v2;