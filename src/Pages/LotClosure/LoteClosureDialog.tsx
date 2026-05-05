import { Button, Flex, Text, Box, Table, Grid, GridItem, Separator,
  Skeleton, Spinner, 
  Textarea,
  Field} from "@chakra-ui/react";
import { CurrencyInput, TableInput } from "@components/NumericInput";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody,
  DialogCloseTrigger, DialogFooter } from "@components/ui/dialog";
import { useLotClosureList } from "@context/lotClosure/lotClosureListContext";
import { useHandleAffiliationsData } from "@hooks/affiliations/useHandleAffiliationsData";
import { Bank, BankUpdate, LotClosure, LotClosureDialogProps } from "@models/lotClosure.model";
import { STATUS } from "@models/const/status.const";
import { useEffect, useState } from "react";
import { toast } from "../../utils/index";
import { updateBatchClosing } from "@services/lotClosureService";

function LoteClosureDialog({ isOpen, onClose, lot, date }: LotClosureDialogProps) {
  const { updateBank, fetchBanks, loadingBanks, updateBankLoading, error } =
    useLotClosureList();
  const [localBanks, setLocalBanks] = useState<BankUpdate>({ bank: [], bankCopy: []} as BankUpdate);
  const [openCloseLot, setOpenCloseLot] = useState(false);
  const [isPresave, setIsPresave] = useState(false);
  const { handleInputData } = useHandleAffiliationsData();
  const [localLot, setLocalLot] = useState<LotClosure>({} as LotClosure);
  const [isLoading, setIsLoading] = useState(false);
  const [existDiference, setExistDiference] = useState(false);

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

  useEffect(() => {
    const existDiference = localBanks.bank.some((bank) => bank.difference !== 0 && bank.comment?.length === 0);
    setExistDiference(existDiference);
  }, [localBanks]);
  

  const handleOpenCloseLot = (isPresave: boolean) => {
    setOpenCloseLot(true);
    setIsPresave(isPresave)
  };

  const handleSave = async () => {
    await updateBank(localBanks, localLot, isPresave);
    if (error === "") {
      setOpenCloseLot(false);
      onClose(true);
      const message = isPresave ? "Lote guardado correctamente" : "Lote cerrado correctamente";
      toast(message, "success");
    }
  };

  const handleUpdateBatch = async () => {
    setIsLoading(true);
    const batchId = localBanks?.bank[0]?.batchClosureId;
    const responseStatus = await updateBatchClosing(batchId);
    if (responseStatus) {
      toast("Lote actualizado, volver a abrir el diálogo para ver los cambios", "success");
      onClose(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (isOpen) {
        setLocalLot(lot);
        const banks = await fetchBanks(lot.consumerCenterId, date, Number(lot.id));
        const sortedBanks = [...banks.bank].sort((a, b) => 
          a.bankTerminalName.localeCompare(b.bankTerminalName)
        );
        setLocalBanks(banks);
        cleanNameBank(sortedBanks);
      }
    };
    
    fetchData();
  }, [isOpen]);

  const cleanNameBank = (banks: Bank[]) => {
    const cleanedBanks = banks.map((bank) => {
      const cleanedName = bank.bankTerminalName.replace(/^TPV\s*/i, '');
      return {
        ...bank,
        bankTerminalName: cleanedName
      };
    });
    setLocalBanks( (prev) => { return { ...prev, bank: cleanedBanks}} );
  }

  return (
    <>
      <DialogRoot
        scrollBehavior="inside"
        size="full"
        open={isOpen}
        onOpenChange={() => onClose(false)}
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
                <Text>{lot.subsidiary}</Text>
                <Text> Ubicación: {lot.consumerCenter}</Text>
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
              <GridItem colSpan={{ base: 1, md: 5 }}>
                <Flex direction="column" gapY={8}>
                  <Flex gap={2} direction={{ base: "column", md: "row" }}>
                    <CurrencyInput
                      name={"Total Micros"}
                      value={localLot?.totalPos}
                      loading={false}
                    />
                    <CurrencyInput
                      name={"Total lote"}
                      value={localLot?.totalLote}
                      loading={false}
                    />
                    <CurrencyInput
                      name={"Diferencia"}
                      value={localLot?.difference}
                      loading={false}
                    />
                    {/* <Button
                      onClick={handleUpdateBatch}
                      loading={isLoading}
                      colorPalette="meraWarning"
                      disabled={
                        localBanks.bank.length === 0
                        || localBanks.bank[0].batchClosureId === null
                        || localBanks.bank[0].affiliationList.length === 0
                        || loadingBanks
                        || isLoading
                        || localLot.status === STATUS.Close
                        || localLot.status === STATUS.WITH_DIFFERENCE
                        || localLot.isRoleEditable === false }
                    >
                      Actualizar Lote
                    </Button> */}
                  </Flex>
                  {localBanks.bank.length > 0 &&
                    !loadingBanks &&
                    localBanks.bank.map((bank) => (
                      <Box key={bank.batchDetailsId}>
                        <Text fontWeight="bold" textStyle="md">
                          {bank.bankTerminalName}
                        </Text>
                        <Separator marginTop={4} marginBottom={4} size={"md"} />
                        <Flex gap={2} direction={{ base: "column", md: "row" }}>
                          <CurrencyInput
                            name={"POS"}
                            value={bank.totalPos}
                            loading={false}
                          />
                          <CurrencyInput
                            name={"Corte caja"}
                            value={bank.totalPos}
                            loading={false}
                          />
                          <CurrencyInput
                            name={"Lote"}
                            value={bank.totalBatch}
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
                              {bank.affiliationList.map((affiliation) => (
                                <Table.Row key={affiliation.affiliationId}>
                                  <Table.Cell textAlign="center">
                                    <Text>{affiliation.affiliation}</Text>
                                  </Table.Cell>
                                  <Table.Cell textAlign="center" width={"50%"}>
                                    <TableInput
                                      value={affiliation.amount}
                                      onChange={handleUpdateBankAfilations}
                                      currency={true}
                                      disabled={
                                        lot.status === STATUS.Close ||
                                        lot.status === STATUS.WITH_DIFFERENCE ||
                                        localLot.isRoleEditable === false
                                      }
                                      keyValue={affiliation.affiliationId.toString()}
                                      key={affiliation.affiliationId}
                                      id={bank.bankTerminalId}
                                    />
                                  </Table.Cell>
                                </Table.Row>
                              ))}
                            </Table.Body>
                          </Table.Root>
                        </Table.ScrollArea>
                              <Field.Root required={bank.difference !== 0} marginTop={4}>
                                <Field.Label>Comentario {Number(bank.difference.toFixed(2)) !== 0 &&<Field.RequiredIndicator />}</Field.Label>
                                <Textarea 
                                  maxLength={249}
                                  placeholder={bank.difference+" Comentario requierido si existe diferencia."}
                                  value={bank.comment}
                                  onChange={(e) => {
                                    handleUpdateBankAfilations(bank.bankTerminalId, e.target.value, "comment")
                                  }}/>
                              </Field.Root>
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
                  {localBanks.bank.length === 0 && !loadingBanks && (
                    <Text>No hay bancos registrados</Text>
                  )}
                </Flex>
              </GridItem>
            </Grid>
          </DialogBody>
          <DialogFooter>
            <Flex gap={2} wrap={"wrap"}>
              <Button
                colorPalette="meraWarning"
                disabled={
                  isLoading
                  ? true 
                  : lot.status === STATUS.Close
                    || lot.status === STATUS.WITH_DIFFERENCE
                    || localLot.isRoleEditable === false 
                    ? true
                    : localBanks.bank.length === 0 || localLot.totalPos === null 
                      ? false
                      : false
                }
                onClick={() => handleOpenCloseLot(true)}
              >
                Guardar lote
              </Button>
              <Button
                disabled={
                  isLoading
                  ? true 
                  : lot.status === STATUS.Close
                    || lot.status === STATUS.WITH_DIFFERENCE
                    || localLot.isRoleEditable === false 
                    ? true
                    : localBanks.bank.length === 0 || localLot.totalPos === null 
                      ? false
                      : false
                }
                onClick={() => handleOpenCloseLot(false)}
                colorPalette="meraPrimary"
              >
                Confirmar lote
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
              { isPresave ? "El lote se guardará con la información actual." : localLot?.difference === 0
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
                disabled={updateBankLoading || existDiference || localLot.status === STATUS.Close}
                onClick={() => handleSave()}
                colorPalette="meraPrimary"
                width={"auto !important"}
              >
                {updateBankLoading ? <Spinner color={"#fff"} /> : isPresave ? "Guardar lote" : "Cerrar lote"}
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