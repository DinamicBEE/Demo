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
import { ConfirmDialogProps } from "@models/common.clousing.model";

function ConfirmDialog({
  isOpen,
  closeDialog,
  sendData,
  isConfirm
}: ConfirmDialogProps) {
  return (
    <DialogRoot open={isOpen} onOpenChange={closeDialog}>
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {!isConfirm ? "Confirmar corte de caja" : "Guardar Corte de Caja"}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          {!isConfirm ? (
            <>
              <h2>
                Esta apunto de enviar el corte de caja, una vez confirmado no se
                podrá realizar ningun ajuste extra.
              </h2>
              <br />
              <h2>¿Desea confirmar el envio del corte de caja completo?</h2>
            </>
          ) : (
            <h2>
              Esta apunto de guardar el corte de caja, podra realizar ajustes
              posteriormente.
            </h2>
          )}
        </DialogBody>

        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button colorPalette="meraError">Cancelar</Button>
          </DialogActionTrigger>
          <Button
            colorPalette="meraPrimary"
            onClick={() => {
              sendData(isConfirm);
              closeDialog();
            }}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export default ConfirmDialog;
