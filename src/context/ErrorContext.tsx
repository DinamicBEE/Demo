import { ErrorDialogContextType } from "@models/common.model";
import { createContext, ReactNode, useCallback, useContext, useState } from "react";


const errorContext = createContext<ErrorDialogContextType>({} as ErrorDialogContextType);

export const useErrorContext = () => useContext(errorContext);

export function ErrorDialogProvider({ children }: { children: ReactNode }){
    
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const showErrorDialog = useCallback((message: string) => {
    console.log(message)
    setErrorMessage(message);
    setIsOpen(true);
    console.log(isOpen)
  },[isOpen]);

  const closeErrorDialog = useCallback(() => {
    setIsOpen(false);
    setErrorMessage('');
  },[isOpen]);

  return (
    <errorContext.Provider value={{ isOpen, errorMessage, showErrorDialog, closeErrorDialog }}>
        {children}
    </errorContext.Provider>
  );
}