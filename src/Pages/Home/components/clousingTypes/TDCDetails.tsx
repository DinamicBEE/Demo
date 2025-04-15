import { useEffect, useState } from "react";
import { Box, Field, Flex, FormatNumber, Input, Table, Text, HStack } from "@chakra-ui/react";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";
import { Checkbox } from "@components/ui/checkbox";
import { CurrencyInput } from "@components/NumericInput";
import { useTDCContext } from "@context/clousing/tdcClousingContex";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle,
  DialogBody, DialogCloseTrigger, DialogFooter } from "@components/ui/dialog";
import { BankDetails, BankLineDetails, DetailsProp } from "@models/tdc.model";
import { validateDetails } from "@services/clousingService";
import { Button } from "@components/ui/button";
import { useHandleTDC } from "@hooks/tdcClousing/useTDCClousing";
import Loading from "@components/Loading";
import DialogFiles from "./DialogFiles";
import { useTDCAdyenContext } from "@context/clousing/tdcAdyenContext";
import { useHandleTDCAdyen } from "@hooks/tdcClousing/useTDCAdyenClousing";
import { ProcessResult } from "@models/adyen.model";
import DialogConfirmTDC from "./DialogConfirmTDC";

const pageSize = 10

function TDCDetails({ clousingId, lineId, isOpen, onClose,
  closingConfirmation, location, subsidiary, voucherData}: DetailsProp) {
  const [detailsLocal, setDetailsLocal] = useState<BankDetails | undefined>({} as BankDetails);
  const [loading, setLoading] = useState<boolean>(false);
  const { dataFilesProcess, setDataFilesProcess } = useTDCAdyenContext();
  const [isOpenDialogFiles, setIsOpenDialogFiles] = useState<boolean>(false);
  const { updateLocalBanksAdyen, updateLocalBanksTotal } = useHandleTDCAdyen();
  const [isOpenDialogSave, setIsOpenDialogSave] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<BankLineDetails[]>([])

  const startRange = (page - 1) * pageSize
  const endRange = startRange + pageSize

  const { updateLineClousing, handleInputData } = useHandleTDC(
    clousingId,
    lineId ?? 0
  );
  const { getDetails, detailsLoading, setDetails } = useTDCContext();

  useEffect(() => {
    async function fetchData() {
      const detailsData: BankDetails = voucherData;
      // const detailsData: BankDetails = await getDetails(clousingId, lineId);

      if (detailsData) {
        setDetailsLocal(detailsData);
      }

      const items = detailsData?.details?.slice(startRange, endRange) || [];
      setVisibleItems(items);
    }

    fetchData();
  }, [lineId]);

  useEffect(() => {
    setPage(page);
    const items = detailsLocal?.details?.slice(startRange, endRange) || [];
    setVisibleItems(items);
  }, [page, detailsLocal])

  useEffect(() => {
    if (!dataFilesProcess.consolidatedData || !detailsLocal?.details) {
      return;
    }
    updateLocalBanksAdyen(dataFilesProcess, detailsLocal, setDetailsLocal);
  }, [dataFilesProcess.consolidatedData]);

  const isCheckValid = (
    check: boolean | undefined,
    vouchers:
      | {
          date: string | null;
          check: string | null;
          amount: string | null;
          general: string | null;
        }
      | undefined
  ) => {
    if (check === undefined) return "";

    if (check && !vouchers) return "bg.success";

    if (!vouchers) return "red.200";

    const hasDifferences =
      vouchers.date ||
      vouchers.check ||
      vouchers.amount ||
      vouchers.general;

    if (check && !hasDifferences) {
      return "bg.success";
    }
    if (check && hasDifferences) {
      return "bg.warning";
    }
    return "red.200";
  };

  async function saveDetails() {
    if (closingConfirmation) return;

    setLoading(true);

    if (lineId !== null && detailsLocal !== undefined) {
      if (detailsLocal.bankName !== "ADYEN") {
        const detailsValidated: BankDetails = await validateDetails(
          clousingId,
          lineId,
          detailsLocal
        );

        setDetailsLocal(detailsValidated);

        setDetails(detailsValidated, clousingId, lineId);

        const allSuccess = detailsValidated.details.every(
          (item) => item.success
        );

        if (allSuccess) {
          updateLineClousing(detailsValidated);
          onClose();
        
        }
        setIsOpenDialogSave(false);
      } else if (detailsLocal.bankName === "ADYEN") {
        const detailsValidated: BankDetails = await validateDetails(
          clousingId,
          lineId,
          detailsLocal
        );
        setDetailsLocal(detailsValidated);
        setDetails(detailsValidated, clousingId, lineId);
        updateLineClousing(detailsValidated);
        onClose();
        setIsOpenDialogSave(false);
      }

      setLoading(false);
    }
  }

  return (
    <>
      <DialogRoot
        open={isOpen}
        closeOnEscape={false}
        closeOnInteractOutside={false}
        scrollBehavior="inside"
        onOpenChange={() => {
          onClose(), setDataFilesProcess({} as ProcessResult);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detailsLocal?.bankName}</DialogTitle>
          </DialogHeader>

          <DialogBody>
            {detailsLocal?.bankName === "ADYEN" && (
              <Button
                colorPalette="meraPrimary"
                marginBottom={4}
                size={"xs"}
                width={"50% !important"}
                onClick={() => setIsOpenDialogFiles(true)}
              >
                Subir archivos
              </Button>
            )}
            <Table.ScrollArea borderWidth="1px" rounded="md">
              <Table.Root size="sm" variant="outline">
                <Table.Header>
                  <Table.Row bg="bg.subtle">
                    {detailsLocal?.bankName === "ADYEN" && (
                      <Table.ColumnHeader textAlign="center">
                        <Checkbox
                          top="1"
                          aria-label="Select row"
                          checked={detailsLocal.details.every(
                            (item) => item.successAdyen
                          )}
                          disabled={
                            dataFilesProcess &&
                            dataFilesProcess.consolidatedData
                              ? false
                              : true
                          }
                          onCheckedChange={(changes) => {
                            const updatedDetails = detailsLocal.details.map(
                              (detail) => ({
                                ...detail,
                                successAdyen: changes.checked as boolean,
                              })
                            );
                            const updatedDetailsLocal = {
                              ...detailsLocal,
                              details: updatedDetails,
                            };
                            setDetailsLocal(updatedDetailsLocal);
                            updateLocalBanksTotal(
                              updatedDetailsLocal,
                              setDetailsLocal
                            );
                          }}
                        />
                      </Table.ColumnHeader>
                    )}
                    <Table.ColumnHeader textAlign="center">
                      Fecha de cierre
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      No. Cheque
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">
                      Importe
                    </Table.ColumnHeader>
                    {detailsLocal?.bankName === "ADYEN" && (
                      <Table.ColumnHeader textAlign="center">
                        Diferencias
                      </Table.ColumnHeader>
                    )}
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {visibleItems?.map((item: BankLineDetails) => (
                    <Table.Row
                      key={item.id}
                      backgroundColor={isCheckValid(
                        item.successAdyen,
                        item.vouchers
                      )}
                    >
                      {detailsLocal?.bankName === "ADYEN" && (
                        <Table.Cell>
                          <Checkbox
                            top="1"
                            aria-label="Select row"
                            checked={item.successAdyen}
                            disabled={
                              dataFilesProcess &&
                              dataFilesProcess.consolidatedData
                                ? false
                                : true
                            }
                            onCheckedChange={(changes) => {
                              const updatedDetails = visibleItems.map(
                                (detail) =>
                                  detail.id === item.id
                                    ? {
                                        ...detail,
                                        successAdyen:
                                          changes.checked as boolean,
                                      }
                                    : detail
                              );
                              const updatedDetailsLocal = {
                                ...detailsLocal,
                                details: updatedDetails,
                              };
                              setDetailsLocal(updatedDetailsLocal);
                              updateLocalBanksTotal(
                                updatedDetailsLocal,
                                setDetailsLocal
                              );
                            }}
                          />
                        </Table.Cell>
                      )}
                      <Table.Cell textAlign="center">
                        <Text>{item.date}</Text>
                      </Table.Cell>

                      <Table.Cell>
                        {detailsLocal?.bankName !== "ADYEN" ? (
                          <Field.Root
                            invalid={item.success != undefined && !item.success}
                          >
                            <Input
                              textAlign="center"
                              value={item.check}
                              disabled={closingConfirmation}
                              onChange={(e) =>
                                handleInputData(
                                  e.target.value,
                                  item.id,
                                  detailsLocal || ({} as BankDetails),
                                  setDetailsLocal
                                )
                              }
                            />
                            <Field.ErrorText>{item.message}</Field.ErrorText>
                          </Field.Root>
                        ) : (
                          <Text>{item.check}</Text>
                        )}
                      </Table.Cell>

                      <Table.Cell textAlign="end">
                        <Text>
                          <FormatNumber
                            value={item.amount}
                            style="currency"
                            currency="USD"
                          />
                        </Text>
                      </Table.Cell>
                      {detailsLocal?.bankName === "ADYEN" && (
                        <Table.Cell textAlign="center">
                          <Text>{item.vouchers?.date}</Text>
                          <Text>{item.vouchers?.check}</Text>
                          <Text>{item.vouchers?.amount}</Text>
                          <Text>{item.vouchers?.general}</Text>
                        </Table.Cell>
                      )}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
            <PaginationRoot count={detailsLocal?.details?.length ?? 0} pageSize={pageSize} page={page} onPageChange={(e) => setPage(e.page)}>
              <HStack>
                <PaginationPrevTrigger />
                <PaginationItems />
                <PaginationNextTrigger />
              </HStack>
            </PaginationRoot>

            {detailsLoading && (
              <Box position="fixed" top="50%" left="50%" zIndex="1">
                <Loading />
              </Box>
            )}
          </DialogBody>

          <DialogFooter>
            <Flex gap={4}>
              <CurrencyInput
                value={detailsLocal?.total}
                name={"Total"}
                loading={detailsLoading || false}
              />

              <Button
                colorPalette="meraPrimary"
                //   onClick={() => saveDetails()}
                onClick={() => setIsOpenDialogSave(true)}
                disabled={
                  closingConfirmation || 
                  (detailsLocal?.bankName === "ADYEN" && !(dataFilesProcess && dataFilesProcess.consolidatedData))
                }
              >
                Guardar
              </Button>
            </Flex>
          </DialogFooter>

          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
      <DialogFiles
        isOpen={isOpenDialogFiles}
        location={location}
        subsidiary={subsidiary}
        onClose={() => setIsOpenDialogFiles(false)}
      />
      <DialogConfirmTDC
        isOpen={isOpenDialogSave}
        onAccept={saveDetails}
        onClose={() => setIsOpenDialogSave(false)}
        nameBank={detailsLocal?.bankName || ""}
        loading={loading}
      />
    </>
  );
}

export default TDCDetails;
