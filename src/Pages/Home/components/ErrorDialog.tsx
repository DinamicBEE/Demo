import { Button } from "@components/ui/button";
import {
  DialogActionTrigger,
  DialogBackdrop,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@components/ui/dialog";
import { ErrorDialogProps } from "@models/common.clousing.model";

function ErrorDialog({ isOpen, usdMessage, closeDialog }: ErrorDialogProps) {
  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={closeDialog}
      scrollBehavior="inside"
      closeOnEscape={false}
      closeOnInteractOutside={false}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>El corte de caja no se puede cerrar</DialogTitle>
        </DialogHeader>
        <DialogBody> 
          {usdMessage ? ` El corte de caja no se puede cerrar con diferencia en dolares, por favor
          verifique los datos ingresados y vuelva a intentarlo.` 
          : `El corte de caja no se puede cerrar con diferencia, por favor
          verifique los datos ingresados y vuelva a intentarlo.`}
        </DialogBody>
           <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
}

export default ErrorDialog;
