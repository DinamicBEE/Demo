import { Button } from "@components/ui/button";
import { DialogActionTrigger, DialogBackdrop, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle } from "@components/ui/dialog";
import { Flex, Text } from "@chakra-ui/react";
import { ConfirmDialogProps } from "@models/common.clousing.model";
import { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";

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
      <DialogContent border="4px solid #fb923c">
        <DialogHeader display="flex" flexDirection="column" alignItems="center">
          <DialogTitle textStyle="2xl" fontWeight="semibold">
            {isCorrection ? "Mandar a corrección corte" : !isConfirm ? "Confirmar corte de caja" : "Guardar Corte de Caja"}
          </DialogTitle>
          <div style={{ width: "150px", height: "2px", borderRadius: "24px", background: "#fb923c", marginTop: "8px"}} />
        </DialogHeader>
        <DialogBody display="flex" flexDirection="column">
          <Flex direction="row" >            
            <Text fontWeight="normal" textStyle="lg"  width="85%">
              {isCorrection ? "Esta apunto de enviar a corrección el corte de caja, una vez enviado no se podrá realizar ningun ajuste extra." : !isConfirm ? "Esta apunto de enviar el corte de caja, una vez confirmado no se podrá realizar ningun ajuste extra." : "Esta apunto de guardar el corte de caja, podra realizar ajustes posteriormente."}
              { (isCorrection || !isConfirm) ? (<br />) : null}
            </Text>
            <IoWarningOutline size="80" color="#fb923c" />
          </Flex>
          <Text fontWeight="normal" textAlign="center" textStyle="lg" marginTop="16px">
            {isCorrection ? "¿Desea confirmar el envio del corte de caja a corrección?" : !isConfirm ? "¿Desea confirmar el envio del corte de caja completo?" : null}
          </Text>
        </DialogBody>

        <DialogFooter display="flex" flexDirection="row" justifyContent="center" gap="24px">
          <DialogActionTrigger asChild>
            <Button size="lg" colorPalette="meraError">Cancelar</Button>
          </DialogActionTrigger>
          <Button
            size="lg"
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
