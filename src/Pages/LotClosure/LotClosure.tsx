import { useState } from "react";
import {
  Box,
  Button,
  Grid,
  VStack,
  HStack,
  Heading,
  Flex,
  Field,
  Spinner,
} from "@chakra-ui/react";
import DatePicker from "./components/DatePicker";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@components/ui/select";
import TableOfLotClosure from "./TableOfLotsClosure";
import { useLotClosureList } from "@context/lotClosure/lotClosureListContext";
import { useLotCatalogList } from "@context/lotClosure/catalogsProviders";

function LotClosure() {
  const [companyId, setCompanyId] = useState(0);
  const [locationId, setLocationId] = useState(0);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const { fetchLotClosureData, lotsClosure } = useLotClosureList();
  const { fetchCompanies, fetchLocations, comapanies, locations, loading } =
    useLotCatalogList();
  const [showTable, setShowTable] = useState(false);

  const search = () => {
    if (lotsClosure.length === 0) {
      setShowTable(true);
    }

    fetchLotClosureData(dateRange, locationId, companyId);
  };

  const onSelectedCompany = (companyIdSelected: string[]) => {
    if (Number(companyIdSelected) !== companyId) {
      setLocationId(0);
      setCompanyId(Number(companyIdSelected));
    }
  };

  return (
    <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
      <VStack align="start">
        <Heading>
          Cierre de lotes
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
              onValueChange={({ value }) => onSelectedCompany(value)}
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

            <SelectRoot
              key={companyId}
              collection={locations}
              size="sm"
              onOpenChange={() => fetchLocations(companyId)}
              onValueChange={({ value }) => setLocationId(Number(value))}
              disabled={companyId === 0}
            >
              <SelectLabel>Centro de consumo</SelectLabel>
              <SelectTrigger>
                <SelectValueText placeholder="Selecciona un centro de consumo" />
              </SelectTrigger>
              <SelectContent>
                {!loading ? (
                  locations.items.map((location) => (
                    <SelectItem item={location} key={location.value}>
                      {location.label}
                    </SelectItem>
                  ))
                ) : (
                  <Flex justify="center" w="100%" p={2}>
                    <Spinner color={"#66BB6A"} />
                  </Flex>
                )}
              </SelectContent>
            </SelectRoot>

            <Field.Root>
              <Field.Label>Rango de fechas</Field.Label>
              <DatePicker
                startDate={startDate}
                endDate={endDate}
                onChange={setDateRange}
              />
            </Field.Root>
            
              <Button
                colorPalette="meraInfo"
                onClick={search}
                disabled={
                  companyId !== 0 &&
                  locationId !== 0 &&
                  startDate !== null &&
                  endDate !== null
                    ? false
                    : true
                }
              >
                Buscar
              </Button>

          </Grid>
        </HStack>
      </VStack>
      <TableOfLotClosure
        showTable={showTable}
        companyId={companyId}
        locationId={locationId}
        dateRange={dateRange}
      />
    </Box>
  );
}

export default LotClosure;
