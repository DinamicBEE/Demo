import { useState } from "react";
import { Box, Flex, Grid, Group, Input, InputAddon, Table, Text } from "@chakra-ui/react";
import { Skeleton } from "@components/ui/skeleton";
import { Button } from "@components/ui/button"


const CashClousing = () => {
    const [loading, setLoading] = useState(true)

    return (
      <Box>
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
          gap={4}
          mb={4}
        >
          <Group attached>
            <InputAddon>Propina electrónica</InputAddon>
            <Skeleton loading={loading}>
              <Input value={9622.32} placeholder="Empleado" />
            </Skeleton>
          </Group>

          <Group attached>
            <InputAddon>Propina de fondo</InputAddon>
            <Skeleton loading={loading}>
              <Input value={9119.32} placeholder="Empleado" />
            </Skeleton>
          </Group>
        </Grid>

        <Table.ScrollArea rounded="md" borderWidth="1px">
          <Table.Root size="sm" variant="outline" striped>
            <Table.Header>
              <Table.Row>
                <Table.Cell>Moneda</Table.Cell>
                <Table.Cell>Total POS</Table.Cell>
                <Table.Cell>Total físico</Table.Cell>
                <Table.Cell>Diferencia</Table.Cell>
                <Table.Cell>Tipo de cambio</Table.Cell>
                <Table.Cell>Moneda original</Table.Cell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {money.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>
                    <Text>{item.currency}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{item.totalPOS}</Text>
                  </Table.Cell>
                  <Table.Cell>{item.totalFisico}</Table.Cell>
                  <Table.Cell>
                    <Text>{item.difference}</Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text>{item.exchangeRate}</Text>
                  </Table.Cell>
                  <Table.Cell>
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
            <Group attached>
              <InputAddon>Total POS</InputAddon>
              <Input value={9622.32} placeholder="Empleado" />
            </Group>

            <Group attached>
              <InputAddon>Total físico</InputAddon>
              <Input value={9119.32} placeholder="Empleado" />
            </Group>

            <Group attached>
              <InputAddon>Diferencia</InputAddon>
              <Input value={0} placeholder="Empleado" />
            </Group>
          </Flex>

          <div>
            <Button size="sm" onClick={() => setLoading((c) => !c)}>
              Toggle
            </Button>
          </div>
        </Box>
      </Box>
    );
}

export default CashClousing;

const money = [
        {id:1, currency: "MXN", totalPOS: 1000, totalFisico: 1000, difference: 0, exchangeRate: 1, originalCurrency: 20},
        {id:2, currency: "USD", totalPOS: 1000, totalFisico: 1000, difference: 0, exchangeRate: 1, originalCurrency: 10},
        {id:3, currency: "EUR", totalPOS: 1000, totalFisico: 1000, difference: 0, exchangeRate: 1, originalCurrency: 5},
        {id:4, currency: "LIB", totalPOS: 1000, totalFisico: 1000, difference: 0, exchangeRate: 1, originalCurrency: 2},
        {id:5, currency: "CAN", totalPOS: 1000, totalFisico: 1000, difference: 0, exchangeRate: 1, originalCurrency: 1}
    ]
