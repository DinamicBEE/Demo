import { useEffect, useState } from "react";
import { Box, Button, Grid, VStack, HStack, Heading, Flex,
  Field } from "@chakra-ui/react";
import SimpleDatePicker from "./components/SimpleDatePicker";
import { SelectContent, SelectItem, SelectLabel, SelectRoot,
  SelectTrigger, SelectValueText } from "@components/ui/select";
import TableOfLotClosure from "./TableOfLotsClosure";
import { useLotClosureList } from "@context/lotClosure/lotClosureListContext";
import { useLotCatalogList } from "@context/lotClosure/catalogsProviders";
import { selectOption } from "@models/common.model";
import { handleMultiSelectChange, renderMultiSelectWithControls } from "../../utils/selectManagement";
import Loading from "@components/Loading";
import ComboBoxCustom from "@components/ComboBoxCustom";

function LotClosure() {
  // Subsidiarias
  const [subSelected, setSubSelected] = useState<string[]>([]);
  
  //Zonas
  const [selectedZoneOptions, setSelectedZoneOptions] = useState<string[]>([]);
  // const [zoneIds, setZoneIds] = useState<string[]>([]);
  
  //CDC's
  const [selectedCDCOptions, setSelectedCDCOptions] = useState<string[]>([]);
  // const [locationId, setLocationId] = useState<number[]>([]);

  //Status
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [initialDate, setInitialDate] = useState<Date | undefined>(undefined);
  const parseDateStringToLocalDate = (dateString: string): Date => {
      const [year, month, day] = dateString.split("-").map(Number);
      return new Date(year, month - 1, day);
    }
  const { fetchLotClosureData, lotsClosure, loadingBanks } = useLotClosureList();
  const { getStatusList, fetchCompanies, fetchZones, fetchLocations, status, companies, zones, locations, loading } =
    useLotCatalogList();
  const [showTable, setShowTable] = useState(false);

  const search = async () => {
    setShowTable(true);
    if (lotsClosure.length === 0) {
    }
    await fetchLotClosureData(formattedDate, selectedCDCOptions.map(Number), selectedStatus.map(Number),false);

  };

  useEffect(() => {
    const initialData = () => {
      fetchCompanies();
      getStatusList();
    }
    initialData();
  },[]);

  useEffect(() => { 
    setSelectedZoneOptions([]);
    setSelectedCDCOptions([]);
    fetchZones(subSelected.map(Number));
    // if (subSelected.length === 0) {
    //   setSelectedZoneOptions([]);
    //   setSelectedCDCOptions([]);
    // } else {
    // }
    },[subSelected]);

  useEffect(() => {
    async function loadLocations() {
      if (selectedZoneOptions.length === 0) {
        setSelectedCDCOptions([]);
      }
      else {
        setSelectedCDCOptions([]);
        await fetchLocations(selectedZoneOptions.map(Number));
      }
    }
    loadLocations();
  }, [selectedZoneOptions]);

  useEffect(() => {
    if (formattedDate) {
      const date = parseDateStringToLocalDate(formattedDate);
      setInitialDate(date);
    }
  }, [formattedDate]);

  return (
    <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
      <VStack align="start">

        <HStack w="100%">
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
            gap={4}
            mb={4}
            w="100%"
            alignItems="end"
          >

            <ComboBoxCustom
              multiple={true}
              options={companies}
              label="Subsidiarias"
              onValueChange={setSubSelected}
              selectedValues={subSelected}
              disableCondition={false}
            ></ComboBoxCustom>

            <ComboBoxCustom
              multiple={true}
              options={zones}
              label="Zonas"
              onValueChange={setSelectedZoneOptions}
              selectedValues={selectedZoneOptions}
              disableCondition={false}
            ></ComboBoxCustom>
                    
            <ComboBoxCustom
              multiple={true}
              options={locations}
              label="Centros de consumo"
              onValueChange={setSelectedCDCOptions}
              selectedValues={selectedCDCOptions}
              disableCondition={selectedZoneOptions.length === 0}
            ></ComboBoxCustom>

            <Field.Root gap={"-1"}>
                Fecha
                <SimpleDatePicker onDateChange={setFormattedDate} initialDate={initialDate}></SimpleDatePicker>
            </Field.Root>

            <ComboBoxCustom
              multiple={true}
              options={status}
              label="Estatus"
              onValueChange={setSelectedStatus}
              selectedValues={selectedStatus}
              disableCondition={false}
            ></ComboBoxCustom>

            <Button
              colorPalette="meraInfo"
              onClick={search}
              disabled={
                selectedCDCOptions.length === 0 || loadingBanks 
              }
            >
              Buscar
            </Button>
          </Grid>
        </HStack>
      </VStack>
      <TableOfLotClosure
        showTable={showTable}
        locations={selectedCDCOptions.map(Number)}
        date={formattedDate}
        status={selectedStatus.map(Number)}
      />
      { loading && (
          <Box position="fixed" top="50%" left="50%" zIndex={1000}>
              <Loading />
          </Box>
        )
      }
    </Box>
  );
}

export default LotClosure;