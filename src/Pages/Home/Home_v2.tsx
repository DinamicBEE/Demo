import { useEffect, useState } from "react";
import { Box, Button, createListCollection, Field, Grid, GridItem, ListCollection, VStack } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "@components/ui/select";
import { selectOption } from "@models/common.model";

import { useList } from "@context/home/listsContext";
import { getCountries, getStatus, getZones } from "@services/catalogService";
import DatePicker from "../LotClosure/components/DatePicker";

function Home_v2() {

    const { getSubsidiariesData } = useList();

    const [countries, setCountries] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));
    const [subsidiaries, setSubsidiaries] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));
    const [zones, setZones] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));
    const [cdc, setCDC] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));
    const [status, setStatus] = useState<ListCollection<selectOption>>(
    createListCollection<selectOption>({ items: [] }));

    const [country, setCountry] = useState<selectOption[]>([]);
    const [selectedSubsidiary, setSelectedSubsidiary] = useState<selectOption[]>([]);
    const [selectedAreas, setSelectedAreas] = useState<selectOption[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<selectOption[]>([]);

    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null ]);
    const [startDate, endDate] = dateRange;

    useEffect(() => {
        async function fetchData() {
            const countriesData = await getCountries();
            const countryList = createListCollection<selectOption>({
                items: (await countriesData).map((item: any) => ({
                    value: item.id,
                    label: item.name,
                })),
            });

            const subsidiariesData = await getSubsidiariesData();
            const subList = createListCollection<selectOption>({
                items: subsidiariesData.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                })),
            });

            const zonesData = await getZones();
            const zoneList = createListCollection<selectOption>({
                items: zonesData.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                })),
            });
            
            const statusData = await getStatus();
            const status = createListCollection<selectOption>({
                items: statusData.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                })),
            });

            setCountries(countryList);
            setSubsidiaries(subList);
            setZones(zoneList);
            setStatus(status);

        }

        fetchData();
    }, 
    []);

    return (
        <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
                
            <Grid
                templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
                gap={4}
                mb={4}
                w="100%"
                alignItems="end"
            >
                <SelectRoot
                    collection={countries}
                    onValueChange={(event) => {
                        const selectedCountries = event.items.map((item: selectOption) => ({
                            value: item.value,
                            label: item.label,
                        }));
                        setCountry(selectedCountries);
                    }}
                >
                    <SelectLabel fontFamily="heading">
                    Selecciona País
                    </SelectLabel>
                    <SelectTrigger>
                    <SelectValueText placeholder="Selecciona Subsidiaria" />
                    </SelectTrigger>
                    <SelectContent>
                    {countries.items.length > 0 && countries.items.map((item: selectOption) => (
                        <SelectItem item={item} key={item.value}>
                        {item.label}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </SelectRoot>
                
                <SelectRoot
                    multiple={true}
                    collection={subsidiaries}
                    onValueChange={(event) => {
                        const selectedSubsidiaries = event.items.map((item: selectOption) => ({
                            value: item.value,
                            label: item.label,
                        }));
                        setSelectedSubsidiary(selectedSubsidiaries);
                    }}
                >
                    <SelectLabel fontFamily="heading">
                    Selecciona Empresa
                    </SelectLabel>
                    <SelectTrigger>
                    <SelectValueText placeholder="Selecciona Subsidiaria" />
                    </SelectTrigger>
                    <SelectContent>
                    {subsidiaries.items.length > 0 && subsidiaries.items.map((item: selectOption) => (
                        <SelectItem item={item} key={item.value}>
                        {item.label}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </SelectRoot>

                <SelectRoot
                    multiple={true}
                    collection={zones}
                    onValueChange={(event) => {
                        const selectedAreas = event.items.map((item: selectOption) => ({
                            value: item.value,
                            label: item.label,
                        }));
                        setSelectedAreas(selectedAreas);
                    }}
                >
                    <SelectLabel fontFamily="heading">
                    Selecciona Ubicación
                    </SelectLabel>
                    <SelectTrigger>
                    <SelectValueText placeholder="Selecciona Subsidiaria" />
                    </SelectTrigger>
                    <SelectContent>
                    {zones.items.length > 0 && zones.items.map((item: selectOption) => (
                        <SelectItem item={item} key={item.value}>
                        {item.label}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </SelectRoot>
                
                <SelectRoot
                    multiple={true}
                    collection={cdc}
                >
                    <SelectLabel fontFamily="heading">
                    Selecciona Centro de consumo
                    </SelectLabel>
                    <SelectTrigger>
                    <SelectValueText placeholder="Selecciona Subsidiaria" />
                    </SelectTrigger>
                    <SelectContent>
                    {cdc.items.length > 0 && cdc.items.map((item: selectOption) => (
                        <SelectItem item={item} key={item.value}>
                        {item.label}
                        </SelectItem>
                    ))}
                    </SelectContent>
                </SelectRoot>

                <SelectRoot
                    multiple={true}
                    collection={status}
                    onValueChange={(event) => {
                        const selectedStatus = event.items.map((item: selectOption) => ({
                            value: item.value,
                            label: item.label,
                        }));
                        setSelectedStatus(selectedStatus);
                    }}
                >
                    <SelectLabel fontFamily="heading">
                    Selecciona Estatus
                    </SelectLabel>
                    <SelectTrigger>
                    <SelectValueText placeholder="Selecciona Subsidiaria" />
                    </SelectTrigger>
                    <SelectContent>
                    {status.items.length > 0 && status.items.map((item: selectOption) => (
                        <SelectItem item={item} key={item.value}>
                        {item.label}
                        </SelectItem>
                    ))}
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

                <GridItem colSpan={1} />

                <Button
                    colorPalette="meraInfo"
                    onClick={() => {
                        console.log("Buscar clicked", {country, selectedSubsidiary, selectedAreas, selectedStatus});
                    }}
                >
                    Buscar
                </Button>
            </Grid>
                
        </Box>
    );
}

export default Home_v2;