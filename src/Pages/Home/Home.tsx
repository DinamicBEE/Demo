import { useState, useEffect } from "react";
import { Button, Grid, VStack, HStack, Heading, createListCollection,
  ListCollection, Field, Box, GridItem } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectLabel, SelectRoot,
  SelectTrigger, SelectValueText } from "@components/ui/select";
import { Alert } from "@components/ui/alert";
import { useList } from "@context/home/listsContext";
import { useClousing } from "@context/home/clousingContext";
import TableOfTotals from "./components/table/TableOfTotals";
import { location, StoreModel, SubsidiaryModal } from "@models/common.model";
import Loading from "@components/Loading";
import SimpleDatePicker from "../LotClosure/components/SimpleDatePicker";

// DEPRECATED el componente se cambio por homev2

function Home() {
  const [subsidiary, setSubsidiary] = useState<ListCollection<{ value: number; label: string; idCurrency?: number }>>(
    createListCollection<{ value: number; label: string; idCurrency?: number }>({ items: [] })
  );
  const [SubSelect, setSubSelect] = useState<SubsidiaryModal>(
    {} as SubsidiaryModal
  );
  const [stores, setStores] = useState<StoreModel[]>([]);
  const [storeBySub, setStoreBySub] = useState<ListCollection<{ value: number; label: string }>>(
    createListCollection<{ value: number; label: string }>({ items: [] })
  );
  const [location, setLocation] = useState<location>({} as location);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(false);
  const [showTable, setShowTable] = useState<boolean>(false);
  const { getInfo } = useClousing();
  const { getStoresData, error, getSubsidiariesData } = useList();

  const [formattedDate, setFormattedDate] = useState<string>('');
  const initialDate = new Date();

  useEffect(() => {
    async function fetchData() {
      setCatalogLoading(true);

      const subsidiariesData = await getSubsidiariesData();

      const subList = createListCollection<{ value: number; label: string; idCurrency?: number }>({
        items: subsidiariesData.map((item) => ({
          value: item.id,
          label: item.name,
          idCurrency: item.idCurrency,
        })),
      });

      setSubsidiary(subList);

      setCatalogLoading(false);
    }

    fetchData();
  }, []);

  async function filterStore(event: any) {
    const itemSelected = {
      ...event.items[0],
      id: event.items[0].value,
      name: event.items[0].label,
    };

    const selection = Number(event.value[0]);

    setSubSelect(itemSelected);

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

    setCatalogLoading(false);

    return Promise.resolve(locationsData);
  }

  return (
    <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
      <VStack spaceY={4} align="start">
        <Heading>Corte de caja</Heading>
        {catalogLoading && (
          <Box position="fixed" top="50%" left="50%"  zIndex={1000}>
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

            <SelectRoot
              collection={subsidiary}
              onValueChange={(event) => filterStore(event)}
            >
              <SelectLabel fontFamily="heading">
                Subsidiaria
              </SelectLabel>
              <SelectTrigger>
                <SelectValueText placeholder="Selecciona subsidiaria" />
              </SelectTrigger>
              <SelectContent>
                {subsidiary.items.length > 0 && subsidiary.items.map((item) => (
                  <SelectItem item={item} key={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>

            <SelectRoot
              collection={storeBySub}
              disabled={SubSelect.id == 0 || SubSelect.id == null || SubSelect == undefined}
              onValueChange={(event) => {
                const itemSelected = {
                  id: event.items[0].value,
                  name: event.items[0].label,
                };

                setLocation(itemSelected);
              }}
            >
              <SelectLabel>Centro de consumo</SelectLabel>
              <SelectTrigger>
                <SelectValueText placeholder={
                  SubSelect.id == 0 || SubSelect.id == null || SubSelect == undefined
                  ? "Seleccione primero una subsidiaria"
                  : "Selecciona Centro de consumo"} />
              </SelectTrigger>
              <SelectContent>
                {(SubSelect.id != 0 && SubSelect.id != null) && storeBySub.items.map((item) => (
                  <SelectItem item={item} key={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>

            {location.id != 0 && (
              <Field.Root>
                <Field.Label>Fecha</Field.Label>
                <SimpleDatePicker onDateChange={setFormattedDate} initialDate={initialDate}></SimpleDatePicker>
              </Field.Root>
            )}
            <GridItem colSpan={1} />
              <Button
                colorPalette="meraInfo"
                disabled={SubSelect.id === undefined || location.id === undefined || formattedDate.length === 0}
                onClick={() => {
                  setShowTable(true);
                  getInfo(location.id, 0, new Date(`${formattedDate}T00:00:00`), new Date(`${formattedDate}T00:00:00`), true);
                }}
              >
                Buscar
              </Button>
          </Grid>
        </HStack>
      </VStack>

      {showTable && (
        <TableOfTotals
          isStarbucks={false}
          subsidiary={SubSelect}
          store={location}
          startDate={new Date(`${formattedDate}T00:00:00`) ?? new Date()}
          endDate={new Date(`${formattedDate}T00:00:00`) ?? new Date()}
          isReport={false}
        />
      )}
    </Box>
  );
}

export default Home;