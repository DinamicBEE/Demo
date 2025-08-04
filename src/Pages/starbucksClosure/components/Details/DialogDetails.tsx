import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody,
  DialogCloseTrigger, DialogFooter } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { StarbucksDetailsProps } from "@models/starbucks.model";

function DialogDetails({isOpen, onClose}: StarbucksDetailsProps) {
  return (
    <>
        <DialogRoot
          scrollBehavior="inside"
          size="full"
          open={isOpen}
          closeOnEscape={false}
          closeOnInteractOutside={false}
        >
            <DialogContent>
                
                <DialogHeader>
                    <DialogTitle>Corte de caja</DialogTitle>
                </DialogHeader>

                <DialogBody>
                    {/* Content goes here */}
                    <p>This is where the details will be displayed.</p>
                </DialogBody>

                <DialogFooter>
                    
                    <Button colorPalette="meraWarning" onClick={()=> onClose()}>Guardar</Button>
                    <Button colorPalette="meraPrimary">Guardar</Button>

                </DialogFooter>

                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    </>
  );
}

export default DialogDetails;