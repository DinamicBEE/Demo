import { Box, Table } from "@chakra-ui/react";
import useSortableTable from "@hooks/useSortableTable/useSortableTable";
import { StarbucksTableModel } from "@models/starbucks.model";
import { SortableHeader } from "@utils/table";


function StarbucksTable() {

    const { sortedData, handleSort, getSortIcon } = useSortableTable<StarbucksTableModel>([]);

    return (
        <Box>
            
            <Table.ScrollArea rounded="md" borderWidth="1px">
                <Table.Root size="sm" variant="outline">
                    <Table.Header>
                        <Table.Row>
                            {/** Se puede pasar como una fucnion a los utilities que solo espere el nombre de la columna */}
                            <SortableHeader columnKey="employe" label="Empleado" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <Table.ColumnHeader textAlign="center" onClick={() => handleSort('status')} _hover={{textDecoration: "underline"}} cursor="pointer">Estatus</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center" onClick={() => handleSort('date')} _hover={{textDecoration: "underline"}} cursor="pointer">Fecha</Table.ColumnHeader>
                            <Table.ColumnHeader textAlign="center" onClick={() => handleSort('total')} _hover={{textDecoration: "underline"}} cursor="pointer">Total</Table.ColumnHeader>
                            {/* {  currenciesHeader.lenght

                            } */}
                            {/* {  creditcards.lenght

                            } */}
                            <Table.ColumnHeader textAlign="center">CXC</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {sortedData.map((item) => (
                            <Table.Row key={item.id}>
                                <Table.Cell textAlign="center">{item.employee}</Table.Cell>
                                <Table.Cell textAlign="center">{item.status}</Table.Cell>
                                <Table.Cell textAlign="center">{item.date}</Table.Cell>
                                <Table.Cell textAlign="center">{item.total}</Table.Cell>
                                {/* {  currenciesData.map((currency, index) => (
                                    <Table.Cell key={index} textAlign="center">{item[currency]}</Table.Cell>
                                ))} */}
                                <Table.Cell textAlign="center">{item.cxc}</Table.Cell>
                            </Table.Row>
                        ))}

                        {/* Add rows here */}
                    </Table.Body>
                </Table.Root>


            </Table.ScrollArea>
        </Box>
    );
}
export default StarbucksTable;