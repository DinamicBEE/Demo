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
          <p>¿Está seguro que desea cerrar TDC - {nameBank}?</p>
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
