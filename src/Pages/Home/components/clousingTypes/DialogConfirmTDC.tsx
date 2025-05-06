import { Button, Flex } from "@chakra-ui/react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
  DialogFooter,
} from "@components/ui/dialog";
import { DialogConfirmTDCProps } from "@models/tdc.model";

function DialogConfirmTDC({
  isOpen,
  onAccept,
  onClose,
  nameBank,
  loading,
  detailsLocal,
  detailsOriginal,
}: DialogConfirmTDCProps) {
  return (
    <DialogRoot
      open={isOpen}
      closeOnEscape={false}
      closeOnInteractOutside={false}
      scrollBehavior="inside"
      onOpenChange={() => {
        !loading && onClose();
      }}
      placement={"center"}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar</DialogTitle>
        </DialogHeader>

        <DialogBody>
          {detailsLocal?.vouchers?.filter((item) => item.status).length !==
          detailsOriginal?.vouchers?.filter((item) => !item.status).length ? (
            <Flex
              direction="column"
              justifyContent="center"
              alignItems="center"
              gap={2}
            >
              <p>La cantidad de voucher no coincide</p>
            </Flex>
          ) : (
            <Flex
              direction="column"
              justifyContent="center"
              alignItems="center"
              gap={2}
            >
              <p>¿Estas seguro que deseas aprobar el cierre de {nameBank}?</p>
            </Flex>
          )}
          {/*  {detailsLineId?.length !== detailsLocal?.details?.length ? (
            <Flex
              direction="column"
              justifyContent="center"
              alignItems="center"
              gap={2}
            >
              <p>La cantidad de voucher no coincide</p>
            </Flex>
          ) : (
            <Flex
              direction="column"
              justifyContent="center"
              alignItems="center"
              gap={2}
            >
              <p>¿Estas seguro que deseas aprobar el cierre de {nameBank}?</p>
            </Flex>
          )} */}
        </DialogBody>

        <DialogFooter>
          <Flex gap={4}>
            <Button
              size="xs"
              colorPalette="red"
              variant="surface"
              rounded="full"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              size="xs"
              colorPalette="green"
              variant="surface"
              rounded="full"
              marginRight="5px"
              onClick={() => {
                onAccept();
              }}
              loading={loading}
            >
              Aprobar
            </Button>
          </Flex>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}

export default DialogConfirmTDC;
