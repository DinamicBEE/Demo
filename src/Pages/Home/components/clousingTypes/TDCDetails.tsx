import { useEffect, useState } from "react";
import { Box, Flex, FormatNumber, Table, Text, HStack } from "@chakra-ui/react";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";
import { CurrencyInput } from "@components/NumericInput";
import { useTDCContext } from "@context/clousing/tdcClousingContex";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogCloseTrigger, DialogFooter } from "@components/ui/dialog";
import { BankLineModel, Voucher, DetailsProp } from "@models/tdc.model";
import { Button } from "@components/ui/button";
import { useHandleTDC } from "@hooks/tdcClousing/useTDCClousing";
import Loading from "@components/Loading";
import DialogFiles from "./DialogFiles";
import { useTDCAdyenContext } from "@context/clousing/tdcAdyenContext";
import { useHandleTDCAdyen } from "@hooks/tdcClousing/useTDCAdyenClousing";
import { ProcessResult } from "@models/adyen.model";
import DialogConfirmTDC from "./DialogConfirmTDC";
import FilterVoucher from "@components/FilterVouchers";
import { TiDelete } from "react-icons/ti";
import { Tooltip } from "@components/ui/tooltip"

const pageSize = 10;

function TDCDetails({ clousingId, lineId, isOpen, onClose, closingConfirmation, bankDetails}: DetailsProp) {
  const [detailsLocal, setDetailsLocal] = useState<BankLineModel | undefined>(
    {} as BankLineModel
  );
  const [loading, setLoading] = useState<boolean>(false);
  const { dataFilesProcess, setDataFilesProcess } = useTDCAdyenContext();
  const [isOpenDialogFiles, setIsOpenDialogFiles] = useState<boolean>(false);
  const { updateLocalBanksAdyen } = useHandleTDCAdyen();
  const [isOpenDialogSave, setIsOpenDialogSave] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<Voucher[]>([]);
  const [localAmount, setLocalAmount] = useState<number>(0);
  const [vouchersSelected, setVouchersSelected] = useState(0);
  const startRange = (page - 1) * pageSize;
  const endRange = startRange + pageSize;

  const { updateLineClousing } = useHandleTDC( clousingId, lineId ?? 0 );
  const { detailsLoading } = useTDCContext();

  useEffect(() => {
    async function fetchData() {
      if (lineId === null) return;
      setPage(1);

      setDetailsLocal(bankDetails);
      setVisibleItems(
        bankDetails.vouchers
          .filter((item) => item.status)
          .slice(startRange, endRange)
      );
      setLocalAmount(
        bankDetails.vouchers
          .filter((item) => item.status)
          .reduce((acc, curr) => acc + curr.amountConversion, 0)
      );
      setVouchersSelected(
        bankDetails.vouchers.filter((item) => item.status).length
      );
    }

    fetchData();
  }, [lineId]);

  useEffect(() => {
    if (lineId === null && detailsLocal === undefined) return;
    if (!detailsLocal?.vouchers) return;
    setPage(page);
    const items = detailsLocal.vouchers
      .filter((item) => item.status)
      .slice(startRange, endRange);
    setVisibleItems(items);
  }, [page]);

  useEffect(() => {
    if (!dataFilesProcess.consolidatedData || !detailsLocal?.vouchers) {
      return;
    }
    updateLocalBanksAdyen(
      dataFilesProcess,
      detailsLocal,
      setDetailsLocal,
      setVisibleItems,
      setLocalAmount,
      setVouchersSelected,
      startRange,
      endRange
    );
  }, [dataFilesProcess.consolidatedData]);

  async function saveDetails() {
    if (closingConfirmation) return;

    setLoading(true);

    if (lineId !== null && detailsLocal !== undefined) {
      updateLineClousing(detailsLocal);
      onClose();
      setIsOpenDialogSave(false);
      setLoading(false);
    }
  }

  const onSelect = (item: Voucher) => {
    const updatedDetails = detailsLocal?.vouchers.map((voucher) =>
      voucher.idCustom === item.idCustom && voucher.amount === item.amount
        ? {
            ...voucher,
            status: true, 
          }
        : voucher
    );
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
      Number(
        updatedDetailsLocal.vouchers
          .filter((item) => item.status)
          .reduce((acc, curr) => acc + curr.amountConversion, 0)
          .toFixed(2)
      )
    );
    setVouchersSelected(
      updatedDetailsLocal.vouchers.filter((item) => item.status).length
    );
  };

  const onDelete = (itemId: string | number) => {
  if (closingConfirmation) return;

  const updatedVouchers = detailsLocal?.vouchers.map((voucher) =>
    voucher.idCustom === itemId
      ? { ...voucher, status: false }
      : voucher
  );

  if (updatedVouchers === undefined || detailsLocal === undefined) return;

  const updatedDetailsLocal: BankLineModel = {
    ...detailsLocal,
    vouchers: updatedVouchers as Voucher[],
  };

  setDetailsLocal(updatedDetailsLocal);

  setVisibleItems(
    updatedDetailsLocal.vouchers
      .filter((item) => item.status)
      .slice(startRange, endRange)
  );

  setLocalAmount(
    Number(
      updatedDetailsLocal.vouchers
        .filter((item) => item.status)
        .reduce((acc, curr) => acc + curr.amountConversion, 0)
        .toFixed(2)
    )
  );

  setVouchersSelected(
    updatedDetailsLocal.vouchers.filter((item) => item.status).length
  );
};

  return (
    <>
      <DialogRoot
        open={isOpen}
        closeOnEscape={false}
        closeOnInteractOutside={false}
        scrollBehavior="inside"
        size={"lg"}
        onOpenChange={() => {
          onClose(), setDataFilesProcess({} as ProcessResult);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detailsLocal?.bank}</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <Flex gap={4}>
              <CurrencyInput
                value={detailsLocal?.pos}
                name={"POS"}
                loading={detailsLoading || false}
              />
              <CurrencyInput
                value={localAmount}
                name={"Físico"}
                loading={detailsLoading || false}
              />
              <CurrencyInput
                value={(detailsLocal?.pos ?? 0) - localAmount}
                name={"Diferencia"}
                loading={detailsLoading || false}
              />
            </Flex>
            {detailsLocal?.bank?.toLowerCase().includes("adyen") && (
              <Flex mt={4} width="100%">
                <Button
                  colorPalette="meraPrimary"
                  size={"xs"}
                  width={"50% !important"}
                  onClick={() => setIsOpenDialogFiles(true)}
                >
                  Subir archivos
                </Button>
              </Flex>
            )}

            <Flex mb={4} mt={4} width="100%">

              <FilterVoucher
                disabled={closingConfirmation}
                onSelect={onSelect}
                vouchers={
                  detailsLocal?.vouchers?.filter((item) => !item.status) ?? []
                }
              />
            </Flex>

            <Table.ScrollArea borderWidth="1px" rounded="md">
              <Table.Root size="sm" variant="outline">
                <Table.Header>
                  <Table.Row bg="bg.subtle">
                    <Table.ColumnHeader textAlign="center">
                      Fecha de cierre
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="center">
                      No. Cheque
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">
                      Importe original
                    </Table.ColumnHeader>
                    <Table.ColumnHeader textAlign="end">
                      Importe convertido
                    </Table.ColumnHeader>
                    {!closingConfirmation && <Table.ColumnHeader textAlign="center">
                      
                    </Table.ColumnHeader>}

                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {visibleItems?.map((item: Voucher) => (
                    <Table.Row
                      key={`${item.idCustom}-${item.check}-${item.amount}`}
                    >
                      
                      <Table.Cell textAlign="center">
                        <Text>{item.dateDisplay}</Text>
                      </Table.Cell>

                      <Table.Cell>
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
                      <Table.Cell textAlign="end">
                        <Text>
                          <FormatNumber
                            value={item.amountConversion}
                            style="currency"
                            currency="USD"
                          />
                        </Text>
                      </Table.Cell>
                      {!closingConfirmation &&<Table.Cell textAlign="center">
                        <Text color="red.500" cursor="pointer" textStyle="lg" onClick={() => onDelete(item.idCustom)}>
                          
                          <Tooltip
                            content={`Eliminar cheque ${item.check}`}
                            positioning={{ placement: "right-end" }}
                          >
                            <TiDelete />
                            
                          </Tooltip>
                        </Text>
                      </Table.Cell>}

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
              <Box position="fixed" top="50%" left="50%" zIndex={1000}>
                <Loading />
              </Box>
            )}
          </DialogBody>

          <DialogFooter>
            <Flex gap={4}>

              <Button
                colorPalette="meraPrimary"
                onClick={() => setIsOpenDialogSave(true)}
                disabled={ closingConfirmation }
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
        onClose={() => setIsOpenDialogFiles(false)}
      />
      <DialogConfirmTDC
        isOpen={isOpenDialogSave}
        onAccept={saveDetails}
        onClose={() => setIsOpenDialogSave(false)}
        nameBank={detailsLocal?.bank || ""}
        loading={loading}
        detailsLocal={detailsLocal || ({} as BankLineModel)}
        vouchersSelected={vouchersSelected}
      />
    </>
  );
}

export default TDCDetails;
