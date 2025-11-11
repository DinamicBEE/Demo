import { DialogActionTrigger, DialogBackdrop, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, Table } from "@chakra-ui/react";
import { CurrencyInputNumber } from "@components/NumericInput";
import { Button } from "@components/ui/button";
import { DenominationsDetaislProps, DenominationsModel } from "@models/starbucks.model";
import { useEffect, useState } from "react";



function DenominationsDetaisl({isOpen, onClose, onSave, denominations, disabled}: DenominationsDetaislProps) {

    const [denominationsRef, setDenominationsRef] = useState<DenominationsModel[]>([] as DenominationsModel[]); 

    useEffect(() => {      
        setDenominationsRef(denominations.denominations);

    }, []);

    const handleSave = () => {
        const newDenominations ={
            currencyId: denominations.currencyId,
            denominations: denominationsRef
        }
        
        onSave(newDenominations);
        onClose();
    }

    const handleChangeAmount = (index: number, value:number) => {

        const updated = denominationsRef.map((denomination:DenominationsModel, i) => {
            return i === index ?
                { 
                    ...denomination, 
                    amount: value, 
                    subtotal: denomination.denomination.toLowerCase() === "cambio"
                      ? value
                      :  Number(denomination.denomination) * value  
                }
                : denomination;
        });                
        setDenominationsRef(updated);

    }

    
    return (
        <DialogRoot
            scrollBehavior="inside"
            size="lg"
            open={isOpen}
            onOpenChange={onClose}
            closeOnEscape={false}
            closeOnInteractOutside={false}
        >
            <DialogBackdrop />

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Lista de Denominaciones</DialogTitle>
                </DialogHeader>

                <DialogBody>

                    <Table.ScrollArea>
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader>Denominación</Table.ColumnHeader>
                                    <Table.ColumnHeader>Cantidad</Table.ColumnHeader>
                                    <Table.ColumnHeader>Subtotal</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {denominationsRef?.map((denomination, index) => (
                                    <Table.Row key={index}>
                                        <Table.Cell>{denomination.denomination}</Table.Cell>
                                        <Table.Cell>
                                            <CurrencyInputNumber 
                                                loading={false}
                                                value={denomination.amount}
                                                onChange={(value) => handleChangeAmount(index, parseFloat(String(value ?? "0")))}
                                                allowDecimals={denomination.denomination === 'Cambio' ? true : false}
                                                disabled={disabled}
                                            />
                                        </Table.Cell>
                                        <Table.Cell>{denomination.subtotal}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>

                    </Table.ScrollArea>

                </DialogBody>

                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button colorPalette="meraError">Cancelar</Button>
                    </DialogActionTrigger>
                    <Button type="submit" colorPalette="meraPrimary" onClick={handleSave} >
                    Guardar
                    </Button>
                </DialogFooter>
            </DialogContent>

        </DialogRoot>

    )

}

export default DenominationsDetaisl;