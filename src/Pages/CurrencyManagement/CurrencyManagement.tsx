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
import { CurrenciesDataModel } from "@models/currencyManagement.model";
import { getCurrenciesExchangeRate } from "@services/currencyService";
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
    const [dataBase, setDataBase] = useState<CurrenciesDataModel[]>([])
    const [visibleItems, setVisibleItems] = useState<CurrenciesDataModel[]>([])

    const startRange = (page - 1) * pageSize
    const endRange = startRange + pageSize
    
    useEffect(()=>{
      async function fetchData() {

        const data = await getCurrenciesExchangeRate("body");
        console.log(data);
        setDataBase(data);
        const items = data?.slice(startRange, endRange)//data.slice(startRange, endRange)
        setVisibleItems(items)

      }
      fetchData();
    },[])
    
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

    useEffect(() => {
      handleDataVisible(page)
    }, [page])

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

    const handleDataVisible = (page: number) => {
      setPage(page);
      const items = dataBase.slice(startRange, endRange)
      setVisibleItems(items)
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
              <SelectLabel>Seleccionar moneda</SelectLabel>
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
            {/* <Button
              colorPalette="meraInfo"
            >
              Exportar a CSV
            </Button> */}

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
          <PaginationRoot count={dataBase.length} pageSize={pageSize} page={page} onPageChange={(e) => setPage(e.page)}>
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
