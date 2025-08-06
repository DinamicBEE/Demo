import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody,
  DialogCloseTrigger, DialogFooter } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { StarbucksDetailsProps } from "@models/starbucks.model";
import { Box, Grid, GridItem, Group, Input, InputAddon, Skeleton, Table } from "@chakra-ui/react";
import { CurrencyInput } from "@components/NumericInput";

function DialogDetails({isOpen, onClose}: StarbucksDetailsProps) {
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
                        <Group width={"100%"}>
                          <InputAddon>CDC</InputAddon>
                          <Skeleton loading={false} width={"100%"}>
                            <Input value={"Guacamole Prueba de Header"} placeholder="CDC" readOnly/>
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
                              {/* Aquí se agregarían las filas de datos */}
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
                              {/* Aquí se agregarían las filas de datos */}
                            </Table.Body>

                          </Table.Root>
                        </Table.ScrollArea>

                        
                      </GridItem>
                        
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