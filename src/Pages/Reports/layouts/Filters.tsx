import { Box, Stack, Text, Button, createListCollection, Field, Grid } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText,
} from "@components/ui/select";
import { AppliedFilters, FilterConfigModel, FilterPropsModel, ReporGeneralRequesttModel,
} from "@models/reports.model";
import { FILTER_LABELS, FilterKey, REPORT_CONFIG } from "@models/reportsConstansts.model";
import { useEffect, useState } from "react";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import DatePicker from "../../LotClosure/components/DatePicker";
import { generateReportCSV_V2 } from "@services/reportService";
import { useReportsContext } from "@context/reports/reportsContext";
registerLocale("es", es);

function Filters({ currentReport }: FilterPropsModel) {
  const [filterConfig, setFilterConfig] = useState<FilterConfigModel | null>({} as FilterConfigModel);
  // const [startDate, setStartDate] = useState<Date | null>(null);
  // const [endDate, setEndDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});

  const { getReportData, reportData } = useReportsContext();

  useEffect(() => {
    setSelectedValues({});
    const filters = REPORT_CONFIG.find((item) => item.report === currentReport);
    setFilterConfig(filters || null);

  }, [currentReport]);

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

  const collection = createListCollection({items: []});

  const handleSelectChange = (filterKey: string, value: string) => {
    setSelectedValues((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
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
      allFilters[key as FilterKey] = null;
    });

    if (startDate && endDate) {
      allFilters.date = `${startDate.toISOString()} - ${endDate.toISOString()}`;
    }

    Object.entries(selectedValues).forEach(([key, value]) => {
      if (value) {
        allFilters[key as FilterKey] = value;
      }
    });

    const request: ReporGeneralRequesttModel = {
        report: currentReport,
        //TODO: Se rompe el tipado
        //filterOpction: allFilters
    }
    await getReportData(request)
  };

  return (
    <Box p={4} mb={4}>
      <Text fontWeight="bold" mb={4}>
        {filterConfig.name}
      </Text>

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
            ) : (
              <SelectRoot
                collection={collection}
                onValueChange={(ev) => {
                  handleSelectChange(filterKey, ev.value[0]);
                }}
              >
                <SelectLabel fontFamily="heading">
                  {FILTER_LABELS[filterKey]}
                </SelectLabel>
                <SelectTrigger>
                  <SelectValueText
                    placeholder={`Selecciona ${FILTER_LABELS[filterKey]}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem item={"x"}>Item</SelectItem>
                </SelectContent>
              </SelectRoot>
            )}
          </Box>
        ))}
      </Grid>

      <Button mt={4} colorScheme="green" width="full" onClick={applyFilters}>
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
