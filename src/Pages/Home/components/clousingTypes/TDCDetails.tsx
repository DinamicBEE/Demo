import { useEffect, useState } from "react";
import { Box, Field, Flex, FormatNumber, Input, Table, Text } from "@chakra-ui/react";
import { CurrencyInput } from "@components/NumericInput";
import { useTDCContext } from "@context/clousing/tdcClousingContex";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogCloseTrigger, DialogFooter } from "@components/ui/dialog";
import { BankDetails, BankLineDetails, DetailsProp } from "@models/tdc.model";
import Loading from "@components/loading";
import { validateDetails } from "@services/clousingService";
import { Button } from "@components/ui/button";

function TDCDetails({clousingId, lineId, isOpen, onClose}: DetailsProp) {
    const [details, setDetails] = useState<BankDetails>();
    const [loading, setLoading] = useState<boolean>(false);

    const tdcContext = useTDCContext();

    useEffect(()=>{

        async function fetchData() {
            const detailsData: BankDetails | undefined = tdcContext?.getDetails
                    ? await tdcContext?.getDetails(clousingId,lineId) : undefined;
            
            if (detailsData) {
                setDetails(detailsData);
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

    }

    async function saveDetails() {
        setLoading(true)

        if (lineId !== null && details !== undefined) {
            const detailsValidated: BankDetails = await validateDetails(clousingId, lineId, details);

            setDetails(detailsValidated);

            const allSuccess = detailsValidated.details.every(item => item.success);

            allSuccess ? onClose() : null;

            setLoading(false)

        }

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

                    <DialogTitle>{details?.bankName}</DialogTitle>
                    
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
                                            <Field.Root invalid={item.success!=undefined && !item.success}>
                                                <Input textAlign="center" value={item.check} onChange={(e) => handleInputData(e.target.value, item.id)}/>
                                                <Field.ErrorText>{item.message}</Field.ErrorText>
                                            </Field.Root>
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

                    {tdcContext?.detailsLoading && (
                        <Box position="fixed" top="50%" left="50%">
                        <Loading />
                        </Box>
                    )}
                    
                    {loading && (
                        <Box position="fixed" top="50%" left="50%">
                        <Loading />
                        </Box>
                    )}

                </DialogBody>

                <DialogFooter>

                    <Flex gap={4}>

                        <CurrencyInput value={details?.total} name={"Total"} loading={tdcContext?.detailsLoading || false} />
                        
                        <Button 
                            className="secondary-button save-button"
                            loading={loading} 
                            onClick={(()=>saveDetails())}
                        >Guardar</Button>

                    </Flex>
                    
                </DialogFooter>

                <DialogCloseTrigger />
                
            </DialogContent>
        </DialogRoot>
    );
};

export default TDCDetails;