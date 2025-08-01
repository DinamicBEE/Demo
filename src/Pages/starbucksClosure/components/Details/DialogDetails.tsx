import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody,
  DialogCloseTrigger, DialogFooter } from "@components/ui/dialog";
import { Button } from "@components/ui/button";

function DialogDetails() {
  return (
    <>
        <DialogRoot>
            <DialogContent>
                
                <DialogHeader>
                    <DialogTitle>Corte de caja</DialogTitle>
                </DialogHeader>

                <DialogBody>
                    {/* Content goes here */}
                    <p>This is where the details will be displayed.</p>
                </DialogBody>

                <DialogFooter>
                    
                    <Button colorPalette="meraWarning">Guardar</Button>
                    <Button colorPalette="meraPrimary">Guardar</Button>

                </DialogFooter>

                <DialogCloseTrigger />
            </DialogContent>
        </DialogRoot>
    </>
  );
}

export default DialogDetails;