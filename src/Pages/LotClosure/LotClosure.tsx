import { useState } from "react";
import { Box, Button, Grid, VStack, HStack, Heading, Flex,
  Field, Spinner } from "@chakra-ui/react";
import SimpleDatePicker from "./components/SimpleDatePicker";
import { SelectContent, SelectItem, SelectLabel, SelectRoot,
  SelectTrigger, SelectValueText } from "@components/ui/select";
import TableOfLotClosure from "./TableOfLotsClosure";
import { useLotClosureList } from "@context/lotClosure/lotClosureListContext";
import { useLotCatalogList } from "@context/lotClosure/catalogsProviders";
import { location, selectOption, SubsidiaryModal } from "@models/common.model";
import { handleMultiSelectChange, renderMultiSelectWithControls } from "../../utils/selectManagement";

function LotClosure() {
  const [companyId, setCompanyId] = useState(0);
  const [companySelected, setCompanySelected] = useState<SubsidiaryModal>(
    {} as SubsidiaryModal
  );
  const [locationId, setLocationId] = useState<number[]>([]);
  const [locationSelected, setLocationSelected] = useState<location>(
     {} as location
  );
  const [selectedCDCOptions, setSelectedOptions] = useState<selectOption[]>([]);

  const [formattedDate, setFormattedDate] = useState<string>('');
  const initialDate = new Date();

  const { fetchLotClosureData, lotsClosure } = useLotClosureList();
  const { fetchCompanies, fetchLocations, comapanies, locations, loading } =
    useLotCatalogList();
  const [showTable, setShowTable] = useState(false);

  const search = async () => {
    if (lotsClosure.length === 0) {
      setShowTable(true);
    }
    await fetchLotClosureData(formattedDate, locationId, false);
    const getCompanies = comapanies.items.find(
      (company) => company.value === companyId
    );
    // const getLocations = locations.items.find(
    //   (location) => location.value === locationId
    // );
    setCompanySelected({
      id: getCompanies?.value || 0,
      name: getCompanies?.label || "",
      idCurrency: 0,
    });
    // setLocationSelected({
    //   id: getLocations?.value || 0,
    //   name: getLocations?.label || "",
    // });
  };

  // const onSelectedCompany = (companyIdSelected: string[]) => {
  //   if (Number(companyIdSelected) !== companyId) {
  //     setLocationId(0);
  //     setCompanyId(Number(companyIdSelected));
  //   }
  // };

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
        <Heading>
          Selecciona una subsidiaria , rango de fechas y centro de consumo
        </Heading>

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
              onValueChange={(value) => fetchLocations(Number(value.value))}
            >
              <SelectLabel>Subsidiaria</SelectLabel>
              <SelectTrigger>
                <SelectValueText placeholder="Selecciona una subsidiaria" />
              </SelectTrigger>
              <SelectContent>
                {!loading ? (
                  comapanies.items.map((company) => (
                    <SelectItem item={company} key={company.value}>
                      {company.label}
                    </SelectItem>
                  ))
                ) : (
                  <Flex justify="center" w="100%" p={2}>
                    <Spinner color={"#66BB6A"} />
                  </Flex>
                )}
              </SelectContent>
            </SelectRoot>

            {renderMultiSelectWithControls(
                locations,
                handleCDCChange,
                "Centro de consumo",
                "Selecciona un centro de consumo",
                selectedCDCOptions,
                true
              )
            }

            <Field.Root>
                <SimpleDatePicker onDateChange={setFormattedDate} initialDate={initialDate}></SimpleDatePicker>
            </Field.Root>

            <Button
              colorPalette="meraInfo"
              onClick={search}
              disabled={
                companyId !== 0 &&
                locationId.length > 0 
              }
            >
              Buscar
            </Button>
          </Grid>
        </HStack>
      </VStack>
      <TableOfLotClosure
        showTable={showTable}
        company={companySelected}
        location={locationSelected}
        date={formattedDate}
      />
    </Box>
  );
}

export default LotClosure;
