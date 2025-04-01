import {
  Button,
  Flex,
  Text,
  Box,
  Table,
  Grid,
  GridItem,
  Separator,
  Skeleton,
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
import { useHandleAffiliationsData } from "@hooks/affiliations/useHandleAffiliationsData";
import {
  Bank,
  LotClosure,
  LotClosureDialogProps,
} from "@models/lotClosure.model";
import { STATUS } from "@models/status.model";
import { useEffect, useState } from "react";
import { toast } from "../../utils/index";

function LoteClosureDialog({ isOpen, onClose, lot,company,location }: LotClosureDialogProps) {
  const { updateBank, fetchBanks, loadingBanks, updateBankLoading } =
    useLotClosureList();
  const [localBanks, setLocalBanks] = useState<Bank[]>([]);
  const [openCloseLot, setOpenCloseLot] = useState(false);
  const { handleInputData } = useHandleAffiliationsData();
  const [localLot, setLocalLot] = useState<LotClosure>({} as LotClosure);

  const handleUpdateBankAfilations = (
    id: number | string,
    eventValue: string,
    key?: string
  ) => {
    handleInputData(
      id,
      eventValue,
      setLocalBanks,
      localBanks,
      localLot,
      setLocalLot,
      key
    );
  };

  const handleOpenCloseLot = () => {
    setOpenCloseLot(true);
  };

  const handleSave = async () => {
    await updateBank(localLot.id, localBanks, localLot);
    setOpenCloseLot(false);
    onClose();
    toast("Lote cerrado correctamente", "success");
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen) {
        setLocalLot(lot);
        const banks = await fetchBanks(lot.id);
        setLocalBanks(banks);
      }
    };
    fetchData();
  }, [isOpen]);

  return (
    <>
      <DialogRoot
        scrollBehavior="inside"
        size="full"
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
                <Text>{company.name}</Text>
                <Text> Ubicación: {location.name}</Text>
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
                      value={localLot?.totalPOS}
                      loading={false}
                    />
                    <CurrencyInput
                      name={"Total lote"}
                      value={localLot?.totalLot}
                      loading={false}
                    />
                    <CurrencyInput
                      name={"Diferencia"}
                      value={localLot?.difference}
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
                          <Table.Root size="sm" variant="outline">
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
                                      disabled={lot.status === STATUS.CLOSED || lot.status === STATUS.WITH_DIFFERENCE}
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
                    <Table.Root size="sm" variant="outline" interactive={false}>
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
                hidden={lot.status === STATUS.CLOSED || lot.status === STATUS.WITH_DIFFERENCE}
                onClick={() => handleOpenCloseLot()}
                colorPalette="meraInfo"
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
      <DialogRoot
        role="alertdialog"
        open={openCloseLot}
        onOpenChange={() => setOpenCloseLot(false)}
        closeOnEscape={false}
        closeOnInteractOutside={false}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              ¿Estás seguro de cerrar el lote seleccionado?
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p>
              {localLot?.difference === 0
                ? "El lote se cerrará sin diferencias"
                : "El lote se cerrará con diferencias"}
            </p>
          </DialogBody>
          <DialogFooter>
            <Flex gap={2} wrap={"wrap"}>
              <Button
                onClick={() => setOpenCloseLot(false)}
                colorPalette="meraError"
                width={"auto !important"}
                disabled={updateBankLoading}
              >
                Cancelar
              </Button>
              <Button
                disabled={updateBankLoading}
                onClick={() => handleSave()}
                colorPalette="meraPrimary"
                width={"auto !important"}
              >
                {updateBankLoading ? <Spinner color={"#fff"} /> : "Cerrar lote"}
              </Button>
            </Flex>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </>
  );
}

export default LoteClosureDialog;
