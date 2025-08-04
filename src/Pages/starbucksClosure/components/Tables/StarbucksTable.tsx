import { Box, FormatNumber, Table, Text } from "@chakra-ui/react";
import useSortableTable from "@hooks/useSortableTable/useSortableTable";
import { StarbucksTableHeader, StarbucksTableModel } from "@models/starbucks.model";
import { getHeadersStarbucks, getStarbucksData } from "@services/starbucksService";
import { SortableHeader } from "../../../../utils/table";
import { useEffect, useState } from "react";
import DialogDetails from "../Details/DialogDetails";


function StarbucksTable() {

    const [starbucksData, setStarbucksData] = useState<StarbucksTableModel[]>([]); 
    const [tableHeaders, setTableHeaders] = useState<StarbucksTableHeader>({} as StarbucksTableHeader); 
    const { sortedData, handleSort, getSortIcon } = useSortableTable<StarbucksTableModel>(starbucksData);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {

        const fetchData = async () => {

            const data = await getStarbucksData()
            const header = await getHeadersStarbucks()
            setTableHeaders(header);
            setStarbucksData(data);
        };

        fetchData();
    }, []);

    const openDialog = () => {
        setIsDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
    };

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
                                            onClick={() => openDialog()}
                                        >
                                            {item.employee}
                                        </Text>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">{item.status}</Table.Cell>
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