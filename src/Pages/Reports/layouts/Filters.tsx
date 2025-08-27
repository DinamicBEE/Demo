import {
  Box,
  Stack,
  Button,
  createListCollection,
  Field,
  Grid,
  ListCollection,
  HStack
} from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText
} from "@components/ui/select";
import {
  AppliedFilters,
  FilterConfigModel,
  FilterData,
  FilterPropsModel,
  ReportFilterModel,
  ReporGeneralRequesttModel
} from "@models/reports.model";
import { FILTER_LABELS, FilterKey, REPORT_CONFIG
} from "@models/reportsConstansts.model";
import { useEffect, useMemo, useCallback, useState } from "react";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import DatePicker from "../../LotClosure/components/DatePicker";
import { getFilterOptions, getLocations } from "@services/catalogService";
import { generateReportCSV_V2 } from "@services/reportService";
import { useReportsContext } from "@context/reports/reportsContext";
import { selectOption } from "@models/common.model";
import { fetchAndSetData } from "../../../utils/selectManagement";
import SimpleDatePicker from "../../LotClosure/components/SimpleDatePicker";

registerLocale("es", es);

function Filters({ currentReport, reportName }: FilterPropsModel) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedValues, setSelectedValues] = useState<ReportFilterModel>({} as ReportFilterModel);
  const [filterData, setFilterData] = useState<FilterData>({});
  const [loadingFilters, setLoadingFilters] = useState<Record<string, boolean>>({});
  const [selectedSubIds, setSelectedSubIds] = useState<number[]>([]);
  const [selectedCDC, setSelectedCDC] = useState<number[]>([]);
  const [cdc, setCDC] = useState<ListCollection<selectOption>>(createListCollection<selectOption>({ items: [] }));
  const [formattedDate, setFormattedDate] = useState<string>("");

  const initialDate = new Date();
  const { getReportData, reportData } = useReportsContext();

  const resetValues = useMemo<ReportFilterModel>(() => ({
    approver: null,
    categories: null,
    cdc: [],
    multicdc: [],
    currency: null,
    date: null,
    dateRange: null,
    employees: null,
    family: null,
    items: null,
    paymentMethod: null,
    subcategories: null,
    subsidiary: [],
    exchangeRate: null
  }), []);

  const subsidiaries = useMemo(() =>
    createListCollection<selectOption>({
      items: (filterData.subsidiary || []).map((item) => ({
        ...item,
        value: Number(item.value)
      }))
    })
  , [filterData.subsidiary]);

  const EMPTY_CONFIG: FilterConfigModel = {
    report: 0,
    name: "",
    date: false,
    dateRange: false,
    subsidiary: false,
    cdc: false,
    multicdc: false,
    employees: false,
    approver: false,
    categories: false,
    subcategories: false,
    family: false,
    items: false,
    paymentMethod: false,
    currency: false,
    exchangeRate: false
  };

  const filterConfig = useMemo(
    () => currentReport ? REPORT_CONFIG.find(item => item.report === currentReport) || EMPTY_CONFIG : EMPTY_CONFIG,
    [currentReport]
  );

  const activeFilters = useMemo(() =>
    (Object.keys(filterConfig) as (keyof FilterConfigModel)[])
      .filter((key) => key !== "report" && key !== "name" && filterConfig[key] === true) as FilterKey[],
    [filterConfig]
  );

  // Cargar datos iniciales
  useEffect(() => {
    if (!currentReport) return;
    setSelectedValues(resetValues);
    reportName(filterConfig.name || "");

    const loadData = async () => {
      const active = (Object.keys(filterConfig) as FilterKey[])
        .filter((key) => filterConfig[key] && key !== "date");
      await Promise.all(active.map((key) => key !== "cdc" ? loadFilterData(key) : Promise.resolve()));
    };

    loadData();
  }, [currentReport, filterConfig, resetValues, reportName]);

  // Cargar CDC cuando cambian las subsidiarias
  useEffect(() => {
    if (selectedSubIds.length > 0) {
      fetchAndSetData(() => getLocations(selectedSubIds), setCDC);
    } else {
      setCDC(createListCollection<selectOption>({ items: [] }));
    }
  }, [selectedSubIds]);

  // Manejo de selects
  const handleSubsidiariesChange = useCallback((ev: { value: string[] }) => {
    
    const ids = ev.value.map(Number);
    console.log("entramos", ids);
    setSelectedSubIds(ev.value.map(Number));
    // setSelectedValues(prev => ({ ...prev, subsidiary: ids }));
  }, []);

  const handleCDCChange = useCallback((ev: { value: string[] }) => {
    const ids = ev.value.map(Number);
    setSelectedCDC(ids);
    // setSelectedValues(prev => ({ ...prev, cdc: ids }));
  }, []);

  // Cargar opciones de filtros
  const loadFilterData = useCallback(async (filterKey: FilterKey, parentValue?: number) => {
    setLoadingFilters(prev => ({ ...prev, [filterKey]: true }));
    try {
      if (currentReport === 100) return;
      const data = await getFilterOptions(filterKey, parentValue);
      setFilterData(prev => ({ ...prev, [filterKey]: data || [] }));
    } catch {
      setFilterData(prev => ({ ...prev, [filterKey]: [] }));
    } finally {
      setLoadingFilters(prev => ({ ...prev, [filterKey]: false }));
    }
  }, [currentReport]);

  // Aplicar filtros
  const applyFilters = useCallback(async () => {
    if (!filterConfig) return;
    const allFilters: AppliedFilters = {};

    Object.keys(FILTER_LABELS).forEach((key) => {
      const filterKey = key as FilterKey;
      if (filterKey === "cdc") {
        allFilters.cdc = selectedCDC[0];
      }  else if (filterKey === "multicdc") {
        allFilters.multicdc = selectedCDC;
      } else if (filterKey === "dateRange") {
        allFilters.dateRange = startDate && endDate
          ? `${startDate.toISOString().split("T")[0]},${endDate.toISOString().split("T")[0]}`
          : null;
      } else if (filterKey === "date") {
        allFilters.date = formattedDate
          ? `${new Date(formattedDate).toISOString().split("T")[0]}`
          : null;
      } else {
        allFilters[filterKey] = selectedValues[filterKey] || null;
      }
    });

    console.log("filtros", allFilters);
    

    await getReportData({
      report: currentReport ?? 0,
      filterOpction: allFilters
    });
  }, [filterConfig, selectedCDC, startDate, endDate, selectedValues, currentReport, getReportData]);

  // Exportar CSV
  const exportCSV = useCallback(() => {
    if (typeof currentReport === "number") {
      generateReportCSV_V2(currentReport, reportData);
    }
  }, [currentReport, reportData]);

  // Render dinámico de filtros
  const renderFilter = (filterKey: FilterKey) => {
    if (filterKey === "dateRange") {
      return (
        <Field.Root w="100%" zIndex={100}>
          <Field.Label>{FILTER_LABELS[filterKey]}</Field.Label>
          <DatePicker onChange={setDateRange} startDate={startDate} endDate={endDate} />
        </Field.Root>
      );
    }

    if (filterKey === "date") {
      return (
        <Field.Root w="100%" zIndex={100}>
          <Field.Label>{FILTER_LABELS[filterKey]}</Field.Label>
          <SimpleDatePicker onDateChange={setFormattedDate} initialDate={initialDate} />
        </Field.Root>
      );
    }

    if (filterKey === "subsidiary") {
      return (
        <SelectRoot
          multiple
          collection={subsidiaries}
          onValueChange={handleSubsidiariesChange}
          value={selectedSubIds}
        >
          <SelectLabel>{FILTER_LABELS[filterKey]}</SelectLabel>
          <SelectTrigger>
            <SelectValueText placeholder="Selecciona una o más" />
          </SelectTrigger>
          <SelectContent>
            {(filterData.subsidiary || []).map((option) => (
              <SelectItem key={option.value} item={option}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      );
    }

    if (filterKey === "cdc" || filterKey === "multicdc") {
      return (
        <SelectRoot
          multiple={filterKey === "multicdc"}
          collection={cdc}
          onValueChange={handleCDCChange}
          value={selectedCDC}
          disabled={selectedSubIds.length === 0}
        >
          <SelectLabel>{FILTER_LABELS[filterKey]}</SelectLabel>
          <SelectTrigger>
            <SelectValueText placeholder={cdc.items.length === 0 ? "Sin datos" : "Selecciona"} />
          </SelectTrigger>
          <SelectContent>
            {cdc.items.map((option) => (
              <SelectItem key={option.value} item={option}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      );
    }

    return (
      <SelectRoot
        collection={createListCollection({ items: filterData[filterKey] || [] })}
        onValueChange={(ev) => setSelectedValues(prev => ({ ...prev, [filterKey]: Number(ev.value[0]) }))}
        value={selectedValues[filterKey] == null ? [] : [selectedValues[filterKey].toString()]}
        disabled={loadingFilters[filterKey]}
      >
        <SelectLabel>{FILTER_LABELS[filterKey]}</SelectLabel>
        <SelectTrigger>
          <SelectValueText placeholder={`Selecciona ${FILTER_LABELS[filterKey]}`} />
        </SelectTrigger>
        <SelectContent>
          {(filterData[filterKey] || []).map((option) => (
            <SelectItem key={option.value} item={option}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    );
  };

  return (
    <Box p={4} mb={4}>
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 2fr)" }} gap={4} mb={4}>
        {activeFilters.length > 0
          ? activeFilters.map((filterKey) => (
            <Box key={filterKey} minWidth="200px">
              {renderFilter(filterKey)}
            </Box>
          ))
          : <Box minWidth="200px">No hay filtros disponibles</Box>}
      </Grid>

      <HStack gap={4} mt={4}>
        <Button colorPalette="blue" width={"50%"} onClick={applyFilters}>
          {currentReport === 100 ? "Cargar" : "Aplicar filtros"}
        </Button>
        <Button colorPalette="green" width={"50%"} disabled={reportData.length === 0} onClick={exportCSV}>
          Exportar CSV
        </Button>
      </HStack>
    </Box>
  );
}

export default Filters;
