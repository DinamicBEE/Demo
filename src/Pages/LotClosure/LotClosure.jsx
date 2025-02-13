import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  VStack,
  HStack,
  Heading,
  Text,
  Spinner,
  createListCollection,
  Input,
  Flex,
  Field,
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
import { Alert } from "@components/ui/alert";
import { useLotClosureList } from "@context/lotClosure/lotClosureListContext";
const companies = createListCollection({
  items: [
    { value: 1, label: "Empresa 1" },
    { value: 2, label: "Empresa 2" },
    { value: 3, label: "Empresa 3" },
    { value: 4, label: "Empresa 4" },
    { value: 5, label: "Empresa 5" },
  ],
});

const locations = createListCollection({
  items: [
    { value: 1, label: "Centro de consumo 1" },
    { value: 2, label: "Centro de consumo 2" },
    { value: 3, label: "Centro de consumo 3" },
    { value: 4, label: "Centro de consumo 4" },
    { value: 5, label: "Centro de consumo 5" },
  ],
});


function LotClosure() {
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const { fetchLotClosureData, lotsClosure } = useLotClosureList();

  const search = () => {
    fetchLotClosureData({
      company,
      location,
      startDate,
      endDate,
    });
  };

  return (
    <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
      <VStack spacing={4} align="start">
        <Heading size="md">
          Selecciona empresa, rango de fechas y centro de consumo
        </Heading>

        <HStack w="100%">
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
            gap={4}
            mb={4}
            w="100%"
          >
            <SelectRoot
              collection={companies}
              size="sm"
              onChange={(value) => setCompany(value)}
            >
              <SelectLabel>Empresa</SelectLabel>
              <SelectTrigger>
                <SelectValueText placeholder="Selecciona una empresa" />
              </SelectTrigger>
              <SelectContent>
                {companies.items.map((movie) => (
                  <SelectItem item={movie} key={movie.value}>
                    {movie.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>

            <SelectRoot
              collection={locations}
              size="sm"
              onChange={(value) => setLocation(value)}
            >
              <SelectLabel>Centro de consumo</SelectLabel>
              <SelectTrigger>
                <SelectValueText placeholder="Selecciona un centro de consumo" />
              </SelectTrigger>
              <SelectContent>
                {locations.items.map((movie) => (
                  <SelectItem item={movie} key={movie.value}>
                    {movie.label}
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
            <Flex align="center" justify="center">
              <Button
                className="primary-button"
                onClick={search}
                disabled={!company || !location || !startDate || !endDate}
              >
                Buscar
              </Button>
            </Flex>
          </Grid>
        </HStack>
      </VStack>
      <TableOfLotClosure />
    </Box>
  );
}

export default LotClosure;
