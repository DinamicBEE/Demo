import {
  Button,
  Flex,
  Text,
  Box,
  Table,
  createListCollection,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { CurrencyInput } from "@components/NumericInput";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
  DialogFooter,
} from "@components/ui/dialog";
interface LoteClosureDialog {
  isOpen: boolean;
  onClose: () => void;
  company: string;
}

const data = createListCollection({
  items: [
    {
      bank: "Banco 1",
      pos: 100,
      corteCaja: 9000,
      lote: -10,
      diferencia: -10,
      table: [
        {
          afiliacion: "Vendedor 1",
          monto: 100,
        },
        {
          afiliacion: "Vendedor 2",
          monto: 100,
        },
        {
          afiliacion: "Vendedor 3",
          monto: 100,
        },
        {
          afiliacion: "Vendedor 4",
          monto: 100,
        },
        {
          afiliacion: "Vendedor 5",
          monto: 100,
        },
        {
          afiliacion: "Vendedor 6",
          monto: 100,
        },
        {
          afiliacion: "Vendedor 7",
          monto: 100,
        },
        {
          afiliacion: "Vendedor 8",
          monto: 100,
        },
        {
          afiliacion: "Vendedor 9",
          monto: 100,
        },
        {
          afiliacion: "Vendedor 10",
          monto: 100,
        },
      ],
    },
    {
      bank: "Banco 2",
      pos: 100,
      corteCaja: 9000,
      lote: -10,
      diferencia: -10,
      table: [
        {
          afiliacion: "Vendedor 1",
          monto: 100,
        },
      ],
    },
    {
      bank: "Banco 3",
      pos: 100,
      corteCaja: 9000,
      lote: -10,
      diferencia: -10,
      table: [
        {
          afiliacion: "Vendedor 1",
          monto: 100,
        },
      ],
    },
    {
      bank: "Banco 4",
      pos: 100,
      corteCaja: 9000,
      lote: -10,
      diferencia: -10,
      table: [
        {
          afiliacion: "Vendedor 1",
          monto: 100,
        },
      ],
    },
    {
      bank: "Banco 5",
      pos: 100,
      corteCaja: 9000,
      lote: -10,
      diferencia: -10,
      table: [
        {
          afiliacion: "Vendedor 1",
          monto: 100,
        },
      ],
    },
  ],
});

function LoteClosureDialog({ isOpen, onClose, company }: LoteClosureDialog) {
  return (
    <DialogRoot
      scrollBehavior="inside"
      size="cover"
      open={isOpen}
      onOpenChange={() => onClose()}
      closeOnEscape={false}
      closeOnInteractOutside={false}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <Flex
              justify="space-between"
              align="center"
              paddingEnd={8}
              direction={{ base: "column", sm: "row" }}
              gap={2}
            >
              <Text>Subsidiaria </Text>
              <Text> Ubicación: 1</Text>
              <Text>Cierre Lote: 22/01/24</Text>
            </Flex>
          </DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
        <DialogBody>
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }}
            gap={4}
            mb={4}
            w="100%"
          >
            <GridItem colSpan={{ base: 1, md: 4 }}>
              <Flex direction="column" gapY={8}>
                <Flex gap={2} direction={{ base: "column", md: "row" }}>
                  <CurrencyInput
                    name={"Total Micros"}
                    value={1000}
                    loading={false}
                  />
                  <CurrencyInput
                    name={"Total lote"}
                    value={1000}
                    loading={false}
                  />
                  <CurrencyInput
                    name={"Diferencia"}
                    value={0}
                    loading={false}
                  />
                </Flex>
                {data.items.length > 0 &&
                  data.items.map((item) => (
                    <Box key={item.bank}>
                      <Text fontWeight="bold" marginBottom={2}>
                        {item.bank}
                      </Text>

                      <Flex gap={2} direction={{ base: "column", md: "row" }}>
                        <CurrencyInput
                          name={"POS"}
                          value={100}
                          loading={false}
                        />
                        <CurrencyInput
                          name={"Corte caja"}
                          value={item.corteCaja}
                          loading={false}
                        />
                        <CurrencyInput
                          name={"Lote"}
                          value={-10}
                          loading={false}
                        />
                        <CurrencyInput
                          name={"Diferencia"}
                          value={item.diferencia}
                          loading={false}
                        />
                      </Flex>

                      <Table.ScrollArea
                        rounded="md"
                        borderWidth="1px"
                        marginTop={6}
                      >
                        <Table.Root size="sm" variant="outline" striped>
                          <Table.Header>
                            <Table.Row>
                              <Table.ColumnHeader textAlign="center">
                                Afililiación
                              </Table.ColumnHeader>
                              <Table.ColumnHeader textAlign="center">
                                Monto
                              </Table.ColumnHeader>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            {item.table.map((row, index) => (
                              <Table.Row key={index}>
                                <Table.Cell textAlign="center">
                                  {row.afiliacion}
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                  {row.monto}
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table.Root>
                      </Table.ScrollArea>
                    </Box>
                  ))}
              </Flex>
            </GridItem>
            <GridItem>
              <Flex direction="column" gap={2}>
                <Text fontWeight="extrabold" textStyle="lg">Número de lotes</Text>
                <Table.ScrollArea rounded="md" borderWidth="1px">
                  <Table.Root size="sm" variant="outline" striped>
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader textAlign="center">
                          Número de lote
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="center">
                          Monto
                        </Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      <Table.Row>
                        <Table.Cell textAlign="center">
                          <Text>1</Text>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                          <Text>1000</Text>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  </Table.Root>
                </Table.ScrollArea>
              </Flex>
            </GridItem>
          </Grid>
        </DialogBody>
        <DialogFooter>
          <Flex gap={2} wrap={"wrap"}>
            <Button
              onClick={onClose}
              className="primary-button"
              width={"auto !important"}
            >
              Cerrar lote
            </Button>
            <Button
              onClick={onClose}
              className="primary-button"
              width={"auto !important"}
            >
              Reabrir lote
            </Button>
            <Button
              onClick={onClose}
              className="primary-button"
              width={"auto !important"}
            >
              Guardar
            </Button>
          </Flex>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export default LoteClosureDialog;
