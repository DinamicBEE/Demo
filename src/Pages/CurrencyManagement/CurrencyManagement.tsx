import { Box, Button, createListCollection, Field, FormatNumber, Grid, GridItem, Heading, HStack, ListCollection, Skeleton, Table } from "@chakra-ui/react";
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
  } from "@components/ui/select"
import { useEffect, useState } from "react";
import { es } from "date-fns/locale/es";
import DatePicker, { registerLocale } from "react-datepicker";
import AddExchangeRate from "./AddExchangeRate";
import FilterEmployee from "@components/FilterEmployee";
import { Employee } from "@models/employee.model";
import { getCurrencies, getEmployees } from "@services/catalogService";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";
import { CurrencyModel } from "@models/common.clousing.model";
registerLocale("es", es);

const pageSize = 5

function CurrencyManagement() {
    const [selectEmployee, setSelectEmployee] = useState<Employee>();
    const [currenciesForSelect, setcurrenciesForSelect] = useState<ListCollection>();
    const [currenciesLocal, setCurrencies] = useState<CurrencyModel[]>([])
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    const [page, setPage] = useState(1)

    const startRange = (page - 1) * pageSize
    const endRange = startRange + pageSize

    const visibleItems = data.slice(startRange, endRange)

    useEffect(()=>{
      async function fetchData() {
        const employeeList: Employee[] =  await getEmployees();
        const currencies = await getCurrencies();

        let createCurrenciList = createListCollection({
          items: currencies
        });

        setEmployees(employeeList);
        setcurrenciesForSelect(createCurrenciList);
        setCurrencies(currencies);
      }

      fetchData();

    },[currenciesLocal])

    const handleChange = (date: Date | null) => {
      console.log(date);
      setStartDate(date);
    };

    const openDiaolog = () => {
      setOpen(true);
    }
  
    const closeDiaolog = () => {
      setOpen(false);
    }

    return (
      <>
        <Box p={6} boxShadow="xl" borderRadius="lg" bg="white">
          <Heading>Gestion de monedas</Heading>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
            gap={4}
            mt={4}
            mb={4}
            w="100%"
            alignItems="end"
          >
            <Field.Root w="100%">
              <Field.Label>Seleccione rango de fechas</Field.Label>
              <DatePicker
                selected={startDate}
                onChange={(ev) => handleChange(ev)}
                locale="es"
              />
            </Field.Root>

            <SelectRoot collection={currenciesForSelect || createListCollection({ items: [] })}>
              <SelectLabel>Select framework</SelectLabel>
              <SelectTrigger>
                <SelectValueText placeholder={"Seleccionar moneda"} />
              </SelectTrigger>
              <SelectContent>
                {currenciesForSelect && currenciesForSelect.items.map((item) => (
                  <SelectItem item={item} key={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>

            <FilterEmployee employees={employees} label={true} onSelect={setSelectEmployee} disabled={false} />
            <Button colorPalette="meraInfo"> Filtrar </Button>
          </Grid>

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
            gap={4}
            mb={4}
            w="100%"
          >
            <GridItem colSpan={1}></GridItem>
            <Button
              colorPalette="meraInfo"
            >
              Exportar a CSV
            </Button>

            <Button
              colorPalette="meraPrimary"
              onClick={() => {
                openDiaolog();
              }}
            >
              Nuevo tipo de cambio
            </Button>
          </Grid>

          <Table.ScrollArea rounded="md" borderWidth="1px">
            <Table.Root variant="outline">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader textAlign="center">
                    Fecha
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">
                    Moneda
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">
                    Empleado
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">
                    Tipo de cambio
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">
                    Nuevo tipo de cambio
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">
                    Total de ventas
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">
                    Nuevo total de ventas
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {visibleItems.map((item) => (
                  <Table.Row key={item.id}>
                    <Table.Cell textAlign="center">{item.date}</Table.Cell>
                    <Table.Cell textAlign="center">{item.currency}</Table.Cell>
                    <Table.Cell textAlign="center">{item.employee}</Table.Cell>
                    <Table.Cell textAlign="center">
                      <FormatNumber
                        value={item.exchangeRate}
                        style="currency"
                        currency={item.currency}
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <FormatNumber
                        value={item.newExchangeRate}
                        style="currency"
                        currency={item.currency}
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <FormatNumber
                        value={item.totalSales}
                        style="currency"
                        currency={item.currency}
                      />
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <FormatNumber
                        value={item.newTotalSales}
                        style="currency"
                        currency={item.currency}
                      />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
          <PaginationRoot count={data.length} pageSize={pageSize} page={page} onPageChange={(e) => setPage(e.page)}>
            <HStack>
              <PaginationPrevTrigger />
              <PaginationItems />
              <PaginationNextTrigger />
            </HStack>
          </PaginationRoot>
        </Box>

        <AddExchangeRate isOpen={open} onClose={closeDiaolog} curriesProps={currenciesLocal} />
      </>
    );

}

export default CurrencyManagement;

const data = [
  {id: 1, date: "10/12/2024", currency: "USD", employee: "Juan Perez", exchangeRate: 20.5, newExchangeRate: 21.5, totalSales: 2550, newTotalSales: 2650},
  {id: 2, date: "11/12/2024", currency: "USD", employee: "Juan Perez", exchangeRate: 21.5, newExchangeRate: 19.5, totalSales: 3550, newTotalSales: 3219.77},
  {id: 3, date: "12/12/2024", currency: "USD", employee: "Manuel Poot", exchangeRate: 19.5, newExchangeRate: 21, totalSales: 5500, newTotalSales: 5923.08},
  {id: 4, date: "13/12/2024", currency: "USD", employee: "Manuel Poot", exchangeRate: 21, newExchangeRate: 20.65, totalSales: 1750, newTotalSales: 1720.83},
  {id: 5, date: "10/12/2024", currency: "EUR", employee: "Juan Perez", exchangeRate: 23.5, newExchangeRate: 23, totalSales: 3550, newTotalSales: 3425.53},
  {id: 6, date: "12/12/2024", currency: "EUR", employee: "Juan Perez", exchangeRate: 23, newExchangeRate: 22.5, totalSales: 7500, newTotalSales: 7336.96},
  {id: 7, date: "16/12/2024", currency: "EUR", employee: "Manuel Poot", exchangeRate: 22.5, newExchangeRate: 23.5, totalSales: 15500, newTotalSales: 16188.89},
  {id: 8, date: "18/12/2024", currency: "EUR", employee: "Manuel Poot", exchangeRate: 23.5, newExchangeRate: 23, totalSales: 3750, newTotalSales: 2370.21},
]

const frameworks = createListCollection({
    items: [
      { label: "React.js", value: "react" },
      { label: "Vue.js", value: "vue" },
      { label: "Angular", value: "angular" },
      { label: "Svelte", value: "svelte" },
    ],
  })