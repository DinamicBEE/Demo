import { useState, useEffect } from "react";
import {
  Button,
  Grid,
  VStack,
  HStack,
  Heading,
  createListCollection,
  ListCollection,
  Field,
  Box,
  GridItem,
} from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@components/ui/select";
import { Checkbox } from "@components/ui/checkbox";
import { Alert } from "@components/ui/alert";
import { useList } from "@context/home/listsContext";
import { useClousing } from "@context/home/clousingContext";
import TableOfTotals from "./components/TableOfTotals";
import "./Home.css";
import { location, StoreModel, SubsidiaryModal } from "@models/common.model";
import { ValueChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/select/namespace";
import Loading from "@components/Loading";
import DatePicker from "../LotClosure/components/DatePicker";

function Home() {
  const [subsidiary, setSubsidiary] = useState<ListCollection>(
    createListCollection({ items: [] })
  );
  const [SubSelect, setSubSelect] = useState<SubsidiaryModal>(
    {} as SubsidiaryModal
  );
  const [stores, setStores] = useState<StoreModel[]>([]);
  const [storeBySub, setStoreBySub] = useState<ListCollection>(
    createListCollection({ items: [] })
  );
  const [isAdyen, setIsAdyen] = useState<boolean>(false);
  const [location, setLocation] = useState<location>({} as location);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const { getInfo, filterDataAdyen, data } = useClousing();
  const { getStoresData, error, getSubsidiariesData } = useList();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const [page, setPage] = useState<number>(1);
  const [isSearch, setIsSearch] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      setCatalogLoading(true);

      const subsidiariesData = await getSubsidiariesData();

      const subList = createListCollection({
        items: subsidiariesData.map((item) => ({
          value: item.id,
          label: item.name,
          idCurrency: item.idCurrency,
        })),
      });

      setSubsidiary(subList);

      // const storeData = await getStoresData()

      // setStores(storeData);

      setCatalogLoading(false);
    }

    fetchData();
  }, []);

  async function filterStore(event: ValueChangeDetails<any>) {
    const itemSelected = {
      ...event.items[0],
      id: event.items[0].value,
      name: event.items[0].label,
    };

    const selection = Number(event.value[0]);

    setSubSelect(itemSelected);

    // TODO: Guardar las tiendas encontradas en stores para no repetir búsquedas
    let storeBySubsidiary = stores.filter(
      (item) => item.subsidiary === selection
    );
    if (storeBySubsidiary.length == 0) {
      const newLocs = await fetchLocations(selection);
      const mappedStores = newLocs.map(
        (item: { name: string; id: number }) => ({
          value: item.id,
          label: item.name,
        })
      );

      let storeFilter = createListCollection({
        items: mappedStores,
      });

      const newLocations = newLocs.map((loc) => {
        return {
          ...loc,
          subsidiary: selection,
        };
      });

      setStores((prev) => [...prev, ...newLocations]);

      setStoreBySub(storeFilter);
    } else if (storeBySubsidiary.length > 0) {
      const mappedStores = storeBySubsidiary.map(
        (item: { name: string; id: number }) => ({
          value: item.id,
          label: item.name,
        })
      );
      let storeFilter = createListCollection({
        items: mappedStores,
      });
      setStoreBySub(storeFilter);
    } else {
      console.warn("No se encontraron tiendas para esta subsidiaria.");
    }
  }

  async function fetchLocations(subId: number) {
    setCatalogLoading(true);
    const locationsData = await getStoresData(subId);

    // setStores((prev) => locationsData);

    setCatalogLoading(false);

    return Promise.resolve(locationsData);
  }

  return (
    <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
      <VStack spaceY={4} align="start">
        <Heading>Corte de caja</Heading>
        {catalogLoading && (
          <Box position="fixed" top="50%" left="50%">
            <Loading />
          </Box>
        )}

        {error && <Alert status="error">{error}</Alert>}
        <HStack w="100%">
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={4}
            mb={4}
            w="100%"
            alignItems="end"
          >
            {subsidiary.items.length > 0 && (
              <SelectRoot
                collection={subsidiary}
                onValueChange={(event) => filterStore(event)}
              >
                <SelectLabel fontFamily="heading">
                  Selecciona Subsidiaria
                </SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder="Selecciona Subsidiaria" />
                </SelectTrigger>
                <SelectContent>
                  {subsidiary.items.map((item) => (
                    <SelectItem item={item} key={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            )}

            {SubSelect.id != 0 && SubSelect.id != null && (
              <SelectRoot
                collection={storeBySub}
                onValueChange={(event) => {
                  const itemSelected = {
                    id: event.items[0].value,
                    name: event.items[0].label,
                  };

                  setLocation(itemSelected);
                }}
              >
                <SelectLabel>Selecciona Centro de consumo</SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder="Selecciona Centro de consumo" />
                </SelectTrigger>
                <SelectContent>
                  {storeBySub.items.map((item) => (
                    <SelectItem item={item} key={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            )}

            {location.id != 0 && (
              <Field.Root>
                <Field.Label>Rango de fechas</Field.Label>
                <DatePicker
                  startDate={startDate}
                  endDate={endDate}
                  onChange={setDateRange}
                />
              </Field.Root>
            )}
            <GridItem colSpan={1} />
            {endDate && startDate && (
              <Button
                colorPalette="meraInfo"
                onClick={() => {
                  setShowTable(true);
                  getInfo(SubSelect.id, location.id, 0, startDate, endDate, true);
                  setIsAdyen(false);
                  setPage(1);
                }}
              >
                Buscar
              </Button>
            )}
          </Grid>
        </HStack>
        {/* <Checkbox
                  onCheckedChange={
                      (event) => {
                          filterDataAdyen(event.checked as boolean);
                          setIsAdyen(event.checked as boolean);
                      }
                  }
                  checked={isAdyen}
                hidden={data.length === 0}
              >Adyen</Checkbox> */}
      </VStack>

      {showTable && (
        <TableOfTotals
          subsidiary={SubSelect}
          store={location}
          startDate={startDate ?? new Date()}
          endDate={endDate ?? new Date()}
          page={page}
          setPage={setPage}
        />
      )}
    </Box>
  );
}

export default Home;
