import React from "react";
import { Button, Text } from "@chakra-ui/react";
import { DialogRoot, DialogBackdrop, DialogBody, DialogContent, DialogTitle, DialogFooter, DialogActionTrigger, DialogHeader } from "@components/ui/dialog";
import { ConfirmacionDialogProps } from "@models/confirmationDialog";


export const ConfirmDialog: React.FC<ConfirmacionDialogProps> = ({ isOpen, onClose, onConfirm, message, title = "Confirmación", loading}) => {

  return (
    <>
      <DialogRoot open={isOpen} onOpenChange={onClose} closeOnEscape={false} closeOnInteractOutside={false} placement='top'>
        <DialogBackdrop />
        <DialogContent>

          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <Text>{message}</Text>
          </DialogBody>

          <DialogFooter>

            <DialogActionTrigger>
              <Button colorPalette='red' onClick={() => onClose()} loading={loading} disabled={loading}> Cancelar </Button>
            </DialogActionTrigger>

            <Button colorPalette='green' onClick={() => onConfirm()} loading={loading} disabled={loading}> Confirmar </Button>

          </DialogFooter>
        </DialogContent>

      </DialogRoot>
    </>
  )
};