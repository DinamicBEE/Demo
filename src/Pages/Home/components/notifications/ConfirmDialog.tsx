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
import { useState } from "react";

function ConfirmDialog({
  isOpen,
  closeDialog,
  sendData,
  isConfirm,
  isCorrection
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={closeDialog}
      closeOnEscape={false}
      closeOnInteractOutside={false}
    >
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isCorrection ? "¿Desea mandar a corrección el corte de caja?" : !isConfirm ? "Confirmar corte de caja" : "Guardar Corte de Caja"}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          { isCorrection ? (
            <>
              <h2>
                Esta apunto de enviar a corrección el corte de caja, una vez enviado no se
                podrá realizar ningun ajuste extra.
              </h2>
              <br />
              <h2>¿Desea confirmar el envio del corte de caja a corrección?</h2>
            </>
          ) : !isConfirm ? (
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
            loading={loading}
            colorPalette="meraPrimary"
            onClick={() => {
              setLoading(true);
              sendData(isConfirm);
              closeDialog();
              setLoading(false);
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
