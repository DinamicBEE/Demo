import { useState } from "react";
import { Box, Button, createListCollection, Field, Grid, Heading, HStack, ListCollection, VStack, GridItem } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "@components/ui/select";
import { selectOption } from "@models/common.model";
import DatePicker from "../LotClosure/components/DatePicker";


function StarbucksClosure() {

  const [cdc, setCDC] = useState<ListCollection<selectOption>>(
  createListCollection<selectOption>({ items: [] }));
  const [selectedCDC, setSelectedCDC] = useState<number>(0);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  
  return (
    <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
        <VStack align="start">
            <Heading>
                Portal de Starbucks
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
                        collection={cdc}
                        onValueChange={(event) => {
                            const selectedCountries = event.items.map((item: selectOption) => ({
                                value: item.value,
                                label: item.label,
                            }));

                            setSelectedCDC(selectedCountries[0].value);
                        }}
                    >
                        <SelectLabel fontFamily="heading">
                        Centro de consumo
                        </SelectLabel>
                        <SelectTrigger>
                        <SelectValueText placeholder="Selecciona un Centro de consumo" />
                        </SelectTrigger>
                        <SelectContent>
                        {cdc.items.length > 0 && cdc.items.map((item: selectOption) => (
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
                        alignSelf={"flex-end"}
                        onClick={() => {
                            // Implement search logic here
                            console.log("Searching with CDC:", selectedCDC, "Start Date:", startDate, "End Date:", endDate);
                        }}
                        disabled={
                            selectedCDC !== 0 &&
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
    </Box>
  );
}

export default StarbucksClosure;