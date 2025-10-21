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

function LotClosure() {

  const [locationId, setLocationId] = useState<number[]>([]);
  const [zoneIds, setZoneIds] = useState<number[]>([]);

  const [selectedCDCOptions, setSelectedOptions] = useState<selectOption[]>([]);
  const [selectedZoneOptions, setSelectedZoneOptions] = useState<selectOption[]>([]);

  const [formattedDate, setFormattedDate] = useState<string>('');
  const initialDate = new Date();

  const { fetchLotClosureData, lotsClosure } = useLotClosureList();
  const { fetchCompanies, fetchZones, fetchLocations, comapanies, zones, locations, loading } =
    useLotCatalogList();
  const [showTable, setShowTable] = useState(false);

  const search = async () => {
    if (lotsClosure.length === 0) {
      setShowTable(true);
    }
    await fetchLotClosureData(formattedDate, locationId, false);

  };

  useEffect(() => {
    async function loadLocations() {
      await fetchLocations(zoneIds);
    }
    loadLocations();
  }, [zoneIds]);

  const handleZoneChange = (event: { items: selectOption[] }) => {
    handleMultiSelectChange({
        newItems: event.items,
        currentSelected: selectedZoneOptions,
        setSelectedOptions: setSelectedZoneOptions,
        setSelectedIds: setZoneIds
    });
  };

  const handleCDCChange = (event: { items: selectOption[] }) => {
    handleMultiSelectChange({
        newItems: event.items,
        currentSelected: selectedCDCOptions,
        setSelectedOptions: setSelectedOptions,
        setSelectedIds: setLocationId
    })
  };

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
            <SelectRoot
              collection={comapanies}
              size="sm"
              onOpenChange={fetchCompanies}
              onValueChange={(value) => fetchZones([Number(value.value)])}
            >
              <SelectLabel>Subsidiaria</SelectLabel>
              <SelectTrigger>
                <SelectValueText placeholder="Selecciona una subsidiaria" />
              </SelectTrigger>
              <SelectContent>
                {comapanies.items.length > 0 && comapanies.items.map((company) => (
                  <SelectItem item={company} key={company.value}>
                    {company.label}
                  </SelectItem>
                ))

                }

              </SelectContent>
            </SelectRoot>

            {renderMultiSelectWithControls(
                zones,
                handleZoneChange,
                "Zonas",
                "Selecciona una zona",
                selectedZoneOptions,
                true
              )
            }

            {renderMultiSelectWithControls(
                locations,
                handleCDCChange,
                "Centro de consumo",
                "Selecciona un centro de consumo",
                selectedCDCOptions,
                !(selectedZoneOptions.length > 0)
              )
            }

            <Field.Root>
                <SimpleDatePicker onDateChange={setFormattedDate} initialDate={initialDate}></SimpleDatePicker>
            </Field.Root>

            <Button
              colorPalette="meraInfo"
              onClick={search}
              disabled={
                locationId.length < 0 
              }
            >
              Buscar
            </Button>
          </Grid>
        </HStack>
      </VStack>
      <TableOfLotClosure
        showTable={showTable}
        locations={locationId}
        date={formattedDate}
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