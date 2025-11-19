import { Button, createListCollection, Field, Grid, Group, Input, InputAddon, ListCollection, Skeleton, } from "@chakra-ui/react";
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
import { getCurrencyData, newRegister } from "@services/currencyService";
import { AddExchangeRateProps, CurrenciesDataModel, NewExchangeRate } from "@models/currencyManagement.model";
import { CurrencyInput } from "@components/NumericInput";
registerLocale("es", es);

function AddExchangeRate({isOpen, onClose, curriesProps}: AddExchangeRateProps) {
  const [currenciesForSelect, setcurrenciesForSelect] = useState<ListCollection>();
  const [currencies, setCurrencies] = useState<CurrencyModel[]>([])
  const [currency, setCurrency] = useState<CurrencyModel>()
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [currencyData, setCurrencyData] = useState<NewExchangeRate | null>(null);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  
  useEffect(()=>{
    let createCurrenciList = createListCollection({
      items: curriesProps
    });
    setcurrenciesForSelect(createCurrenciList);
    setCurrencies(curriesProps);
  },[curriesProps])

  function handleChange(date: Date | null) {
    
    setStartDate(date);
  };

  function selectCurrency(value: any) {
    const selectValue = value[0];
    
    const newCurrency = currencies?.filter((item: CurrencyModel) => item.value === selectValue)[0];

    setCurrency(newCurrency);
  }

  async function fectCurrencyData(){
    setConfirmLoading(true);

    if (startDate && currency) {
      const data = await getCurrencyData(startDate, currency.value);
      
      const newRegister: NewExchangeRate = {
        ...data,
        newTotalSale: data.totalSale,
        newExchangeRate: data.exchangeRate,
        userId: 0,
        currencyId: currency.value
      }
      setCurrencyData(newRegister);
      setConfirmLoading(false);
    }
  }

  function handleNewExchangeRate(event: any){
    let value = event.target.value;

    value = value.replace(/^-/, '');

    const decimalParts = value.split('.');
    if (decimalParts.length > 1) {
      value = `${decimalParts[0]}.${decimalParts[1].slice(0, 2)}`;
    }

    const numericValue = parseFloat(value);
 
    if(currencyData && numericValue){

      const newExchangeRate = numericValue;
      const rawTotalSale = (currencyData.totalSale / currencyData.exchangeRate) * newExchangeRate;

      const newTotalSale = Math.ceil(rawTotalSale * 100) / 100;

      setCurrencyData({
        ...currencyData,
        newExchangeRate: newExchangeRate,
        newTotalSale: newTotalSale
      });
    }
  }

  async function handleSave(){

    const fakedata:CurrenciesDataModel={
      id: 1,
      date: "14/03/2025",
      currency: currency?.label || "",
      employee: "Juan Prueba",
      exchangeRate: currencyData?.exchangeRate || 0,
      newExchangeRate: currencyData?.newExchangeRate || 0,
      totalSales: currencyData?.totalSale || 0,
      newTotalSales: currencyData?.newTotalSale || 0
    }
    const response = await newRegister(fakedata);
    //const response = await newRegister(currencyData);
    if(response){
      setCurrencyData(null);
      onClose();
    }
  }

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

          <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={4}
            mt={4}
            mb={4}
            w="100%"
            alignItems="end"
          >
            <Field.Root w="100%">
              <Field.Label>Seleccione fecha</Field.Label>
              <DatePicker
                selected={startDate}
                onChange={(ev) => handleChange(ev)}
                locale="es"
              />
            </Field.Root>

            <SelectRoot collection={currenciesForSelect || createListCollection({ items: [] })}
              onValueChange={(e) => selectCurrency(e.value)}
            >
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

            <Button 
              colorPalette="meraInfo" 
              loading={confirmLoading} 
              loadingText="Buscando..." 
              onClick={()=>fectCurrencyData()}
            > Buscar </Button>
          </Grid>

          {currencyData && <Grid
            templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
            gap={4}
            mb={4}
            w="100%"
            alignItems="end"
          >

            <CurrencyInput name="Total de ventas" value={currencyData.totalSale} loading={false} />

            <Input type="number" min="0" step="0.01" placeholder="tipo de cambio" value={currencyData.newExchangeRate} onChange={(e) => handleNewExchangeRate(e)}/>

            <CurrencyInput name={`Total de ventas ${currency?.label}`} value={currencyData.newTotalSale} loading={false} />

          </Grid>}
          
        </DialogBody>
        <DialogFooter>
          <Button colorPalette="meraError" onClick={onClose}> Cancelar </Button>
          <Button colorPalette="meraPrimary" onClick={()=>handleSave()} > Guardar </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export default AddExchangeRate;

