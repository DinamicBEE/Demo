import { useEffect, useState, useRef } from "react";
import {
  Box,
  Field,
  Flex,
  FormatNumber,
  Input,
  Table,
  Text,
  Group,
  InputAddon,
  Skeleton,
  HStack,
} from "@chakra-ui/react";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@components/ui/pagination";
import { Checkbox } from "@components/ui/checkbox";
import { CurrencyInput } from "@components/NumericInput";
import { useTDCContext } from "@context/clousing/tdcClousingContex";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
  DialogFooter,
} from "@components/ui/dialog";
import { BankLineModel, Voucher, DetailsProp } from "@models/tdc.model";
import { validateDetails } from "@services/clousingService";
import { Button } from "@components/ui/button";
import { useHandleTDC } from "@hooks/tdcClousing/useTDCClousing";
import Loading from "@components/Loading";
import DialogFiles from "./DialogFiles";
import { useTDCAdyenContext } from "@context/clousing/tdcAdyenContext";
import { useHandleTDCAdyen } from "@hooks/tdcClousing/useTDCAdyenClousing";
import { ProcessResult } from "@models/adyen.model";
import DialogConfirmTDC from "./DialogConfirmTDC";
import FilterVoucher from "@components/FilterVouchers";

const pageSize = 10;

function TDCDetails({
  clousingId,
  lineId,
  isOpen,
  onClose,
  closingConfirmation,
  location,
  subsidiary,
  bankDetails,
}: DetailsProp) {
  const [detailsLocal, setDetailsLocal] = useState<BankLineModel | undefined>(
    {} as BankLineModel
  );
  const [loading, setLoading] = useState<boolean>(false);
  const { dataFilesProcess, setDataFilesProcess } = useTDCAdyenContext();
  const [isOpenDialogFiles, setIsOpenDialogFiles] = useState<boolean>(false);
  const { updateLocalBanksAdyen, updateLocalBanksTotal } = useHandleTDCAdyen();
  const [isOpenDialogSave, setIsOpenDialogSave] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [chequeValue, setChequeValue] = useState("");
  const [visibleItems, setVisibleItems] = useState<Voucher[]>([]);
  const [localAmount, setLocalAmount] = useState<number>(0);
  // const [selectedVouchers, setSelectedVouchers] = useState<Voucher[]>([]);
  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  const { updateLineClousing, handleInputData } = useHandleTDC(
    clousingId,
    lineId ?? 0
  );
  const { getDetails, detailsLoading, setDetails } = useTDCContext();

  useEffect(() => {
    async function fetchData() {
      if (lineId === null) return;
      setPage(page);
      setVisibleItems(
        bankDetails.vouchers
          .filter((item) => item.status)
          .slice(startRange, endRange)
      );
      setDetailsLocal(bankDetails);
      setLocalAmount(
        bankDetails.vouchers
          .filter((item) => item.status)
          .reduce((acc, curr) => acc + curr.amount, 0)
      );
    }

    fetchData();
  }, [lineId]);

  useEffect(() => {
    if (lineId === null) return;
    setPage(page);
    const items = bankDetails.vouchers
      .filter((item) => item.status)
      .slice(startRange, endRange);
    setVisibleItems(items);
  }, [page]);

  useEffect(() => {
    if (!dataFilesProcess.consolidatedData || !detailsLocal?.vouchers) {
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
      vouchers.date || vouchers.check || vouchers.amount || vouchers.general;

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
      if (detailsLocal.bank !== "ADYEN") {
        console.log("detailsLocal on Save", detailsLocal);

        //  setDetails(detailsLocal, clousingId, lineId);
        updateLineClousing(detailsLocal);
        onClose();
        setIsOpenDialogSave(false);
      } else if (detailsLocal.bank === "ADYEN") {
        const detailsValidated: BankLineModel = await validateDetails(
          clousingId,
          lineId,
          // selectedVouchers,
          detailsLocal.vouchers.filter((item) => item.status),
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

  const onSelect = (item: Voucher) => {
    const updatedDetails = detailsLocal?.vouchers.map((voucher) =>
      voucher.id === item.id && voucher.amount === item.amount
        ? {
            ...voucher,
            status: true, // Convert boolean to string
          }
        : voucher
    );
    console.log("updatedDetails", updatedDetails);

    if (updatedDetails === undefined) return;
    if (detailsLocal === undefined) return;

    const updatedDetailsLocal: BankLineModel = {
      ...detailsLocal,
      vouchers: updatedDetails as Voucher[],
    };

    setDetailsLocal(updatedDetailsLocal);
    setVisibleItems(
      updatedDetailsLocal.vouchers
        .filter((item) => item.status)
        .slice(startRange, endRange)
    );
    setLocalAmount(
      updatedDetailsLocal.vouchers
        .filter((item) => item.status)
        .reduce((acc, curr) => acc + curr.amount, 0)
    );
  };

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
            <DialogTitle>{detailsLocal?.bank}</DialogTitle>
          </DialogHeader>

          <DialogBody>
            {detailsLocal?.bank === "ADYEN" && (
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

            {detailsLocal?.bank != "ADYEN" && (
              <Flex mb={4} width="100%">
                {/*  <InputAddon>Cheque</InputAddon>
                <Skeleton loading={loading}>
                  <Input
                    placeholder="No. Cheque"
                    onChange={(e) => setChequeValue(e.target.value)}
                  />
                </Skeleton> */}

                <FilterVoucher
                  label={true}
                  disabled={closingConfirmation}
                  onSelect={onSelect}
                  vouchers={
                    detailsLocal?.vouchers?.filter((item) => !item.status) ?? []
                  }
                  voucherSelect={chequeValue}
                />
              </Flex>
            )}

            <Table.ScrollArea borderWidth="1px" rounded="md">
              <Table.Root size="sm" variant="outline">
                <Table.Header>
                  <Table.Row bg="bg.subtle">
                    {detailsLocal?.bank === "ADYEN" && (
                      <Table.ColumnHeader textAlign="center">
                        <Checkbox
                          top="1"
                          aria-label="Select row"
                          checked={detailsLocal.vouchers.every(
                            (item) => item.successAdyen
                          )}
                          disabled={
                            dataFilesProcess &&
                            dataFilesProcess.consolidatedData
                              ? false
                              : true
                          }
                          onCheckedChange={(changes) => {
                            const updatedDetails = detailsLocal.vouchers.map(
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
                    {detailsLocal?.bank === "ADYEN" && (
                      <Table.ColumnHeader textAlign="center">
                        Diferencias
                      </Table.ColumnHeader>
                    )}
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {visibleItems?.map((item: Voucher) => (
                    <Table.Row
                      key={`${item.id}-${item.check}-${item.amount}`}
                      backgroundColor={isCheckValid(
                        item.successAdyen,
                        item.difference
                      )}
                    >
                      {detailsLocal?.bank === "ADYEN" && (
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
                        <Text>{item.dateDisplay}</Text>
                      </Table.Cell>

                      <Table.Cell>
                        {/*   {detailsLocal?.bank !== "ADYEN" ? (
                          <Field.Root
                            invalid={item.status != undefined && !item.status}
                          >
                            <Input
                              textAlign="center"
                              value={item.check}
                              disabled={closingConfirmation}
                              onChange={(e) =>
                                handleInputData(
                                  e.target.value,
                                  item.id,
                                  detailsLocal || ({} as BankLineModel),
                                  setDetailsLocal
                                )
                              }
                            />
                            <Field.ErrorText>{item.message}</Field.ErrorText>
                          </Field.Root>
                        ) : ( */}
                        <Text>{item.check}</Text>
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
                      {detailsLocal?.bank === "ADYEN" && (
                        <Table.Cell textAlign="center">
                          <Text>{item.difference?.date}</Text>
                          <Text>{item.difference?.check}</Text>
                          <Text>{item.difference?.amount}</Text>
                          <Text>{item.difference?.general}</Text>
                        </Table.Cell>
                      )}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
            {detailsLocal?.vouchers?.filter((item) => item.status).length !==
              0 && (
              <PaginationRoot
                count={
                  detailsLocal?.vouchers?.filter((item) => item.status)
                    .length ?? 0
                }
                pageSize={pageSize}
                page={page}
                onPageChange={(e) => setPage(e.page)}
              >
                <HStack>
                  <PaginationPrevTrigger />
                  <PaginationItems />
                  <PaginationNextTrigger />
                </HStack>
              </PaginationRoot>
            )}

            {detailsLoading && (
              <Box position="fixed" top="50%" left="50%" zIndex="1">
                <Loading />
              </Box>
            )}
          </DialogBody>

          <DialogFooter>
            <Flex gap={4}>
              <CurrencyInput
                value={localAmount}
                name={"Total"}
                loading={detailsLoading || false}
              />

              <Button
                colorPalette="meraPrimary"
                //   onClick={() => saveDetails()}
                onClick={() => setIsOpenDialogSave(true)}
                disabled={
                  closingConfirmation ||
                  (detailsLocal?.bank === "ADYEN" &&
                    !(dataFilesProcess && dataFilesProcess.consolidatedData))
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
        nameBank={detailsLocal?.bank || ""}
        loading={loading}
        detailsLocal={detailsLocal || ({} as BankLineModel)}
      />
    </>
  );
}

export default TDCDetails;
