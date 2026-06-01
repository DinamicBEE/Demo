import { DialogActionTrigger, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle } from "@components/ui/dialog";
import { Button, Flex, Text } from "@chakra-ui/react";
import { ErrorDialogProps } from "@models/common.clousing.model";
import { LuCircleOff } from "react-icons/lu";

function ErrorDialog({ isOpen, usdMessage, closeDialog }: ErrorDialogProps) {
  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={closeDialog}
      scrollBehavior="inside"
      closeOnEscape={false}
      closeOnInteractOutside={false}
    >
      <DialogContent border="4px solid #dc2626">
        <DialogHeader display="flex" flexDirection="column" alignItems="center">
          <DialogTitle textStyle="2xl" fontWeight="semibold">El corte de caja no se puede cerrar</DialogTitle>
          <div style={{ width: "150px", height: "2px", borderRadius: "24px", background: "#dc2626", marginTop: "8px"}} />
        </DialogHeader>
        <DialogBody display="flex" flexDirection="row"> 
          <Text fontWeight="normal" textStyle="lg"  width="85%">
            {usdMessage ? ` El corte de caja no se puede cerrar con diferencia en dolares, por favor
            verifique los datos ingresados y vuelva a intentarlo.` 
            : `El corte de caja no se puede cerrar con diferencia, por favor
            verifique los datos ingresados y vuelva a intentarlo.`}
          </Text>
          <LuCircleOff size="80" color="#dc2626" />
        </DialogBody>
        <DialogFooter justifyContent="center">
          <DialogActionTrigger asChild>
            <Button size="lg" colorPalette="meraPrimary">Aceptar</Button>
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export default ErrorDialog;
