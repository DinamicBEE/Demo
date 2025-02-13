
import { useErrorContext } from "@context/ErrorContext";
import { DialogBackdrop, DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogRoot, DialogTitle } from "./ui/dialog";

function ErrorDialog(){
    const { isOpen, errorMessage, closeErrorDialog } = useErrorContext()
    console.log(isOpen)
    return (
        <DialogRoot
        open={isOpen}
        onOpenChange={closeErrorDialog}
      >
        <DialogBackdrop />
        <DialogContent>          
          <DialogHeader>
            <DialogTitle>¡Error de conexión! </DialogTitle>
          </DialogHeader>
          <DialogBody>
              <h2>
                  {errorMessage}
              </h2>
          </DialogBody>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    );
}

export default ErrorDialog;