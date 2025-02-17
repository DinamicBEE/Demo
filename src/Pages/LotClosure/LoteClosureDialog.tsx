import {
  Button,
  Flex,
  Text,
  Box,
  Table,
  createListCollection,
  Grid,
  GridItem,
  Spinner,
} from "@chakra-ui/react";
import { CurrencyInput, TableInput } from "@components/NumericInput";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
  DialogFooter,
} from "@components/ui/dialog";
import { useLotClosureList } from "@context/lotClosure/lotClosureListContext";
import { STATUS } from "@models/status.model";
import { LotClosureDialogProps } from "@models/lotClosure.model";
import { useEffect } from "react";

function LoteClosureDialog({ isOpen, onClose, lot }: LotClosureDialogProps) {
  const {
    updateStatus,
    banks,
    fetchBanks,
    updateBankAfilations,
    loadingBanks,
  } = useLotClosureList();
  const handleUpdateStatus = (lotId: number, status: STATUS) => {
    updateStatus(lotId, status);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      fetchBanks(lot.id);
    }
  }, [isOpen]);

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
              <Text>{lot?.company?.name}</Text>
              <Text> Ubicación: {lot?.location?.name}</Text>
              <Text>Cierre Lote: {lot?.dateClosed}</Text>
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
                    value={lot?.totalPOS}
                    loading={false}
                  />
                  <CurrencyInput
                    name={"Total lote"}
                    value={lot?.totalClousing}
                    loading={false}
                  />
                  <CurrencyInput
                    name={"Diferencia"}
                    value={lot?.difference}
                    loading={false}
                  />
                </Flex>
                {banks.length > 0 &&
                  !loadingBanks &&
                  banks.map((bank) => (
                    <Box key={bank.id}>
                      <Text fontWeight="bold" marginBottom={2}>
                        {bank.bank}
                      </Text>

                      <Flex gap={2} direction={{ base: "column", md: "row" }}>
                        <CurrencyInput
                          name={"POS"}
                          value={bank.totalPOS}
                          loading={false}
                        />
                        <CurrencyInput
                          name={"Corte caja"}
                          value={bank.totalClousing}
                          loading={false}
                        />
                        <CurrencyInput
                          name={"Lote"}
                          value={bank.lot}
                          loading={false}
                        />
                        <CurrencyInput
                          name={"Diferencia"}
                          value={bank.difference}
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
                            {bank.afilations.map((affiliation) => (
                              <Table.Row key={affiliation.id}>
                                <Table.Cell textAlign="center">
                                  <Text>{affiliation.name}</Text>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                  <TableInput
                                    value={affiliation.amount}
                                    id={affiliation.id}
                                    currency={false}
                                    onChange={(value) =>
                                      updateBankAfilations(
                                        bank.id,
                                        affiliation.id,
                                        value
                                      )
                                    }
                                  />
                                </Table.Cell>
                              </Table.Row>
                            ))}
                          </Table.Body>
                        </Table.Root>
                      </Table.ScrollArea>
                    </Box>
                  ))}
                {loadingBanks && (
                  <Spinner
                    color={"#66BB6A"}
                    alignSelf="center"
                    size={"xl"}
                    justifyContent={"center"}
                  />
                )}
                {banks.length === 0 && !loadingBanks && (
                  <Text>No hay bancos registrados</Text>
                )}
              </Flex>
            </GridItem>
            <GridItem>
              <Flex direction="column" gap={2}>
                <Text fontWeight="extrabold" textStyle="lg">
                  Número de lotes
                </Text>
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
              onClick={() => handleUpdateStatus(lot.id, STATUS.WITH_DIFFERENCE)}
              className="primary-button"
              width={"auto !important"}
              disabled={
                banks.length === 0 ||
                banks.some((bank) => {
                  return bank.afilations.some(
                    (afiliation) => afiliation.amount === 0
                  );
                })
              }
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
