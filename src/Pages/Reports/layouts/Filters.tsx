import { Box, Stack, Text, Button, createListCollection, Field, Grid, ListCollection } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "@components/ui/select";
import { AppliedFilters, FilterConfigModel, FilterData, FilterPropsModel, ReportFilterModel, ReporGeneralRequesttModel } from "@models/reports.model";
import { FILTER_LABELS, FilterKey, REPORT_CONFIG, REPORT_KEY, REPORT_NAME } from "@models/reportsConstansts.model";
import { useEffect, useLayoutEffect, useMemo, useCallback, useState } from "react";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import DatePicker from "../../LotClosure/components/DatePicker";
import { getFilterOptions, getLocations } from "@services/catalogService";
import { generateReportCSV_V2 } from "@services/reportService";
import { useReportsContext } from "@context/reports/reportsContext";
import { selectOption } from "@models/common.model";
import { fetchAndSetData, handleMultiSelectChange, renderMultiSelectWithControls } from "../../../utils/selectManagement";

registerLocale("es", es);

function Filters({ currentReport, reportName }: FilterPropsModel) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedValues, setSelectedValues] = useState<ReportFilterModel>({} as ReportFilterModel);
  const [filterData, setFilterData] = useState<FilterData>({});
  const [loadingFilters, setLoadingFilters] = useState<Record<string, boolean>>({});
  const [selectedSubIds, setSelectedSubIds] = useState<number[]>([]);
  const [selectedSubsidiaries, setSelectedSubsidiaries] = useState<selectOption[]>([]);
  const [selectedCDC, setSelectedCDC] = useState<number[]>([]);
  const [selectedCDCOptions, setSelectedCDCOptions] = useState<selectOption[]>([]);
  const [cdc, setCDC] = useState<ListCollection<selectOption>>(createListCollection<selectOption>({ items: [] }));

  const { getReportData, reportData } = useReportsContext();

  const resetValues = useMemo((): ReportFilterModel => ({
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
    subsidiary: [],
    exchangeRate: null
  }), []);

  const subsidiaries = useMemo(() => 
    createListCollection<selectOption>({ 
      items: (filterData.subsidiary || []).map((item: any) => ({
        ...item,
        value: Number(item.value),
      }))
    })
  , [filterData.subsidiary]);

  const EMPTY_CONFIG: FilterConfigModel = {
    report: 0,
    name: "",
    date: false,
    subsidiary: false,
    cdc: false,
    employees: false,
    approver: false,
    categories: false,
    subcategories: false,
    family: false,
    items: false,
    paymentMethod: false,
    currency: false,
    exchangeRate: false,
  };

  const filterConfig = useMemo(() => {
    if (!currentReport) return EMPTY_CONFIG;
    return REPORT_CONFIG.find((item) => item.report === currentReport) || EMPTY_CONFIG;
  }, [currentReport]);

    const activeFilters = useMemo(() => {
    return (Object.keys(filterConfig) as (keyof FilterConfigModel)[])
      .filter((key) => key !== "report" && key !== "name" && filterConfig[key] === true) as FilterKey[];
  }, [filterConfig]);

  useEffect(() => {
    if (!currentReport) return;
    const loadInitialData = async () => {
      setSelectedValues(resetValues);
      reportName(filterConfig?.name || "");
      if (!filterConfig) return;

      const active = (Object.keys(filterConfig) as string[])
        .filter((key) => filterConfig[key as keyof FilterConfigModel] === true && key !== "date") as FilterKey[];
      await Promise.all(active.map((filterKey) => {
        if (filterKey !== "cdc") {
          return loadFilterData(filterKey);
        }
        return Promise.resolve();
      }));
    };
    loadInitialData(); 
  }, [currentReport, filterConfig, resetValues, reportName]);

  useEffect(() => {
    if (selectedSubIds.length > 0) {
      fetchAndSetData(() => getLocations(selectedSubIds), setCDC);
    } else {
      setCDC(createListCollection<selectOption>({ items: [] }));
    }
  }, [selectedSubIds]);

  useEffect(() => {
    handleSelectChange("cdc", selectedCDC);
  }, [selectedCDC]);

  const handleSubsidiariesChange = useCallback((event: { items: selectOption[] }) => {      
    handleMultiSelectChange({
      newItems: event.items,
      currentSelected: selectedSubsidiaries,
      setSelectedOptions: setSelectedSubsidiaries,
      setSelectedIds: setSelectedSubIds
    });
  }, [selectedSubsidiaries]);

  const handleCDCChange = useCallback((event: { items: selectOption[] }) => {
    handleMultiSelectChange({
      newItems: event.items,
      currentSelected: selectedCDCOptions,
      setSelectedOptions: setSelectedCDCOptions,
      setSelectedIds: setSelectedCDC,
    });
  }, [selectedCDCOptions]);

  const loadFilterData = useCallback(async (filterKey: FilterKey, parentValue?: number) => {
    setLoadingFilters(prev => ({ ...prev, [filterKey]: true }));
    try {
      if (currentReport === 100) return;
      const data = await getFilterOptions(filterKey, parentValue);      
      if (data) {
        setFilterData(prev => ({
          ...prev,
          [filterKey]: data
        }));
      }
    } catch (error) {
      setFilterData(prev => ({
        ...prev,
        [filterKey]: []
      }));
    } finally {
      setLoadingFilters(prev => ({ ...prev, [filterKey]: false }));
    }
  }, []);

  const handleSelectChange = useCallback((filterKey: FilterKey, value: any) => {
    setSelectedValues(prev => {
      const newValues = { ...prev, [filterKey]: value };
      if (filterKey === "subsidiary") {
        newValues.cdc = resetValues.cdc;
        setSelectedCDC([]);
        setSelectedCDCOptions([]);
      }
      return newValues;
    });
  }, [resetValues.cdc]);

  const applyFilters = useCallback(async () => {
    if (!filterConfig) return;
    const allFilters: AppliedFilters = {};
    Object.keys(FILTER_LABELS).forEach((key) => {
      const filterKey = key as FilterKey;
      if (filterKey === "cdc") {
        allFilters.cdc = selectedCDC;
      } else if (filterKey === "date") {
        allFilters.date = startDate && endDate 
          ? `${startDate.toISOString()} - ${endDate.toISOString()}`
          : null;
      } else {
        allFilters[filterKey] = selectedValues[filterKey] || null;
      }
    });
    const request: ReporGeneralRequesttModel = {
      report: currentReport ?? 0,
      filterOpction: allFilters
    };
    await getReportData(request);
  }, [filterConfig, selectedCDC, startDate, endDate, selectedValues, currentReport, getReportData]);

  const exportCSV = useCallback(() => {
    if (typeof currentReport === "number") {
      generateReportCSV_V2(currentReport, reportData);
    }
  }, [currentReport, reportData]);

  const renderFilter = (filterKey: FilterKey) => {
    if (filterKey === "date") {
      return (
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
      );
    }
    if (filterKey === "subsidiary") {
      return renderMultiSelectWithControls(
        subsidiaries,
        handleSubsidiariesChange,
        "Subsidiaria",
        "Selecciona una Subsidiaria",
        selectedSubsidiaries,
        currentReport === 100 ? true : loadingFilters.subsidiary
      );
    }
    if (filterKey === "cdc") {
      return renderMultiSelectWithControls(
        cdc,
        handleCDCChange,
        "Centro de consumo",
        "Selecciona un centro de consumo",
        selectedCDCOptions,
        selectedSubsidiaries.length === 0 || loadingFilters.cdc
      );
    }
    return (
      <SelectRoot
        collection={createListCollection({ items: filterData[filterKey] || [] })}
        onValueChange={(ev) => handleSelectChange(filterKey, Number(ev.value[0]))}
        value={selectedValues[filterKey] == null ? [] : [selectedValues[filterKey].toString()]}
        disabled={loadingFilters[filterKey]}
      >
        <SelectLabel fontFamily="heading">{FILTER_LABELS[filterKey]}</SelectLabel>
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
          : <Box minWidth="200px">No hay filtros disponibles</Box> }
      </Grid>

      <Stack direction="row" gap={4} mt={4}>
        <Button colorPalette="blue" width="full" onClick={applyFilters} flex="1" disabled={currentReport === 100 ? true : (startDate === null || endDate === null)}>
          Aplicar Filtros
        </Button>
        <Button colorPalette="green" disabled={reportData.length === 0} onClick={exportCSV} flex="1">
          Exportar CSV
        </Button>
      </Stack>
    </Box>
  );
}

export default Filters;
