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
import { ExitDialogProps } from "@models/common.clousing.model";

function ExitDialog({
  isOpen,
  closeDialog,
  closeOnExit
}: ExitDialogProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={closeDialog}>
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Cerrar Corte de Caja
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
            Se perderán todos los cambios realizados en el corte de caja, ¿Está seguro de que desea salir?
        </DialogBody>

        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button colorPalette="meraError">Cancelar</Button>
          </DialogActionTrigger>
          <Button
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
