import { Box, Button, createListCollection, Field, Grid, ListCollection, HStack } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "@components/ui/select";
import { AppliedFilters, FilterConfigModel, FilterData, FilterPropsModel, ReportFilterModel } from "@models/reports.model";
import { FILTER_LABELS, FilterKey, REPORT_CONFIG } from "@models/const/reportFilter.const";
import { useEffect, useMemo, useCallback, useState } from "react";
import DatePicker from "../../LotClosure/components/DatePicker";
import { getFilterOptions, getLocations, getZones } from "@services/catalogService";
import { generateBanckReportCSV, generateReportCSV_V2 } from "@services/reportService";
import { useReportsContext } from "@context/reports/reportsContext";
import { selectOption } from "@models/common.model";
import { fetchAndSetData } from "../../../utils/selectManagement";
import SimpleDatePicker from "../../LotClosure/components/SimpleDatePicker";
import { REPORT_EXECPTION } from "@models/const/reportsService.const";
import Loading from "@components/Loading";

function Filters({ currentReport, reportName }: FilterPropsModel) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedValues, setSelectedValues] = useState<ReportFilterModel>({} as ReportFilterModel);
  const [filterData, setFilterData] = useState<FilterData>({});
  const [loadingFilters, setLoadingFilters] = useState<Record<string, boolean>>({});
  const [selectedSubIds, setSelectedSubIds] = useState<number[]>([]);
  const [cdc, setCDC] = useState<ListCollection<selectOption>>(createListCollection<selectOption>({ items: [] }));
  const [selectedCDC, setSelectedCDC] = useState<number[]>([]);
  const [zone, setZone] = useState<ListCollection<selectOption>>(createListCollection<selectOption>({ items: [] }));
  const [selectedZone, setSelectedZone] = useState<number[]>([])
  const [selectedStore, setSelectedStore] = useState<number[]>([])
  const [selectedErrorType, setSelectedErrorType] = useState<number[]>([])
  const [formattedDate, setFormattedDate] = useState<string>("");

  const [initialDate, setInitialDate] = useState<Date>(new Date());
  const { getReportData, reportData } = useReportsContext();

  const [actualReport, setActualReport] = useState<number>();
  //TODO: Usar Loading para bloquar busqueda sino se tiene fecha/rango y zonas (casos especiales error sinc y cupones)
  const [loading, setLoading] = useState<boolean>(false);

  const parseDateStringToLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    if (formattedDate) {
      const localDate = parseDateStringToLocalDate(formattedDate);
      setInitialDate(localDate);
    }
  
  }, [formattedDate])
  
  const resetValues = useMemo<ReportFilterModel>(() => ({
    categories: null,
    zone: [],
    cdc: [],
    multicdc: [],
    customer: null,
    date: null,
    dateRange: null,
    subsidiary: [],
    errorType: [],
    stores: []
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
    zone: false,
    cdc: false,
    multicdc: false,
    customer: false,
    errorType: false,
    stores: false
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

  useEffect(() => {
    if (actualReport === currentReport) return;
    if (!currentReport) return;
    setSelectedCDC([]);
    setSelectedZone([]);
    setSelectedSubIds([]);
    setSelectedStore([]);
    setSelectedValues(resetValues);
    setDateRange([null, null]);
    setSelectedValues(resetValues);
    reportName(filterConfig.name || "");

    const loadData = async () => {
      const active = (Object.keys(filterConfig) as FilterKey[])
        .filter((key) => filterConfig[key] && key !== "date");
      await Promise.all(active.map((key) => key !== "cdc" ? loadFilterData(key) : Promise.resolve()));
    };

    loadData();
    setActualReport(currentReport);
  }, [currentReport, reportName]);

  // Cargar Zonas cuando cambian las subsidiarias
  useEffect(() => {
    if (selectedSubIds.length > 0) {
      setSelectedZone([]);
      setSelectedCDC([]);
      fetchAndSetData(() => getZones(selectedSubIds), setZone);
    } else {
      setZone(createListCollection<selectOption>({ items: [] }));
    }
  }, [selectedSubIds]);
  // Cargar CDC cuando cambian las zonas
  useEffect(() => {
    if (selectedZone.length > 0) {
      setSelectedCDC([]);
      fetchAndSetData(() => getLocations(selectedZone), setCDC);
    } else {
      setCDC(createListCollection<selectOption>({ items: [] }));
    }
  }, [selectedZone]);

  // Manejo de selects
  const handleSelectsChange = useCallback((setValues: React.Dispatch<React.SetStateAction<number[]>>, ev: { value: string[]}) =>{
    const ids = ev.value.map(Number);
    setValues(ids);
  },[])
  
  // Cargar opciones de filtros
  const loadFilterData = useCallback(async (filterKey: FilterKey, parentValue?: any) => {
    setLoadingFilters(prev => ({ ...prev, [filterKey]: true }));
    try {
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
    setLoading(true)
    if (!filterConfig) return;
    const allFilters: AppliedFilters = {};

    Object.keys(FILTER_LABELS).forEach((key) => {
      const filterKey = key as FilterKey;
      if (filterKey === "cdc") {
        allFilters.cdc = selectedCDC[0];
      }  else if (filterKey === "multicdc") {
        allFilters.multicdc = selectedCDC;
      } else if (filterKey === "dateRange") {
        if (startDate === null) {
          allFilters.dateRange = null;
        } else {

          const effectiveEndDate = endDate || startDate;
          
          allFilters.dateRange = `${startDate.toISOString().split("T")[0]},${effectiveEndDate.toISOString().split("T")[0]}`;

          if (endDate === null) {
            setDateRange([startDate, startDate]);
          }
        }
      } else if (filterKey === "stores") {
        allFilters.stores = filterData["stores"]?.filter(option => selectedStore.includes(option.value)).map(option => option.label) || [];
      } else if (filterKey === "errorType") {
        allFilters.errorType = selectedErrorType;
      } else if (filterKey === "date") {
        allFilters.date = formattedDate
          ? `${new Date(formattedDate).toISOString().split("T")[0]}`
          : null;
      } else {
        allFilters[filterKey] = selectedValues[filterKey] || null;
      }
    });
    //console.log(allFilters)
    await getReportData({
      report: currentReport ?? 0,
      filterOpction: allFilters
    });
    setLoading(false)
  }, [filterConfig, selectedCDC, selectedErrorType, selectedStore, startDate, endDate, selectedValues, currentReport, getReportData, formattedDate]);

  const handleCleanSelects = (key: string, action: string) => {
    if (key === "subsidiary") {
      if (action === "all") {
        const allIds = subsidiaries.items.map(item => item.value as number);
        if (allIds.length === selectedSubIds.length) return;
        setSelectedSubIds(allIds);
      } else {
        setSelectedSubIds([]);
      }
    }
    if (key === "zone") {
      if (action === "all") {
        const allIds = zone.items.map(item => item.value as number);
        if (allIds.length === selectedZone.length) return;
        setSelectedZone(allIds);
      } else {
        setSelectedZone([]);
      }
    }
    if (key === "multicdc") {
      if (action === "all") {
        const allIds = cdc.items.map(item => item.value as number);
        if (allIds.length === selectedCDC.length) return;
        setSelectedCDC(allIds);
      } else {
        setSelectedCDC([]);
      }
    }
    if (key === "stores") {
      if (action === "all") {
        const allIds = filterData["stores"]?.map(item => item.value as number);
        if (allIds.length === selectedStore.length) return;
        setSelectedStore(allIds);
      } else {
        setSelectedStore([]);
      }
    }
    if (key === "errorType") {
      if (action === "all") {
        const allIds = filterData["errorType"]?.map(item => item.value as number);
        if (allIds.length === selectedErrorType.length) return;
        setSelectedErrorType(allIds);
      } else {
        setSelectedErrorType([]);
      }
    }
  }

  // Exportar CSV
  const exportCSV = useCallback(() => {
    if (typeof currentReport === "number") {
      const isException = REPORT_EXECPTION.includes(currentReport);
      !isException ? generateReportCSV_V2(currentReport, reportData) : generateBanckReportCSV(currentReport, reportData);
    }
  }, [currentReport, reportData]);

  // Render dinámico de filtros
  const renderFilter = (filterKey: FilterKey) => {
    if (filterKey === "dateRange") {
      return (
        <Field.Root w="100%">
          <Field.Label>{FILTER_LABELS[filterKey]}</Field.Label>
          <DatePicker onChange={setDateRange} startDate={startDate} endDate={endDate} />
        </Field.Root>
      );
    }

    if (filterKey === "date") {
      return (
        <Field.Root w="100%">
          <Field.Label>{FILTER_LABELS[filterKey]}{currentReport===100? "/Hora transacción" : ""}</Field.Label>
          <SimpleDatePicker onDateChange={setFormattedDate} initialDate={initialDate} />
        </Field.Root>
      );
    }

    if (filterKey === "subsidiary") {
      return (
        <SelectRoot
          multiple={true}
          collection={subsidiaries}
          onValueChange={ev => handleSelectsChange(setSelectedSubIds, ev)}
          value={selectedSubIds}
          
        >
          <SelectLabel>{FILTER_LABELS[filterKey]}</SelectLabel>
          <SelectTrigger clearable={true}>
            <SelectValueText placeholder="Selecciona una o más" />
          </SelectTrigger>
          <SelectContent>
            <Box>
              {renderSelectAllButton(filterKey)}
            </Box>
            {(subsidiaries.items || []).map((option) => (
              <SelectItem key={option.value} item={option}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      );
    }
    if (filterKey === "zone") {
      return (
        <SelectRoot
          multiple={true}
          collection={zone}
          onValueChange={ev => handleSelectsChange(setSelectedZone, ev)}
          value={selectedZone}
          disabled={selectedSubIds.length === 0}
        >
          <SelectLabel>{FILTER_LABELS[filterKey]}</SelectLabel>
          <SelectTrigger clearable={true}>
            <SelectValueText placeholder="Selecciona una o más" />
          </SelectTrigger>
          <SelectContent>
            <Box>
              {renderSelectAllButton(filterKey)}
            </Box>
            {(zone.items || []).map((option) => (
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
          multiple={filterKey !== "cdc"}
          collection={cdc}
          onValueChange={ev => handleSelectsChange(setSelectedCDC, ev)}
          value={selectedCDC}
          disabled={selectedZone.length === 0}
        >
          <SelectLabel>{FILTER_LABELS[filterKey]}</SelectLabel>
          <SelectTrigger clearable={true}>
            <SelectValueText placeholder={cdc.items.length === 0 ? "Sin datos" : "Selecciona"} />
          </SelectTrigger>
          <SelectContent>
            {<Box>
              {filterKey === "multicdc" && renderSelectAllButton(filterKey)}
            </Box>}
            {cdc.items.map((option) => (
              <SelectItem key={option.value} item={option}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      );
    }

    if (filterKey === "errorType") {
      return (
        <SelectRoot
          multiple={true}
          collection={createListCollection({ items: filterData[filterKey] || [] })}
          onValueChange={ev => handleSelectsChange(setSelectedErrorType, ev)}
          value={selectedErrorType}
          disabled={filterData["errorType"]?.length === 0}
        >
          <SelectLabel>{FILTER_LABELS[filterKey]}</SelectLabel>
          <SelectTrigger clearable={true}>
            <SelectValueText placeholder={filterData["errorType"]?.length === 0 ? "Sin datos" : "Selecciona"} />
          </SelectTrigger>
          <SelectContent>
            {<Box>
              {renderSelectAllButton(filterKey)}
            </Box>}
            {(filterData["errorType"] || []).map((option) => (
              <SelectItem key={option.value} item={option}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      );
    }

    if (filterKey === "stores") {
      return (
        <SelectRoot
          multiple={true}
          collection={createListCollection({ items: filterData[filterKey] || [] })}
          onValueChange={ev => handleSelectsChange(setSelectedStore, ev)}
          value={selectedStore}
          disabled={filterData["stores"]?.length === 0}
        >
          <SelectLabel>{FILTER_LABELS[filterKey]}</SelectLabel>
          <SelectTrigger clearable={true}>
            <SelectValueText placeholder={filterData["stores"]?.length === 0 ? "Sin datos" : "Selecciona"} />
          </SelectTrigger>
          <SelectContent>
            {<Box>
              {renderSelectAllButton(filterKey)}
            </Box>}
            {(filterData["stores"] || []).map((option) => (
              <SelectItem key={option.value} item={option}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      );
    }

    // Otros filtros
    return (
      <SelectRoot
        collection={createListCollection({ items: filterData[filterKey] || [] })}
        onValueChange={(ev) => setSelectedValues(prev => ({ ...prev, [filterKey]: Number(ev.value) }))}
        value={
          selectedValues[filterKey] == null
            ? []
            : Array.isArray(selectedValues[filterKey])
              ? selectedValues[filterKey].map(String)
              : [Number(selectedValues[filterKey])]
        }
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

  const renderSelectAllButton = (key: string) => {
    return <HStack mb={2} justify="space-between" gap="2">
      <Button
        size={"sm"}
        colorPalette={'meraPrimary'}
        variant={"surface"}
        onClick={(e) => {
          e.preventDefault();
          handleCleanSelects(key, "all");
        }}
      >
        Seleccionar todos
      </Button>
      <Button
        size={"sm"}
        colorPalette={'meraWarning'}
        variant={"surface"}
        onClick={(e) => {
          e.preventDefault();
          handleCleanSelects(key, "none");
        }}
      >
        Borrar selección
      </Button>
    </HStack>
  }

  return (
    <Box w={'100%'} py={4} mb={4}>
      <Grid templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }} gap={4} mb={4}>
        {activeFilters.length > 0
          ? activeFilters.map((filterKey) => (
            <Box key={filterKey} minWidth="200px">
              {renderFilter(filterKey)}
            </Box>
          ))
          : <Box minWidth="200px"></Box>}
      </Grid>

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4} mt={4}>
        <Button loading={loading} colorPalette="blue" width={"100%"} onClick={applyFilters}>
          {currentReport === 100 ? "Cargar" : "Buscar por filtros"}
        </Button>
        <Button loading={loading} colorPalette="green" width={"100%"} disabled={reportData.length === 0} onClick={exportCSV}>
          Exportar CSV
        </Button>
      </Grid>
      {loading && (
          <Box position="fixed" top="50%" left="50%" zIndex={1000}>
              <Loading />
          </Box>
      )
      }
    </Box>
  );
}
export default Filters;
