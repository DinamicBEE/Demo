import { Button, createListCollection, Field, Grid, Group, Input, InputAddon, ListCollection, Skeleton, HStack, } from "@chakra-ui/react";
import {
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
    SelectContent, SelectItem,
  } from "@components/ui/select"
import { useEffect, useState } from "react";
import { es } from "date-fns/locale/es";
import DatePicker, { registerLocale } from "react-datepicker";
import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle } from "@components/ui/dialog";
import { CurrencyModel } from "@models/common.clousing.model";
registerLocale("es", es);

interface AddExchangeRateProps {
    isOpen:boolean; 
    onClose: () => void;
    curriesProps: CurrencyModel[] | [];
}

function AddExchangeRate({isOpen, onClose, curriesProps}: AddExchangeRateProps) {
  const [currenciesForSelect, setcurrenciesForSelect] = useState<ListCollection>();
  const [currencies, setCurrencies] = useState<CurrencyModel[]>([])
  const [startDate, setStartDate] = useState<Date | null>(null);
  
  useEffect(()=>{
    let createCurrenciList = createListCollection({
      items: curriesProps
    });
    setcurrenciesForSelect(createCurrenciList);
    setCurrencies(curriesProps);
  },[curriesProps])

  const handleChange = (date: Date | null) => {
    console.log(date);
    setStartDate(date);
  };

  return (
    <DialogRoot
      open={isOpen}
      closeOnEscape={false}
      closeOnInteractOutside={false}
      scrollBehavior="inside"
      onOpenChange={() => onClose()}
      size="cover"
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo tipo de cambio</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <HStack w="100%">
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
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

            <Button colorPalette="meraInfo"> Buscar </Button>
          </Grid>
          </HStack>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={4}
            mb={4}
            w="100%"
            alignItems="end"
          >
            <Group w="100%">
              <InputAddon>Total de ventas </InputAddon>
              <Skeleton loading={false}>
                <Input placeholder="No seleccionada" defaultValue={data.totalSales} />
              </Skeleton>
            </Group>

            <Input placeholder="tipo de cambio" defaultValue={"2550"} />

            <Group w="100%">
              <InputAddon>Total de ventas {"Moneda"} </InputAddon>
              <Skeleton loading={false}>
                <Input placeholder="No seleccionada" defaultValue={"2550"} />
              </Skeleton>
            </Group>
          </Grid>
          
        </DialogBody>
        <DialogFooter>
          <Button colorPalette="meraError" onClick={onClose}> Cancelar </Button>
          <Button colorPalette="meraPrimary"> Guardar </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export default AddExchangeRate;

const data = {
  totalSales: 2550,
  exchangeRate: 20.5
}