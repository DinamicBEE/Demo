import { useEffect, useState } from "react";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody,
  DialogCloseTrigger, DialogFooter } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { CashStarbucksModel, StarbucksDetailsProps, TDCStarbucksModel } from "@models/starbucks.model";
import { FormatNumber, Grid, GridItem, Group, Input, InputAddon, Skeleton, Table, Text } from "@chakra-ui/react";
import { CurrencyInput } from "@components/NumericInput";
import { getDetailStarbucks } from "@services/starbucksService";
import { CiSquarePlus } from "react-icons/ci";

function DialogDetails({isOpen, onClose}: StarbucksDetailsProps) {

  const [cashRows, setCashRows] = useState<CashStarbucksModel[]>([]);
  const [tdcRows, setTdcRows] = useState<TDCStarbucksModel[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      const data = await getDetailStarbucks(1);
      setCashRows(data.cash);
      setTdcRows(data.tdc);

      setLoading(false);

    }

    fetchData();

  }, []);

  function openDialog(id: string, item: CashStarbucksModel) {
    // Logic to open dialog with item details
    console.log("Open dialog for item:", id, item);
  }
  
  return (
    <>
        <DialogRoot
          scrollBehavior="inside"
          size="full"
          open={isOpen}
          closeOnEscape={false}
          closeOnInteractOutside={false}
        >
            <DialogContent>
                
                <DialogHeader>
                    <DialogTitle>Corte de caja</DialogTitle>
                    <Grid         
                      templateColumns={{ base: "1fr", md: "repeat(6, 1fr)" }}
                      gap={4}
                      mb={4}
                    >
                      <GridItem colSpan={2}>
                        <Group>
                          <InputAddon>CDC</InputAddon>
                          <Skeleton loading={false} width={"100%"}>
                            <Input value={"Guacamole Prueba de Header"} placeholder="CDC" readOnly />
                          </Skeleton>
                        </Group>
                      </GridItem>

                      <GridItem colSpan={1}>
                        <Group>
                          <InputAddon>Fecha</InputAddon>
                          <Skeleton loading={false} width={"100%"}>
                            <Input value={"06/05/2025"} placeholder="Fecha" readOnly />
                          </Skeleton>
                        </Group>

                      </GridItem>

                      <GridItem colSpan={1}>
                        <CurrencyInput
                          value={1500.00}
                          name={"Total"}
                          loading={false}
                        />

                      </GridItem>
                        
                    </Grid>
                </DialogHeader>

                <DialogBody>
                    <Grid         
                      templateColumns={{ base: "1fr", md: "repeat(6, 1fr)" }}
                      gap={4}
                      mb={4}
                    >
                      <GridItem colSpan={3}>
                        <Table.ScrollArea rounded="md" borderWidth="1px">
                          <Table.Root size="sm" variant="outline">
                            <Table.Header>
                              <Table.Row>
                                <Table.ColumnHeader textAlign="center">
                                  Moneda
                                </Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">
                                  Total
                                </Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">
                                  Tipo de cambio
                                </Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">
                                  Moneda Original
                                </Table.ColumnHeader>
                              </Table.Row>
                            </Table.Header>
                            
                            <Table.Body>
                              {cashRows.length > 0 && 
                                cashRows.map((row:CashStarbucksModel) => (
                                  <Table.Row key={row.id}>
                                    <Table.Cell textAlign="center">
                                      <Text>
                                        {row.currency}
                                      </Text>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                      <>
                                        <Text>
                                          <FormatNumber
                                            value={row.total}
                                            style="currency"
                                            currency="USD"
                                          />
                                        </Text>

                                        <Button marginLeft={4} onClick={() => openDialog(String(row.id), row)}>
                                          <CiSquarePlus />
                                        </Button>
                                      
                                      </>                                    
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                      <Text>
                                        <FormatNumber
                                          value={row.exchangeRate}
                                          style="currency"
                                          currency="USD"
                                        />
                                      </Text>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                      <Text>
                                        <FormatNumber
                                          value={row.originalCurrency}
                                          style="currency"
                                          currency="USD"
                                        />
                                      </Text>
                                    </Table.Cell>
                                  </Table.Row>
                                ))}
                            </Table.Body>

                          </Table.Root>
                        </Table.ScrollArea>
                       
                        
                      </GridItem>

                      <GridItem colSpan={3}>
                        <Table.ScrollArea rounded="md" borderWidth="1px">
                          <Table.Root size="sm" variant="outline">
                            <Table.Header>
                              <Table.Row>
                                <Table.ColumnHeader textAlign="center">
                                  Banco
                                </Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">
                                  Importe
                                </Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">
                                  Tipo de cambio
                                </Table.ColumnHeader>
                                <Table.ColumnHeader textAlign="center">
                                  Monto MXN
                                </Table.ColumnHeader>
                              </Table.Row>
                            </Table.Header>
                            
                            <Table.Body>
                              { tdcRows.length > 0 && 
                                tdcRows.map((row:TDCStarbucksModel) => (
                                  <Table.Row key={row.id}>
                                    <Table.Cell textAlign="center">
                                      <Text>
                                        {row.nameBank}
                                      </Text>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                      <Text>
                                        <FormatNumber
                                          value={row.total}
                                          style="currency"
                                          currency="USD"
                                        />
                                      </Text>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                      <Text>
                                        <FormatNumber
                                          value={row.exchangeRate}
                                          style="currency"
                                          currency="USD"
                                        />
                                      </Text>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                      <Text>
                                        <FormatNumber
                                          value={row.originalCurrency}
                                          style="currency"
                                          currency="USD"
                                        />
                                      </Text>
                                    </Table.Cell>
                                  </Table.Row>
                                ))}
                            </Table.Body>

                          </Table.Root>
                        </Table.ScrollArea>

                        
                      </GridItem>

                      <GridItem colSpan={3} />

                      
                        
                    </Grid>
                </DialogBody>

                <DialogFooter>
                    
                    <Button colorPalette="meraWarning" onClick={()=> onClose()}>Guardar</Button>
                    <Button colorPalette="meraPrimary">Guardar</Button>

                </DialogFooter>

                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    </>
  );
}

export default DialogDetails;