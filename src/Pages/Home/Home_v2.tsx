import { useEffect, useState } from "react";
import { Box, Button, createListCollection, Field, Grid, GridItem, ListCollection } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "@components/ui/select";
import { ParametersSelectedModel, selectOption } from "@models/common.model";
import { getCountries, getLocations, getStatus, getSubsidiariesByCountry } from "@services/catalogService";
import GeneralInfo from "./components/table/GeneralInfo";
import { getGeneralReports } from "@services/reportService";
import { ReportClousingLinesModel, ReportTotalsModel, TotalModel } from "@models/common.clousing.model";
import TableGeneralReport from "./components/table/TableGeneralReport";
import SimpleDatePicker from "../LotClosure/components/SimpleDatePicker";
import Loading from "@components/Loading";
import { reportTotals } from "@services/homeService";
import { handleMultiSelectChange, fetchAndSetData, renderMultiSelectWithControls } from "../../utils/selectManagement";
import { parameters } from "../../indexedDB/parametersDB";

function Home_v2() {
   
    const [countries, setCountries] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));
    const [subsidiaries, setSubsidiaries] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));
    const [cdc, setCDC] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));
    const [status, setStatus] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));

    const [selectedCountry, setSelectedCountry] = useState<selectOption>({} as selectOption);
    const [selectedSubIds, setSelectedSubIds] = useState<number[]>([]);
    const [selectedSubsidiaries, setSelectedSubsidiaries] = useState<selectOption[]>([]);
    const [selectedCDC, setSelectedCDC] = useState<number[]>([]);
    const [selectedCDCOptions, setSelectedOptions] = useState<selectOption[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<selectOption[]>([]);
    const [rowtotals, setRowTotals] = useState<ReportTotalsModel>({} as ReportTotalsModel);
    const [totals, setTotals] = useState<TotalModel>({} as TotalModel);
    
    const [formattedDate, setFormattedDate] = useState<string>('');
    const [initialDate, setInitialDate] = useState<Date>(new Date());

    const [showTable, setShowTable] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [dataReport, setDataReport] = useState<ReportClousingLinesModel[]>([] as ReportClousingLinesModel[]);

    useEffect(() => {
        async function fetchData() {
            
            try {
                
                await Promise.all([
                    fetchAndSetData(getCountries, setCountries),
                    fetchAndSetData(getStatus, setStatus),
                ]).then(async () => {
                    const parametersPromise = await parameters.parametersSelected.get({ key: 'parameters' });
                    console.log("Initial data fetched", parametersPromise);
                    if(parametersPromise !== undefined) {
                        console.log("Fetched parameters from IndexedDB:", parametersPromise);
                        const savedParams = parametersPromise.value;
                        setSelectedSubsidiaries(savedParams.subsidiaries);
                        setSelectedSubIds(savedParams.subsidiaries.map(sub => sub.value));
                        setSelectedOptions(savedParams.cdc);
                        setSelectedCDC(savedParams.cdc.map(cdc => cdc.value));
                        setSelectedStatus(savedParams.status);
                        setFormattedDate(savedParams.date ?? '');
                        setInitialDate(savedParams.date ? new Date(savedParams.date) : new Date());
                        setSelectedCountry(savedParams.country);

                        fetchAndSetData(() => getSubsidiariesByCountry(savedParams.country != undefined ? savedParams.country.label : ""), setSubsidiaries);
                        getDataReport()
                    }
                });

                
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, 
    []);

    async function getDataReport() {
        setLoading(true);
        const estatusNames = selectedStatus.map((status) => status.label);
        const parametersPromise = await parameters.parametersSelected.get({ key: 'parameters' });
        const paramsToSave: ParametersSelectedModel = {
            country: parametersPromise !== undefined ? parametersPromise.value.country : selectedCountry,
            subsidiaries: parametersPromise !== undefined ? parametersPromise.value.subsidiaries : selectedSubsidiaries,
            zone: parametersPromise !== undefined ? parametersPromise.value.zone : selectedCDCOptions,
            cdc: parametersPromise !== undefined ? parametersPromise.value.cdc : selectedCDCOptions,
            status: parametersPromise !== undefined ? parametersPromise.value.status : selectedStatus,
            date: parametersPromise !== undefined ? parametersPromise.value.date : formattedDate
        };
        console.log("Parameters to save:", paramsToSave);
        await parameters.parametersSelected.put({key: 'parameters', value: paramsToSave});
        const report = await getGeneralReports(selectedCDC, formattedDate, estatusNames)
        
        const totals = reportTotals(report);
        const newTotals: TotalModel ={
            totalPOS: totals.totalPOS,
            totalPhysical: totals.totalPhysical,
            difference: totals.difference,
        }
        
        setRowTotals(totals);
        setTotals(newTotals);
        setDataReport(report);
        
        setShowTable(true);
        setLoading(false);
    }

    useEffect(() => {
        async function updateCDC() {
            if (selectedSubIds.length > 0) {
                const parametersPromise = await parameters.parametersSelected.get({ key: 'parameters' });
                if(parametersPromise === undefined) {
                    setSelectedCDC([]);
                    setSelectedOptions([]);
                }
                setCDC(createListCollection<selectOption>({ items: [] }));
                await fetchAndSetData(() => getLocations(selectedSubIds), setCDC);
            } else {
              setCDC(createListCollection<selectOption>({ items: [] }));
            }
        }
        updateCDC();
    }, [selectedSubIds]);

    const handleSubsidiariesChange = (event: { items: selectOption[] }) => {      
        handleMultiSelectChange({
            newItems: event.items,
            currentSelected: selectedSubsidiaries,
            setSelectedOptions: setSelectedSubsidiaries,
            setSelectedIds: setSelectedSubIds
        })
    };

    const handleCDCChange = (event: { items: selectOption[] }) => {
        handleMultiSelectChange({
            newItems: event.items,
            currentSelected: selectedCDCOptions,
            setSelectedOptions: setSelectedOptions,
            setSelectedIds: setSelectedCDC
        })
    };

    const handleStatusChange = (event: { items: selectOption[] }) => {
        handleMultiSelectChange({
            newItems: event.items,
            currentSelected: selectedStatus,
            setSelectedOptions: setSelectedStatus
        });
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
                    value={selectedCountry?.value ? [selectedCountry.value] : []}
                    onValueChange={(event) => {
                        const selectedCountries = event.items.map((item: selectOption) => ({
                            value: item.value,
                            label: item.label,
                        }));

                        setSelectedCountry(selectedCountries[0]);
                        fetchAndSetData(() => getSubsidiariesByCountry(selectedCountries[0].label), setSubsidiaries);
                    }}
                >
                    <SelectLabel fontFamily="heading">
                    País
                    </SelectLabel>
                    <SelectTrigger>
                    <SelectValueText placeholder="Selecciona un país" />
                    </SelectTrigger>
                    <SelectContent>
                    {countries.items.length > 0 && countries.items.map((item: selectOption) => (
                        <SelectItem item={item} key={item.value}>
                        {item.label}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </SelectRoot>
            
                {renderMultiSelectWithControls(
                    subsidiaries,
                    handleSubsidiariesChange,
                    "Subsidiaria",
                    "Selecciona una Subsidiaria",
                    selectedSubsidiaries,
                    true
                  )
                }
                
                {renderMultiSelectWithControls(
                    cdc,
                    handleCDCChange,
                    "Centro de consumo",
                    "Selecciona un centro de consumo",
                    selectedCDCOptions,
                    selectedSubsidiaries.length > 0 ? false : true
                  )
                }

                {renderMultiSelectWithControls(
                    status,
                    handleStatusChange,
                    "Estatus",
                    "Selecciona un estatus",
                    selectedStatus,
                    true
                  )
                }

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
                <Box position="fixed" top="50%" left="50%" zIndex={1000}>
                    <Loading />
                </Box>
            )
            }

            { showTable && (
                
                <>
                
                    <GeneralInfo isReport={true} totals={totals}></GeneralInfo>
        
                    <TableGeneralReport DataReport={dataReport} Totals={rowtotals} date={formattedDate}></TableGeneralReport>
           
                </>

            )}

        </Box>
    );
}

export default Home_v2;