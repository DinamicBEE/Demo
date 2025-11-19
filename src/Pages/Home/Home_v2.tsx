import { useEffect, useState } from "react";
import { Box, Button, createListCollection, Field, Grid, GridItem, ListCollection } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "@components/ui/select";
import { ParametersSelectedModel, selectOption } from "@models/common.model";
import { getCountries, getLocations, getStatus, getSubsidiariesByCountry, getZones } from "@services/catalogService";
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
    // Países
    const [countries, setCountries] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));
    const [selectedCountry, setSelectedCountry] = useState<selectOption>({} as selectOption);
    // Subsidiarias
    const [subsidiaries, setSubsidiaries] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));
    const [selectedSubIds, setSelectedSubIds] = useState<number[]>([]);
    const [selectedSubsidiaries, setSelectedSubsidiaries] = useState<selectOption[]>([]);
    // CDC
    const [cdc, setCDC] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));
    const [selectedCDCIds, setSelectedCDCIds] = useState<number[]>([]);
    const [selectedCDCOptions, setSelectedCDCOptions] = useState<selectOption[]>([]);
    // Estatus
    const [status, setStatus] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));
    const [selectedStatus, setSelectedStatus] = useState<selectOption[]>([]);
    // Zonas
    const [zones, setZones] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));
    const [selectedZonesIds, setSelectedZonesIds] = useState<number[]>([]);
    const [selectedZonesOptions, setSelectedZonesOptions] = useState<selectOption[]>([]);
    // General
    const [rowtotals, setRowTotals] = useState<ReportTotalsModel>({} as ReportTotalsModel);
    const [totals, setTotals] = useState<TotalModel>({} as TotalModel);
    const [formattedDate, setFormattedDate] = useState<string>('');
    const [initialDate, setInitialDate] = useState<Date | undefined>(undefined);
    const [showTable, setShowTable] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [dataReport, setDataReport] = useState<ReportClousingLinesModel[]>([] as ReportClousingLinesModel[]);
    const [isReady, setIsReady] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);


    const parseDateStringToLocalDate = (dateString: string): Date => {
      const [year, month, day] = dateString.split("-").map(Number);
      return new Date(year, month - 1, day);
    };

    useEffect(() => {
        async function fetchData() {
            
            try {
                
                await Promise.all([
                    fetchAndSetData(getCountries, setCountries),
                    fetchAndSetData(getStatus, setStatus),
                ]).then(async () => {
                    const parametersPromise = await parameters.parametersSelected.get('parametersSelected');
                    if(parametersPromise !== undefined) {
                        setIsInitialLoad(false);
                        const savedParams = parametersPromise.value;
                        setSelectedSubsidiaries(savedParams.subsidiaries ?? []);
                        setSelectedSubIds(savedParams.subsidiaries.map((sub: any) => sub.value) ?? []);
                        setSelectedZonesOptions(savedParams.zone ?? []);
                        setSelectedZonesIds(savedParams.zone.map((zone: any) => zone.value) ?? []);
                        setSelectedCDCOptions(savedParams.cdc ?? []);
                        setSelectedCDCIds(savedParams.cdc.map((cdc: any) => cdc.value) ?? []);
                        setSelectedStatus(savedParams.status ?? []);
                        setFormattedDate(savedParams.date ? savedParams.date : '');
                        setInitialDate(savedParams.date ? parseDateStringToLocalDate(savedParams.date) : undefined);
                        setSelectedCountry(savedParams.country ?? {} as selectOption);
                        await fetchAndSetData(() => getSubsidiariesByCountry(savedParams.country != undefined ? savedParams.country.label : ""), setSubsidiaries);
                    }
                    setIsInitialLoad(true);
                });

                setIsReady(true);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchData();
    }, 
    []);

    async function getDataReport() {
      setLoading(true);
      let cdcIds: number[] = [];
      let cdcOptions: selectOption[] = [];

      const parametersPromise = await parameters.parametersSelected.get('parametersSelected');
      const savedParams = parametersPromise?.value;

      if (selectedCDCIds.length > 0) {
        cdcIds = selectedCDCIds;
        cdcOptions = selectedCDCOptions;
      } 
      else if (cdc.items.length > 0 && selectedCDCIds.length === 0) {
        cdcIds = cdc.items.map((item) => item.value);
        cdcOptions = cdc.items;
        setSelectedCDCIds(cdcIds);
        setSelectedCDCOptions(cdcOptions);
      }
      else if (Array.isArray(savedParams?.cdc) && savedParams.cdc.length > 0) {
        cdcIds = savedParams.cdc.map((cdc: any) => cdc.value);
        cdcOptions = savedParams.cdc;
        setSelectedCDCIds(cdcIds);
        setSelectedCDCOptions(cdcOptions);
      } 
      if (cdcIds.length === 0) {
        console.warn("No hay CDC válidos para generar el reporte");
        setLoading(false);
        return;
      }

      

      const estatusNames = selectedStatus.map((status) => status.label);

      const paramsToSave: ParametersSelectedModel = {
        country: selectedCountry,
        subsidiaries: selectedSubsidiaries,
        zone: selectedZonesOptions,
        cdc: cdcOptions,
        status: selectedStatus,
        date: formattedDate,
      };

      await parameters.parametersSelected.put({
        key: "parametersSelected",
        value: paramsToSave,
      });

      const report = await getGeneralReports(cdcIds, formattedDate, estatusNames);

      const totals = reportTotals(report);
      const newTotals: TotalModel = {
        totalPOS: totals.totalPOS,
        totalPhysical: totals.totalPhysical,
        difference: totals.difference,
      };

      setRowTotals(totals);
      setTotals(newTotals);
      setDataReport(report);

      setShowTable(true);
      setLoading(false);
    }

    useEffect(() => {
      if (
        isReady &&
        formattedDate &&
        selectedCountry &&
        selectedSubsidiaries.length > 0
      ) {
        getDataReport();
      }
    }, [isReady]);

    useEffect(() => {
      if (selectedCountry.label === "") {
        setSelectedSubsidiaries([]);
        setSelectedSubIds([]);
        setSelectedZonesIds([]);
        setSelectedZonesOptions([]);
        setSelectedCDCIds([]);
        setSelectedCDCOptions([]);
        setSubsidiaries(createListCollection<selectOption>({ items: [] }));
        setZones(createListCollection<selectOption>({ items: [] }));
        setCDC(createListCollection<selectOption>({ items: [] }));
      }
    }, [selectedCountry])

    useEffect(() => {
      async function updateZone() {
          if (selectedSubIds.length > 0) {
              try {
                if (isInitialLoad) {
                  setSelectedZonesIds([]);
                  setSelectedZonesOptions([]);
                  setSelectedCDCIds([]);
                  setSelectedCDCOptions([]);
                }
                await fetchAndSetData(() => getZones(selectedSubIds), setZones);
              }
              catch (e) {
                console.error(e);
              }
              
          } else {
            setSelectedZonesIds([]);
            setSelectedZonesOptions([]);
            setSelectedCDCIds([]);
            setSelectedCDCOptions([]);
            setZones(createListCollection<selectOption>({ items: [] }));
            setCDC(createListCollection<selectOption>({ items: [] }));
          }
      }
      updateZone();
    }, [selectedSubIds]);

    useEffect(() => {
        async function updateCDC() {
            if (selectedZonesIds.length > 0) {
                try {
                  if (isInitialLoad) {
                    setSelectedCDCIds([]);
                    setSelectedCDCOptions([]);
                  }
                  await fetchAndSetData(() => getLocations(selectedZonesIds), setCDC);
                }
                catch (e) {
                  console.error(e);
                }                
            } else {
              setSelectedCDCIds([]);
              setSelectedCDCOptions([]);
              setCDC(createListCollection<selectOption>({ items: [] }));
            }
        }
        updateCDC();
    }, [selectedZonesIds]);

    const handleSubsidiariesChange = (event: { items: selectOption[] }) => {      
        handleMultiSelectChange({
            newItems: event.items,
            currentSelected: selectedSubsidiaries,
            setSelectedOptions: setSelectedSubsidiaries,
            setSelectedIds: setSelectedSubIds
        })
    };

    const handleZoneChange = (event: { items: selectOption[] }) => {
        handleMultiSelectChange({
            newItems: event.items,
            currentSelected: selectedZonesOptions,
            setSelectedOptions: setSelectedZonesOptions,
            setSelectedIds: setSelectedZonesIds
        })
    };
    const handleCDCChange = (event: { items: selectOption[] }) => {
        handleMultiSelectChange({
            newItems: event.items,
            currentSelected: selectedCDCOptions,
            setSelectedOptions: setSelectedCDCOptions,
            setSelectedIds: setSelectedCDCIds
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
                    !selectedCountry?.value
                  )
                }
                
                {renderMultiSelectWithControls(
                    zones,
                    handleZoneChange,
                    "Zona",
                    "Selecciona una Zona",
                    selectedZonesOptions,
                    selectedSubsidiaries.length === 0
                  )
                }
                {renderMultiSelectWithControls(
                    cdc,
                    handleCDCChange,
                    "Centro de consumo",
                    "Selecciona un centro de consumo",
                    selectedCDCOptions,
                    selectedZonesIds.length === 0
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
                    <Field.Label>Fecha</Field.Label>
                    <SimpleDatePicker onDateChange={setFormattedDate} initialDate={initialDate}></SimpleDatePicker>
                </Field.Root>

                <GridItem colSpan={1} />

                <Button
                    disabled={formattedDate != '' && selectedZonesIds.length === 0}
                    alignSelf={"flex-end"}
                    colorPalette="meraInfo"
                    onClick={async () => {
                        getDataReport()
                    }}
                >
                    Buscar
                </Button>
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