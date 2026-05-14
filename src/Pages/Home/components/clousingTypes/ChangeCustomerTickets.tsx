import { useEffect, useState } from "react";
import { HStack, Skeleton, Table, Text } from "@chakra-ui/react";
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogRoot, DialogTitle } from "@components/ui/dialog";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";
import { Button } from "@components/ui/button";
import { toast } from "@utils/Toast";
import { getTicketsGeneral } from "@services/catalogService";
import { CustomerTicketsModel, CustomerTicketsPropsDialogModel } from "@models/customer.model";
import { ChangeTicketGeneralToSpecial } from "@services/clousingService";
import { useSpecialCustContext } from "@context/clousing/specialCustClousingContext";
import { useCustomerContext } from "@context/clousing/customerClousingContext";

const pageSize = 10;

export default function ChangeCustomerTickets ({crcId, isOpen, onClose, clousingId, idCurrency }: CustomerTicketsPropsDialogModel) {
    
    const [data, setData] = useState<CustomerTicketsModel[]>([]);
    const [visibleItems, setVisibleItems] = useState<CustomerTicketsModel[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [resLoading, setResLoading] = useState<boolean>(false);
    const [page, setPage] = useState(1);
    const startRange = (page - 1) * pageSize;
    const endRange = startRange + pageSize;

    const { getSpecialCustData } = useSpecialCustContext();
    const { getCustomerData } = useCustomerContext();

    useEffect( () => {
        async function fetchData() {
            setLoading(true);

            try {
                if(crcId === 0 && !isOpen) return
                const response = await getTicketsGeneral(crcId);
                const items = response.slice(startRange, endRange);
                
                setData(response);
                setVisibleItems(items);
                
            } catch (error) {

                toast("No se encontraron Tickets.","warning", "Lista de Tickets");

            } finally {
                setLoading(false);
            }

        }

        fetchData();
    
    },[crcId, isOpen])
    
    useEffect( () => {
        setPage(page);
        const items = data.slice(startRange, endRange);
        setVisibleItems(items);
    },[page])

    const changeTicket = async (id:number) => {
        setResLoading(true);

        try {
            const response = await ChangeTicketGeneralToSpecial(id);

            if(response) {
                await getSpecialCustData(clousingId, idCurrency, true);
                await getCustomerData(clousingId, true);

                onClose();
            }  else {
                toast("No se pudo realizar el cambio del ticket.","error", "Cambio de tickets");
            }
            
        } catch (error) {
            toast("ha ocurrido un error inesperado, contacte a soporte técnico.","error", "Cambio de tickets");
        } finally {
            setResLoading(false);
        }

    }

    return ( 
        <DialogRoot open={isOpen} closeOnEscape={false} closeOnInteractOutside={false} size="lg" scrollBehavior="inside" onOpenChange={() => onClose()}>
            <DialogContent>
                <DialogHeader bg="#7ca1ee" color="white" style={{ borderRadius: '6px 6px 0px 0px' }}>
                    <DialogTitle fontWeight="medium" fontSize="xl">
                        Lista de tickets
                    </DialogTitle>
                    <DialogCloseTrigger onClick={() => onClose()} color="#166534" />
                </DialogHeader>
                
                <DialogBody>
                    <Table.ScrollArea borderWidth="1px" rounded="md">
                        <Table.Root size="sm" variant="outline">
                            
                            <Table.Header>
                                <Table.Row>
                                    <Table.ColumnHeader textAlign="center">
                                        <Skeleton loading={loading} variant="shine">
                                            No. de ticket
                                        </Skeleton>
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="center">
                                        <Skeleton loading={loading} variant="shine">
                                            Monto de ticket
                                        </Skeleton>
                                    </Table.ColumnHeader>
                                    <Table.ColumnHeader textAlign="center">
                                        <Skeleton loading={loading} variant="shine" />
                                    </Table.ColumnHeader>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                { visibleItems.map((item:CustomerTicketsModel) => (
                                    <Table.Row key={item.ticketNumber}>
                                        <Table.Cell>
                                            <Skeleton loading={loading} variant="shine">
                                                <Text>{item.ticketNumber}</Text>
                                            </Skeleton>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Skeleton loading={loading} variant="shine">
                                                <Text>{item.ammount}</Text>
                                            </Skeleton>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Skeleton loading={loading} variant="shine">
                                                <Button mb={2} colorPalette="meraPrimary" loading={resLoading} onClick={() => changeTicket(item.idPaymentSale)}>
                                                    Agregar
                                                </Button>
                                            </Skeleton>
                                        </Table.Cell>
                                    </Table.Row>
                                  ))
                                }
                            </Table.Body>

                        </Table.Root>
                    </Table.ScrollArea>
                    <PaginationRoot
                        count={data.length}
                        pageSize={pageSize}
                        page={page}
                        onPageChange={(e) => setPage(e.page)}
                    >
                        <HStack>
                            <PaginationPrevTrigger />
                            <PaginationItems />
                            <PaginationNextTrigger />
                        </HStack>
                    </PaginationRoot>
                </DialogBody>

            </DialogContent>
        </DialogRoot>
    )
}