import { Box, Stack, Text, Button, createListCollection, Field, Grid } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText,
} from "@components/ui/select";
import { AppliedFilters, FilterConfigModel, FilterData, FilterPropsModel, ReportFilterModel,
ReporGeneralRequesttModel } from "@models/reports.model";
import { FILTER_LABELS, FilterKey, REPORT_CONFIG } from "@models/reportsConstansts.model";
import { useEffect, useState } from "react";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import DatePicker from "../../LotClosure/components/DatePicker";
import { getFilterOptions } from "@services/catalogService";

import { generateReportCSV_V2 } from "@services/reportService";
import { useReportsContext } from "@context/reports/reportsContext";
registerLocale("es", es);

function Filters({ currentReport, reportName }: FilterPropsModel) {
  const [filterConfig, setFilterConfig] = useState<FilterConfigModel | null>({} as FilterConfigModel);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, endDate] = dateRange;
  const [selectedValues, setSelectedValues] = useState<ReportFilterModel>({} as ReportFilterModel);
  const [filterData, setFilterData] = useState<FilterData>({});
  const [loadingFilters, setLoadingFilters] = useState<Record<string, boolean>>({});

  const { getReportData, reportData } = useReportsContext();

  const reset: ReportFilterModel = {
    approver: null,
    categories: null,
    cdc: [],
    currency: null,
    date: null,
    employees: null,
    family: null,
    items: null,
    paymentMethod: null,
    subcategories: null,
    subsidiary: null,
    exchangeRate: null
  }

  useEffect(() => {

    const loadInitialData = async() =>{
      setSelectedValues(reset);
      reportName("");
      const filters = REPORT_CONFIG.find((item) => item.report === currentReport);
      setFilterConfig(filters || null);
      reportName(filters?.name || "");
  
      if (filters) {
          const activeFilters = (Object.keys(filters) as FilterKey[])
            .filter(key => filters[key] === true && key !== "date");
  
          await Promise.all(activeFilters.map((filterKey) => {
            if (filterKey !== "cdc") {
              loadFilterData(filterKey);
            }
          }));
      }
    }

    loadInitialData();
    // console.log("selectedValues", selectedValues);
    
  }, [currentReport]);

  const loadFilterData = async (filterKey: FilterKey, parentValue?: number) => {
    setLoadingFilters(prev => ({ ...prev, [filterKey]: true }));
    
    try {
      const data = await getFilterOptions(filterKey, parentValue);      
      if (data) {
        setFilterData(prev => ({
          ...prev,
          [filterKey]: data
        }));
      }
      
    } catch (error) {
      console.error(`Error loading ${filterKey} options:`, error);
      setFilterData(prev => ({
        ...prev,
        [filterKey]: []
      }));
    } finally {
      setLoadingFilters(prev => ({ ...prev, [filterKey]: false }));
    }
  };

  useEffect(() => {      
    if (selectedValues.subsidiary && filterConfig?.cdc) {      
      loadFilterData("cdc", Number(selectedValues.subsidiary));
      setSelectedValues(prev => ({ ...prev, cdc: [] })); // Resetear CDCs al cambiar subsidiary
    }
  }, [selectedValues.subsidiary]);

  if (!currentReport) {
    return (
      <Box p={4} textAlign="center">
        <Text>Seleccione un reporte para ver los filtros disponibles</Text>
      </Box>
    );
  }

  if (!filterConfig) {
    return (
      <Box p={4} textAlign="center">
        <Text>No se encontró configuración de filtros para este reporte</Text>
      </Box>
    );
  }

  const handleSelectChange = (filterKey: FilterKey, value: any) => {
    
    
   const newValues = {
    ...selectedValues,
    [filterKey]: value,
   };
    if (filterKey === "subsidiary") {
      newValues.cdc = reset.cdc;
    }    

    setSelectedValues(newValues);
  };

  const activeFilters = (
    Object.keys(filterConfig) as (keyof FilterConfigModel)[]
  ).filter((key) => filterConfig[key] === true) as FilterKey[];

  if (activeFilters.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text>Este reporte no tiene filtros configurados</Text>
      </Box>
    );
  }

  /* const handleDateChange = (range: [Date | null, Date | null]) => {
    console.log("Rango", range);
    
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);
  }; */

  const applyFilters = async () => {

    if (!filterConfig) return;
    
    const allFilters: AppliedFilters = {};
    
    Object.keys(FILTER_LABELS).forEach((key) => {
    const filterKey = key as FilterKey;
    
    if (filterKey === "date") {
      allFilters.date = startDate && endDate 
        ? `${startDate.toISOString()} - ${endDate.toISOString()}`
        : null;
      return;
    }
    
    allFilters[filterKey] = selectedValues[filterKey] || null;
  })
    const request: ReporGeneralRequesttModel = {
          report: currentReport,
          //TODO: Se rompe el tipado
          //filterOpction: allFilters
      }
    await getReportData(request)
    console.log("Filtros aplicados:", allFilters);
  };

  return (
    <Box p={4} mb={4}>
      {/* <Text fontWeight="bold" mb={4}>
        {filterConfig.name}
      </Text> */}

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
        gap={4}
        mb={4}
      >
        {activeFilters.map((filterKey) => (
          <Box key={filterKey} minWidth="200px">
            {filterKey === "date" ? (
              <Stack gap={3}>
                <Field.Root w="100%">
                  <Field.Label>{FILTER_LABELS[filterKey]}</Field.Label>
                  <DatePicker
                    onChange={setDateRange}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </Field.Root>
              </Stack>
            ) : filterKey === "cdc" ? (
              <SelectRoot
                multiple={true}
                collection={createListCollection({ items: filterData.cdc || [] })}
                onValueChange={(ev) => handleSelectChange(filterKey, ev.value)}
                disabled={!selectedValues.subsidiary || loadingFilters.cdc}
                value={selectedValues[filterKey].map(String) || [null]}
              >
                <SelectLabel fontFamily="heading">
                  {FILTER_LABELS[filterKey]}
                  {loadingFilters.cdc && " (Cargando...)"}
                </SelectLabel>
                <SelectTrigger>
                  <SelectValueText
                    placeholder={
                      loadingFilters.cdc
                        ? "Cargando opciones..."
                        : selectedValues[filterKey]?.length > 0
                          ? `${selectedValues.cdc.length} seleccionados`
                          : selectedValues.subsidiary
                            ? `Selecciona ${FILTER_LABELS[filterKey]}`
                            : "Primero selecciona una subsidiaria"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {(filterData.cdc || []).map((option) => (
                    <SelectItem
                      key={option.value}
                      item={option}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            ) : (
              <SelectRoot
                collection={createListCollection({ items: filterData[filterKey] || [] })}
                onValueChange={(ev) => {
                  handleSelectChange(filterKey, Number(ev.value[0]));
                }}
                value={
                  selectedValues[filterKey] === undefined || selectedValues[filterKey] === null 
                    ? [] 
                    : [selectedValues[filterKey].toString()]
                  }
                disabled={loadingFilters[filterKey]}
              >
                <SelectLabel fontFamily="heading">
                  {FILTER_LABELS[filterKey]}
                </SelectLabel>
                <SelectTrigger>
                  <SelectValueText
                    placeholder={
                      loadingFilters[filterKey]
                        ? "Cargando opciones..."
                        : `Selecciona ${FILTER_LABELS[filterKey]}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {(filterData[filterKey] || []).map((option) => (
                    <SelectItem key={option.value} item={option}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            )}
          </Box>
        ))}
      </Grid>

      <Button mt={4} colorScheme="green.400" width="full" onClick={applyFilters}>
        Aplicar Filtros
      </Button>

      {/* Revisar la validacion de disable, se requeire una variable del componente */}
      <Button colorPalette="meraPrimary" disabled={reportData.length === 0} onClick={()=>{
        generateReportCSV_V2(currentReport, reportData)
      }}>
        Exportar CSV
      </Button>
    </Box>

  );
}

export default Filters;
