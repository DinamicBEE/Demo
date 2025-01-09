import { useEffect, useState } from "react";
import { Box, Flex, Grid, Group, Input, InputAddon, Table, Text } from "@chakra-ui/react";
import { Skeleton } from "@components/ui/skeleton";
import { Button } from "@components/ui/button"
import { Toaster, toaster } from "@components/ui/toaster";
import { NumericFormat } from 'react-number-format';
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { sendCashClousing } from "@services/clousingService";

const ALERTCLOUSING_MODEL= {
  SUCCESS:{
    title: 'Envio exitoso',
    description: 'Corte de caja enviado correctamente',
    type: 'success'
  },
  ERROR:{
    title: 'Error al enviar el corte de caja',
    type: 'error'
  },
  CONFIRM:{
    title: 'Confirmación de envio',
    description: '¿Estás seguro de enviar el corte de caja?',
    type: 'warning'
  }
}

const CashClousing = ({ data }) => {
    const [cashData, setCashData] = useState(true)
    const { cashLoading, getCashData } = useCashClousing();

    useEffect(() => {
      async function fetchData() {
        const cashData = await getCashData(data.id, data.employe);
        console.log(cashData);
        setCashData(cashData);
      }
      fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleInputChange(itemId, value) {
      value = value.split('$')[1]
      if(value.includes(',')) {
        value = value.replace(',', '')
      }

      const updatedData = cashData.currencies.map((item) => {
        if (item.id === itemId) {
          
          return {
            ...item,
            totalFisico: parseFloat(value),
            difference: item.totalPOS - parseFloat(value),
          }
        
        }
        
        return item;
      });

      const newTotalFisico = updatedData.map(currency => currency.totalFisico).reduce((acc, curr) => acc + curr, 0)

      setCashData((prevState) => ({
        ...prevState,
        globalTotalFisico: newTotalFisico,
        globalDifference: cashData.globalTotalPOS - newTotalFisico,
        currencies: updatedData,
      }));

      console.log(cashData);
    }

    function handleChangeTips(value) {
      value = value.split('$')[1]
      if(value.includes(',')) {
        value = value.replace(',', '')
      }
      console.log(value);

      setCashData((prevState) => ({
        ...prevState,
        tips: parseFloat(value),
      }));
    }

    async function sendClousing() {
      console.log(cashData);
      const response = await sendCashClousing(cashData);

      if (response.success) {
        console.log('Corte de caja enviado correctamente');
        showToast(ALERTCLOUSING_MODEL.SUCCESS, null);
      } else{
        console.log('Error al enviar el corte de caja');
        showToast(ALERTCLOUSING_MODEL.ERROR, response.error);
      }
    }

    function showToast(alertModel, error) {
      toaster.create({
        title: alertModel.title,
        type: alertModel.type,
        description: alertModel.type === 'error' ? error : alertModel.description,
        duration: 5000,
      })
    }

    return (
      <Box>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
          gap={4}
          mb={4}
        >
          <Group>
            <InputAddon>Propina electrónica</InputAddon>
            <Skeleton loading={cashLoading}>
              <NumericFormat
                customInput={Input}
                thousandSeparator=","
                decimalSeparator="."
                prefix="$" 
                textAlign="end"
                decimalScale={2} fixedDecimalScale 
                value={cashData.electronicTips || 0} 
                placeholder="Propina electrónica" 
                readOnly 
              />
            </Skeleton>
          </Group>

          <Group>
            <InputAddon>Propina de fondo</InputAddon>
            <Skeleton loading={cashLoading}>
              <NumericFormat 
                customInput={Input}
                thousandSeparator=","
                decimalSeparator="."
                prefix="$" 
                textAlign="end"
                decimalScale={2} fixedDecimalScale
                value={cashData.tips || 0} 
                placeholder="Propina de fondo"
                onChange={(event) => handleChangeTips(event.target.value)}
              />
            </Skeleton>
          </Group>
        </Grid>

        <Toaster />

        <Table.ScrollArea rounded="md" borderWidth="1px">
          <Table.Root size="sm" variant="outline" striped>
            <Table.Header>
              <Table.Row>
                <Table.Cell textAlign="center">Moneda</Table.Cell>
                <Table.Cell textAlign="center">Total POS</Table.Cell>
                <Table.Cell textAlign="center">Total físico</Table.Cell>
                <Table.Cell textAlign="center">Diferencia</Table.Cell>
                <Table.Cell textAlign="center">Tipo de cambio</Table.Cell>
                <Table.Cell textAlign="center">Moneda original</Table.Cell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {cashData?.currencies?.map((item) => (
                <Table.Row key={item.id}>
                  
                  <Table.Cell textAlign="center">
                    <Text>{item.currency}</Text>
                  </Table.Cell>

                  <Table.Cell textAlign="end">
                    <Text>{item.totalPOS}</Text>
                  </Table.Cell>

                  <Table.Cell>
                    <NumericFormat
                      customInput={Input}
                      thousandSeparator=","
                      decimalSeparator="."
                      prefix="$" 
                      textAlign="end"
                      decimalScale={2} fixedDecimalScale
                      value={item.totalFisico  || 0}
                      onChange={(event) => handleInputChange(item.id, event.target.value)}
                    />
                  </Table.Cell>

                  <Table.Cell textAlign="end">
                    <Text>{item.difference}</Text>
                  </Table.Cell>

                  <Table.Cell textAlign="end">
                    <Text>{item.exchangeRate}</Text>
                  </Table.Cell>

                  <Table.Cell textAlign="end">
                    <Text>{item.originalCurrency}</Text>
                  </Table.Cell>

                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        <Box
          p={4}
          mb={2}
          mt={4}
          gap="4"
          justify="space-between"
          display="flex"
          flexDir={{ base: "column", md: "row" }}
        >
          <Flex gap="4" flexDir={{ base: "column", md: "row" }}>
            <Group>
              <InputAddon>Total POS</InputAddon>
              <NumericFormat 
                customInput={Input}
                thousandSeparator=","
                decimalSeparator="."
                prefix="$" 
                textAlign="end"
                decimalScale={2} fixedDecimalScale
                value={cashData.globalTotalPOS || 0} 
                placeholder="Empleado" 
                readOnly 
              />
            </Group>

            <Group>
              <InputAddon>Total físico</InputAddon>
              <NumericFormat 
                customInput={Input}
                thousandSeparator=","
                decimalSeparator="."
                prefix="$" 
                textAlign="end"
                decimalScale={2} fixedDecimalScale
                value={cashData.globalTotalFisico || 0} 
                placeholder="Empleado" 
                readOnly 
              />
            </Group>

            <Group>
              <InputAddon>Diferencia</InputAddon>
              <NumericFormat
                customInput={Input}
                thousandSeparator=","
                decimalSeparator="."
                prefix="$" 
                textAlign="end"
                decimalScale={2} fixedDecimalScale 
                value={cashData.globalDifference || 0} 
                placeholder="Empleado" 
                readOnly 
              />
            </Group>
          </Flex>

          <div>
            <Button size="sm" onClick={() => sendClousing()}>
              Confirmar Corte
            </Button>
          </div>
        </Box>
      </Box>
    );
}

export default CashClousing;
