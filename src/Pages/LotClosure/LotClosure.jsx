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
  Field,
  Flex,
} from "@chakra-ui/react";

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

const dateRange = [
  { value: 1, label: "Hoy" },
  { value: 2, label: "Ayer" },
  { value: 3, label: "Últimos 7 días" },
  { value: 4, label: "Últimos 30 días" },
  { value: 5, label: "Personalizado" },
];

function LotClosure() {
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  /* const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
   */
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
            <SelectRoot collection={companies} size="sm">
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

            {/* <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => {
                setDateRange(update);
              }}
              isClearable={true}
            /> */}

            <SelectRoot collection={locations} size="sm">
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
            <Flex align="center" justify="center">
              <Button className="primary-button">Buscar</Button>
            </Flex>
          </Grid>
        </HStack>
      </VStack>
      <TableOfLotClosure />
    </Box>
  );
}

export default LotClosure;
