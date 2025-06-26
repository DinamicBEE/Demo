import { Box, Stack, Text, Button, createListCollection, Field, Grid } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText,
} from "@components/ui/select";
import { AppliedFilters, FilterConfigModel, FilterData, FilterPropsModel, ReportFilterModel,
} from "@models/reports.model";
import { FILTER_LABELS, FilterKey, REPORT_CONFIG } from "@models/reportsConstansts.model";
import { useEffect, useState } from "react";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import DatePicker from "../../LotClosure/components/DatePicker";
import { getFilterOptions } from "@services/catalogService";

registerLocale("es", es);

function Filters({ currentReport, reportName }: FilterPropsModel) {
  const [filterConfig, setFilterConfig] = useState<FilterConfigModel | null>({} as FilterConfigModel);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [loading, setLoading] = useState<boolean>(false);
  const [startDate, endDate] = dateRange;
  const [selectedValues, setSelectedValues] = useState<ReportFilterModel>({} as ReportFilterModel);
  const [filterData, setFilterData] = useState<FilterData>({});
  const [loadingFilters, setLoadingFilters] = useState<Record<string, boolean>>({});

  useEffect(() => {

    const loadInitialData = async() =>{
      setSelectedValues({} as ReportFilterModel);
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
    let prevCdc: number[] = [];
    if (filterKey === "cdc") {
      prevCdc = selectedValues.cdc
      if (prevCdc.includes(value)) {
        const index = prevCdc.findIndex((item: number) => item === value);
        if (index !== -1) {
          prevCdc.splice(index, 1);
        }
      } else {
        prevCdc.push(value);
      }
    }
    
   const newValues = filterKey !== "cdc" ? {
    ...selectedValues,
    [filterKey]: value,
   } : {
    ...selectedValues,
    [filterKey]: prevCdc,
   };
    if (filterKey === "subsidiary") {
      newValues.cdc = [];
    }

    console.log("newValues", newValues);
    

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

  const applyFilters = () => {
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
                multiple
                collection={createListCollection({ items: filterData.cdc || [] })}
                onValueChange={(ev) => handleSelectChange(filterKey, ev.value[0])}
                value={
                  typeof selectedValues[filterKey] === "string"
                    ? [selectedValues[filterKey] as string]
                    : []
                  }
                disabled={!selectedValues.subsidiary || loadingFilters.cdc}
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
                          ? `${selectedValues[filterKey].length} seleccionados`
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
                      backgroundColor={selectedValues.cdc.includes(Number(option.value)) ? '#c4c4c4': '#fff'}
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
                  typeof selectedValues[filterKey] === "string"
                    ? [selectedValues[filterKey] as string]
                    : []
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

      <Button mt={4} colorScheme="green" width="full" onClick={applyFilters}>
        Aplicar Filtros
      </Button>
    </Box>
  );
}

export default Filters;
