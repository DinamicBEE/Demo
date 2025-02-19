import { Button, VStack } from "@chakra-ui/react";
import { toaster } from "@components/ui/toaster";


export const ConfirmToaster = () => {

  const showToast = () => {
    toaster.create({
      title: `Se actualizo los datos correctamente`,
      type: 'success',
      

    })

  };

  return <Button onClick={showToast}>Mostrar Toaster</Button>;
};