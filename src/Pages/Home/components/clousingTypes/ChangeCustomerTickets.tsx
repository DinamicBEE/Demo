import { useEffect, useState } from "react";
import { HStack, Skeleton, Table, Text } from "@chakra-ui/react";
import { DialogBody, DialogCloseTrigger, DialogContent, DialogHeader, DialogRoot, DialogTitle } from "@components/ui/dialog";
import { CustomerTicketsModel, CustomerTicketsPropsDialogModel } from "@models/customer.model";
import { getTicketsGeneral } from "@services/catalogService";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";
import { Button } from "@components/ui/button";

const pageSize = 10;

export default function ChangeCustomerTickets ({crcId, isOpen, onClose }: CustomerTicketsPropsDialogModel) {
    
    const [data, setData] = useState<CustomerTicketsModel[]>([])
    const [visibleItems, setVisibleItems] = useState<CustomerTicketsModel[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [page, setPage] = useState(1);
    const startRange = (page - 1) * pageSize;
    const endRange = startRange + pageSize;

    useEffect( () => {
        async function fetchData() {
            setLoading(true);
            console.log("entre", isOpen)
            try {
                if(crcId === 0 && !isOpen) return
                const response = await getTicketsGeneral(crcId);
                const items = response.slice(startRange, endRange);
                
                setData(response);
                setVisibleItems(items);
                
            } catch (error) {

                //TODO: Mostrar alerta "No se encontraron Ticketes"
                
            } finally {
                setLoading(false);
            }

        }

        fetchData();
        console.log("cr", crcId)
    },[crcId, isOpen])
    
    useEffect( () => {
        setPage(page);
        const items = data.slice(startRange, endRange);
        setVisibleItems(items);
    },[page])

    return ( 
        <DialogRoot open={isOpen} closeOnEscape={false} closeOnInteractOutside={false} size="lg" scrollBehavior="inside" onOpenChange={() => onClose()}>
            <DialogContent>
                <DialogHeader bg="#bbf7d0" color="#166534" style={{ borderRadius: '8px 8px 0px 0px' }}>
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
                                                <Button mb={2} colorPalette="meraPrimary">
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