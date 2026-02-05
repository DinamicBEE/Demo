import { Skeleton, Table } from "@chakra-ui/react";
import Loading from "@components/Loading";
import { Button } from "@components/ui/button";
import {
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@components/ui/dialog";
import {
  checkDetails,
  CheckDetailsDialogProps,
} from "@models/common.clousing.model";
import { getCheckDetails } from "@services/clousingService";
import { formatCompleteDate } from "@utils/dateFormatter";
import { useEffect, useState } from "react";

function CheckDetailsDialog({
  isOpen,
  closeDialog,
  idCashRegisterClosure,
}: CheckDetailsDialogProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [checksList, setChecksList] = useState<checkDetails[]>([]);

  useEffect(() => {
    console.log(idCashRegisterClosure);

    const fetchDetails = async () => {
      setLoading(true);
      const dataResponse = await getCheckDetails(idCashRegisterClosure);
      if (dataResponse) {
        setChecksList(dataResponse);
      }
      setLoading(false);
    };
    if (isOpen) {
      fetchDetails();
    }
  }, [isOpen]);

  return (
    <>
      <DialogRoot
        open={isOpen}
        onOpenChange={closeDialog}
        size={"md"}
        scrollBehavior="inside"
        closeOnInteractOutside={false}
      >
        <DialogBackdrop />
        <DialogContent>
          <DialogCloseTrigger onClick={() => setChecksList([])} />
          <DialogHeader>
            <DialogTitle>Detalles</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Table.ScrollArea borderWidth="1px" rounded="md">
              <Table.Root size="sm">
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeader>No. Cheque</Table.ColumnHeader>
                    <Table.ColumnHeader>Fecha de Apertura</Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {loading &&
                    Array.from({ length: 5 }).map((_, index) => (
                      <Table.Row key={`skeleton-${index}`}>
                        <Table.Cell>
                          <Skeleton width={"100"} height={"20px"}></Skeleton>
                        </Table.Cell>
                        <Table.Cell>
                          <Skeleton width={"100"} height={"20px"}></Skeleton>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  {!loading &&
                    checksList.map((check) => (
                      <Table.Row key={check.id}>
                        <Table.Cell>{check.checkNumber}</Table.Cell>
                        <Table.Cell>{formatCompleteDate(check.date)}</Table.Cell>
                      </Table.Row>
                    ))}
                    {
                      !loading && checksList.length === 0 && (
                        <Table.Row>
                          <Table.Cell colSpan={2} textAlign="center">
                            No hay detalles disponibles.
                          </Table.Cell>
                        </Table.Row>
                      )
                    }
                </Table.Body>
              </Table.Root>
            </Table.ScrollArea>
          </DialogBody>

          <DialogFooter>
            {/* <DialogActionTrigger asChild>
              <Button colorPalette="meraError">Cancelar</Button>
            </DialogActionTrigger> */}
            <Button
              loading={loading}
              colorPalette="meraSecondary"
              onClick={() => {
                closeDialog();
              }}
            >
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
      {/* {loading && <Loading />} */}
    </>
  );
}

export default CheckDetailsDialog;
