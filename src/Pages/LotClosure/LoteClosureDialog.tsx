import {
  Button,
  Flex,
  Text,
  Box,
  Table,
  Grid,
  GridItem,
  Spinner,
  Separator,
  Skeleton,
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
import { Bank, LotClosureDialogProps } from "@models/lotClosure.model";
import { useEffect, useState } from "react";

function LoteClosureDialog({ isOpen, onClose, lot }: LotClosureDialogProps) {
  const { updateStatus, setBankCache, fetchBanks, setBanks, loadingBanks } =
    useLotClosureList();
  const [localBanks, setLocalBanks] = useState<Bank[]>([]);
  const handleUpdateStatus = (lotId: number, status: STATUS) => {
    updateStatus(lotId, status);
    onClose();
  };

  const handleUpdateBankAfilations = (
    id: number,
    eventValue: string,
    key?: string
  ) => {
    const cleanValue = Number(eventValue.replace(/[^\d.]/g, ""));
    if (cleanValue < 0) return;
    const updatedBanks = localBanks.map((bank) => {
      if (bank.id === id) {
        const updatedAfilations = bank.afilations.map((afiliation) => {
          if (afiliation.id.toString() === key) {
            return { ...afiliation, amount: cleanValue };
          }
          return afiliation;
        });
        return { ...bank, afilations: updatedAfilations };
      }
      return bank;
    });
    setLocalBanks(updatedBanks);
  };

  const handleSave = () => {
    setBanks(localBanks);
    setBankCache({ [lot.id]: localBanks });
    handleUpdateStatus(lot.id, STATUS.WITH_DIFFERENCE);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen) {
        const banks = await fetchBanks(lot.id);
        setLocalBanks(banks);
      }
    };
    fetchData();
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
                {localBanks.length > 0 &&
                  !loadingBanks &&
                  localBanks.map((bank) => (
                    <Box key={bank.id}>
                      <Text fontWeight="bold" textStyle="md">
                        {bank.bank}
                      </Text>
                      <Separator marginTop={4} marginBottom={4} size={"md"} />
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
                                <Table.Cell textAlign="center" width={"50%"}>
                                  <TableInput
                                    value={affiliation.amount}
                                    onChange={handleUpdateBankAfilations}
                                    currency={true}
                                    keyValue={affiliation.id.toString()}
                                    key={affiliation.id}
                                    id={bank.id}
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
                  <Box gap={4}>
                    <Skeleton height={5} width={20} />
                    <Flex
                      gap={2}
                      direction={{ base: "column", md: "row" }}
                      paddingTop={4}
                    >
                      <CurrencyInput name={"POS"} value={0} loading={true} />
                      <CurrencyInput
                        name={"Corte caja"}
                        value={0}
                        loading={true}
                      />
                      <CurrencyInput name={"Lote"} value={0} loading={true} />
                      <CurrencyInput
                        name={"Diferencia"}
                        value={0}
                        loading={true}
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
                          <Table.Row>
                            <Table.Cell textAlign="center">
                              <Skeleton height="20px" />
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                              <Skeleton height="20px" />
                            </Table.Cell>
                          </Table.Row>
                        </Table.Body>
                      </Table.Root>
                    </Table.ScrollArea>
                  </Box>
                )}
                {localBanks.length === 0 && !loadingBanks && (
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
              onClick={() => handleSave()}
              className="primary-button"
              width={"auto !important"}
              disabled={
                localBanks.length === 0 ||
                localBanks.some((bank) => {
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
