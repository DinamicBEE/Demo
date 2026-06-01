import { Button } from "@components/ui/button";
import {
  DialogActionTrigger,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@components/ui/dialog";
import { Text, Flex } from "@chakra-ui/react";
import { ExitDialogProps } from "@models/common.clousing.model";
import { IoWarningOutline } from "react-icons/io5";

function ExitDialog({
  isOpen,
  closeDialog,
  closeOnExit
}: ExitDialogProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={closeDialog}>
      <DialogBackdrop />
      <DialogContent border="4px solid #fb923c">
        <DialogHeader display="flex" flexDirection="column" alignItems="center">
          <DialogTitle textStyle="2xl" fontWeight="semibold">
            Cerrar Corte de Caja
          </DialogTitle>
          <div style={{ width: "150px", height: "2px", borderRadius: "24px", background: "#fb923c", marginTop: "8px"}} />
        </DialogHeader>
        <DialogBody display="flex" flexDirection="column">
          <Flex direction="row" >
            <Text fontWeight="normal" textStyle="lg"  width="85%" paddingRight="16px">
              Se perderán todos los cambios realizados en el corte de caja.
              <br /> 
            </Text>
            <IoWarningOutline size="80" color="#fb923c" />
          </Flex>
          <Text fontWeight="normal" textAlign="center" textStyle="lg" marginTop="16px">
            ¿Está seguro de que desea salir?
          </Text>
        </DialogBody>

        <DialogFooter display="flex" flexDirection="row" justifyContent="center" gap="24px">
          <DialogActionTrigger asChild>
            <Button size="lg" colorPalette="meraError">Cancelar</Button>
          </DialogActionTrigger>
          <Button
            size="lg"
            colorPalette="meraPrimary"
            onClick={() => {
              closeOnExit();
            }}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export default ExitDialog;
