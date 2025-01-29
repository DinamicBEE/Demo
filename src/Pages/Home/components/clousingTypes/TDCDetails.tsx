import { useEffect, useRef, useState } from "react";
import { Button, Flex, FormatNumber, Input, Table, Text } from "@chakra-ui/react";
import { CurrencyInput } from "@components/NumericInput";
import { useTDCContext } from "@context/clousing/tdcClousingContex";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogCloseTrigger, DialogFooter } from "@components/ui/dialog";
import { BankDetails, BankLineDetails, DetailsProp } from "@models/tdc.model";

function TDCDetails({clousingId, lineId, isOpen, onClose}: DetailsProp) {
    const [details, setDetails] = useState<BankDetails>();

     const tdcContext = useTDCContext();
     //const detailsRef = useRef<BankDetails | undefined>(details)

    useEffect(()=>{

        async function fetchData() {
            const detailsData: BankDetails | undefined = tdcContext?.getDetails
                    ? await tdcContext?.getDetails(clousingId,lineId) : undefined;
            
            if (detailsData) {
                setDetails(detailsData);
                //detailsRef.current = detailsData;
            }
        }

        fetchData()

    },[lineId])

    function handleInputData(value: string, id: number) {
        
        if(lineId===null) return

        const updateLines = details?.details.map((item:any) =>
            item.id === id
            ? {
            ...item,
            check: value
            }
            : item
        );

        const updateBankDetails: BankDetails = {
            ...details!,
            details: updateLines || []
        }
        
        tdcContext?.setDetails(updateBankDetails,clousingId,lineId);
        
        setDetails(updateBankDetails)
        //detailsRef.current = updateBankDetails;

    }
    
    return (
        <DialogRoot 
            open={isOpen} 
            closeOnEscape={false} 
            closeOnInteractOutside={false}
            scrollBehavior="inside"
            onOpenChange={() => onClose()}
        >
            <DialogContent>

                <DialogHeader>

                    <DialogTitle>{TDCDetailsMOCKData.bankName}</DialogTitle>
                    
                </DialogHeader>

                <DialogBody>

                    <Table.ScrollArea  borderWidth="1px" rounded="md">
                        <Table.Root
                            striped
                            showColumnBorder
                            stickyHeader
                        >
                            <Table.Header>
                                <Table.Row bg="bg.subtle">
                                    <Table.ColumnHeader textAlign="center">Fecha de cierre</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="center">No. Cheque</Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="end">Importe</Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {details?.details?.map((item:BankLineDetails)=>(
                                    <Table.Row key={item.id}>
                                        
                                        <Table.Cell textAlign="center">
                                            <Text>{item.date}</Text>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Text>
                                                <Input textAlign="center" value={item.check} onChange={(e) => handleInputData(e.target.value, item.id)}/>
                                            </Text>
                                        </Table.Cell>

                                        <Table.Cell textAlign="end">
                                            <Text>
                                                <FormatNumber value={item.amount} style="currency" currency="USD" />
                                            </Text>
                                        </Table.Cell>

                                    </Table.Row>
                                ))}
                            </Table.Body>
                            
                        </Table.Root>
                    </Table.ScrollArea>
                    
                </DialogBody>

                <DialogFooter>

                    <Flex gap={4}>

                        <CurrencyInput value={500} name={"Total"} loading={false} />
                        
                        <Button className="secondary-button save-button">Guardar</Button>

                    </Flex>
                    
                </DialogFooter>

                <DialogCloseTrigger />
                
            </DialogContent>
        </DialogRoot>
    );
};

export default TDCDetails;

const TDCDetailsMOCKData = {
    id: 1,
    bankName: "BBVA bancomer",
    total: 0,
    details: [
        {id: 101, date: "22/05/2024 11:16", check: "", amount: 386},
        {id: 102, date: "22/05/2024 11:12", check: "", amount: 491.05},
        {id: 103, date: "22/05/2024 11:02", check: "", amount: 323},
        {id: 104, date: "22/05/2024 09:37", check: "", amount: 405.60},
        {id: 105, date: "22/05/2024 09:26", check: "", amount: 104},
        {id: 106, date: "22/05/2024 08:57", check: "", amount: 273.90},
        {id: 107, date: "22/05/2024 08:54", check: "", amount: 203},
        {id: 108, date: "22/05/2024 08:45", check: "", amount: 228.65},
        {id: 109, date: "22/05/2024 07:36", check: "", amount: 95},
        {id: 110, date: "22/05/2024 06:43", check: "", amount: 273.90}
    ]

}
