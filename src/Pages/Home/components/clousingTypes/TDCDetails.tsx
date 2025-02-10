import { useEffect, useState } from "react";
import { Box, Field, Flex, FormatNumber, Input, Table, Text } from "@chakra-ui/react";
import { CurrencyInput } from "@components/NumericInput";
import { useTDCContext } from "@context/clousing/tdcClousingContex";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogCloseTrigger, DialogFooter } from "@components/ui/dialog";
import { BankDetails, BankLineDetails, DetailsProp } from "@models/tdc.model";
import Loading from "@components/loading";
import { validateDetails } from "@services/clousingService";
import { Button } from "@components/ui/button";
import { useHandleTDC } from "@hooks/tdcClousing/useTDCClousing";

function TDCDetails({clousingId, employeId, lineId, isOpen, onClose}: DetailsProp) {
    const [detailsLocal, setDetailsLocal] = useState<BankDetails>();
    const [loading, setLoading] = useState<boolean>(false);

    const useDetails = useHandleTDC(clousingId, lineId ?? 0)

    const {getDetails, detailsLoading, setDetails} = useTDCContext();

    useEffect(()=>{

        async function fetchData() {
            const detailsData: BankDetails | undefined = getDetails
                    ? await getDetails(clousingId,lineId) : undefined;
            
            if (detailsData) {
                setDetailsLocal(detailsData);
            }
        }

        fetchData()

    },[lineId])

    async function saveDetails() {
        setLoading(true)
        
        if (lineId !== null && detailsLocal !== undefined) {
            const detailsValidated: BankDetails = await validateDetails(clousingId, lineId, detailsLocal);
            
            setDetailsLocal(detailsValidated);

            setDetails(detailsValidated,clousingId,lineId);
            
            const allSuccess = detailsValidated.details.every(item => item.success);
            
            if(allSuccess) { 
                useDetails.updateLineClousing(detailsValidated, employeId,)
                onClose()
            } 

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

                    <DialogTitle>{detailsLocal?.bankName}</DialogTitle>
                    
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
                                {detailsLocal?.details?.map((item:BankLineDetails)=>(
                                    <Table.Row key={item.id}>
                                        
                                        <Table.Cell textAlign="center">
                                            <Text>{item.date}</Text>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <Field.Root invalid={item.success!=undefined && !item.success}>
                                                <Input textAlign="center" value={item.check} onChange={(e) => useDetails.handleInputData(e.target.value, item.id, detailsLocal || {} as BankDetails, setDetailsLocal,)}/>
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

                    {detailsLoading && (
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

                        <CurrencyInput value={detailsLocal?.total} name={"Total"} loading={detailsLoading || false} />
                        
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