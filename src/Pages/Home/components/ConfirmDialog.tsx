import { Button } from "@components/ui/button";
import { DialogActionTrigger, DialogBackdrop, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle } from "@components/ui/dialog";
import { ConfirmDialogProps } from "@models/common.clousing.model";


function ConfirmDialog({isOpen, closeDialog, sendData}: ConfirmDialogProps) {
    return (
        <DialogRoot
            open={isOpen}
            onOpenChange={closeDialog}
        >
            <DialogBackdrop />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmación de envio </DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <h2>
                        Esta apunto de enviar el cierre de caja, 
                        una vez confirmado no se podrá realizar ningun ajuste extra.
                    </h2>
                    <br />
                    <h2>
                        ¿Desea confirmar el envio del corte de caja completo?
                    </h2>
                </DialogBody>

                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button colorPalette="meraError" >Cancelar</Button>
                    </DialogActionTrigger>
                    <Button 
                        colorPalette="meraPrimary" 
                        onClick={() => {
                            sendData()
                            closeDialog()
                        }
                    } >Confirmar</Button>
                </DialogFooter>

            </DialogContent>
        </DialogRoot>
    )
}

export default ConfirmDialog;