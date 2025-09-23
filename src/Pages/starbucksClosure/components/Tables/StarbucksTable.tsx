import { Box, FormatNumber, Table, Tag, Text } from "@chakra-ui/react";
import useSortableTable from "@hooks/useSortableTable/useSortableTable";
import { StarbucksTableDataModel, StarbucksTableHeader, StarbucksTableModel } from "@models/starbucks.model";
import { SortableHeader } from "../../../../utils/table";
import { useEffect, useState } from "react";
import DialogDetails from "../Details/DialogDetails";
import Loading from "@components/Loading";
import { STATUS } from "@models/status.model";
import { getStatusColor } from "../../../../utils/getStatusColor";



function StarbucksTable({headers, lines}:StarbucksTableDataModel) {

    const [starbucksData, setStarbucksData] = useState<StarbucksTableModel[]>([]); 
    const [tableHeaders, setTableHeaders] = useState<StarbucksTableHeader>({} as StarbucksTableHeader); 
    const { sortedData, handleSort, getSortIcon } = useSortableTable<StarbucksTableModel>(starbucksData);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
            const data = lines;
            const header = headers;
            setTableHeaders(header);
            setStarbucksData(data);
          setLoading(false)
        };

        fetchData();
    }, [headers, lines]);

    const openDialog = (item:StarbucksTableModel) => {
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

    function statusColor(status: STATUS) {
        return getStatusColor(status);
    }

    return (
        <>
            <Box>
                
                <Table.ScrollArea rounded="md" borderWidth="1px">
                    <Table.Root size="sm" variant="outline">
                        <Table.Header>
                            <Table.Row>

                                <SortableHeader columnKey="employee" label="Empleado" handleSort={handleSort} getSortIcon={getSortIcon} />
                                <SortableHeader columnKey="status" label="Estatus" handleSort={handleSort} getSortIcon={getSortIcon} />
                                <SortableHeader columnKey="date" label="Fecha" handleSort={handleSort} getSortIcon={getSortIcon} />
                                <SortableHeader columnKey="total" label="Total" handleSort={handleSort} getSortIcon={getSortIcon} />
                            
                                {
                                    tableHeaders.currencies?.map
                                        ((item) => (
                                            <Table.ColumnHeader key={item.id} textAlign="center">{item.symbol}</Table.ColumnHeader>
                                        ))
                                }

                                {
                                    tableHeaders.creditCards?.map
                                        ((item, index) => (
                                            <Table.ColumnHeader key={index} textAlign="center">{item.nameBank}</Table.ColumnHeader>
                                        ))
                                }
                                <Table.ColumnHeader textAlign="center">CXC</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {sortedData.map((item) => (
                                <Table.Row key={item.id}>
                                    <Table.Cell textAlign="center">
                                        <Text
                                            as="span"
                                            cursor="pointer"
                                            textDecoration="underline"
                                            color="blue.500"
                                            onClick={() => openDialog(item)}
                                        >
                                            {item.employee}
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                      <Tag.Root colorPalette={statusColor(item.status)}>
                                        <Tag.Label>{item.status}</Tag.Label>
                                      </Tag.Root>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">{item.date}</Table.Cell>
                                    <Table.Cell textAlign="center">{item.total}</Table.Cell>
                                    {
                                        tableHeaders.currencies.length > 0 &&
                                        item.currencies.length > 0 &&
                                        tableHeaders.currencies.map((currency, index) => (
                                            <Table.Cell key={index} textAlign="center">
                                                <FormatNumber
                                                value={item.currencies.find(c => c.id === currency.id)?.total || 0} 
                                                style="currency"
                                                currency="USD"
                                                />
                                            </Table.Cell>)) 
                                    }

                                    {
                                        tableHeaders.creditCards.length > 0 &&
                                        item.creditCards.length > 0 &&
                                        tableHeaders.creditCards.map((creditCard, index) => (
                                            <Table.Cell key={index} textAlign="center">
                                                <FormatNumber
                                                value={item.creditCards.find(c => c.nameBank === creditCard.nameBank)?.total || 0} 
                                                style="currency"
                                                currency="USD"
                                                />
                                            </Table.Cell>
                                        ))
                                    }
                                    <Table.Cell textAlign="center">{item.cxc}</Table.Cell>
                                </Table.Row>
                            ))}

                        </Table.Body>
                    </Table.Root>


                </Table.ScrollArea>

                {loading && (
                <Box position="fixed" top="50%" left="50%" zIndex={1000}>
                    <Loading />
                </Box>
            )
            }

            </Box>

            <DialogDetails
                isOpen={isDialogOpen} 
                onClose={closeDialog}
            >
            </DialogDetails>
        </>
    );
}
export default StarbucksTable;