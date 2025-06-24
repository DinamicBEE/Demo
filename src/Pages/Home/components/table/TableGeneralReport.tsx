import { useState } from "react";
import { Box, FormatNumber, HStack, Table, Text } from "@chakra-ui/react";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";
import { ReportClousingLinesModel, ReportTotalsModel } from "@models/common.clousing.model";


function TableGeneralReport({DataReport, Totals}: {DataReport: ReportClousingLinesModel[], Totals: ReportTotalsModel}) {

    const [page, setPage] = useState<number>(1);
    
    return (
        <Box>
            <Table.ScrollArea rounded="md" borderWidth="1px">
                <Table.Root size="sm" variant="outline">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Ubicación</Table.ColumnHeader>
                            <Table.ColumnHeader>CDC</Table.ColumnHeader>
                            <Table.ColumnHeader>Total POS</Table.ColumnHeader>
                            <Table.ColumnHeader>Total Físico</Table.ColumnHeader>
                            <Table.ColumnHeader>Diferencia</Table.ColumnHeader>
                            <Table.ColumnHeader>Estatus</Table.ColumnHeader>
                            <Table.ColumnHeader>MXN</Table.ColumnHeader>
                            <Table.ColumnHeader>USD</Table.ColumnHeader>
                            <Table.ColumnHeader>EUR</Table.ColumnHeader>
                            <Table.ColumnHeader>LIB</Table.ColumnHeader>
                            <Table.ColumnHeader>CAN</Table.ColumnHeader>
                            <Table.ColumnHeader>Clientes General</Table.ColumnHeader>
                            <Table.ColumnHeader>Clientes Especiales</Table.ColumnHeader>
                            <Table.ColumnHeader>Prepago</Table.ColumnHeader>
                            <Table.ColumnHeader>CXC Empleados</Table.ColumnHeader>
                            <Table.ColumnHeader>Intercompañia</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV Bancomer USD</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV Sbdell MXN</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV Coldpatria</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV Amexco COP</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV Banamex USD</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV Bancomer</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV Amexco</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV Banamex</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV Bbva COP</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV Sbdell USD</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV BancoColombia</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV sbdell Amex MXN</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV sbdell Amex USD</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV Netpay</Table.ColumnHeader>
                            <Table.ColumnHeader>WEB Kiosko</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV Santander</Table.ColumnHeader>
                            <Table.ColumnHeader>WEB app USD</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV Dinners</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV Adyen</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV AdyenAmex</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV AdyenKiosko</Table.ColumnHeader>
                            <Table.ColumnHeader>TPV KioskoUsd</Table.ColumnHeader>
                            <Table.ColumnHeader>Propinas electrónica</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {DataReport.map((row) => (
                            <Table.Row key={row.id}>
                                <Table.Cell><Text> {row.ubicacion} </Text></Table.Cell>
                                <Table.Cell><Text> {row.cdc} </Text></Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.totalPOS} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.totalPhysical} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.difference} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell><Text>{row.status}</Text></Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.mxn ?? 0} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.usd ?? 0} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.eur ?? 0} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.lib ?? 0} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.can ?? 0} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.customer} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.specialCustomer} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.prepaid} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.employees} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.intercompany} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tpvBancomerUsd} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tpvSbdellMxn} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tpvColdpatria} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tpvAmexcoCop} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tpvBanamexUsd} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tpvBancomer} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tpvAmexco} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tpvBanamex} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tpvBbvaCop} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tpvSbdellUsd} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tpvBancoColombia} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.sbdellAmexMxn} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.sbdellAmexUsd} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tpvNetpay} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.webKiosko} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tpvSantander} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.webappUsd} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tpvDinners} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tpvAdyen} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tpvAdyenAmex} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tpvAdyenKiosko} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tpvKioskoUsd} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.tips} style="currency" currency="USD" />
                                </Table.Cell>
                            </ Table.Row >
                        ))}

                        <Table.Row>
                            <Table.Cell />
                            <Table.Cell><Text> Totales </Text></Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.totalPOS} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.totalPhysical} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.difference} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell />
                            <Table.Cell>
                                <FormatNumber value={Totals.mxn ?? 0} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.usd ?? 0} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.eur ?? 0} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.lib ?? 0} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.can ?? 0} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.customer} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.specialCustomer} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.prepaid} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.employees} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.intercompany} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tpvBancomerUsd} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tpvSbdellMxn} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tpvColdpatria} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tpvAmexcoCop} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tpvBanamexUsd} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tpvBancomer} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tpvAmexco} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tpvBanamex} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tpvBbvaCop} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tpvSbdellUsd} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tpvBancoColombia} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.sbdellAmexMxn} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.sbdellAmexUsd} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tpvNetpay} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.webKiosko} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tpvSantander} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.webappUsd} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tpvDinners} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tpvAdyen} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tpvAdyenAmex} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tpvAdyenKiosko} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tpvKioskoUsd} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.tips} style="currency" currency="USD" />
                            </Table.Cell>
                        </ Table.Row >

                    </Table.Body>
                </Table.Root>
            </Table.ScrollArea>
            <PaginationRoot
                pageSize={10}
                page={page}
                onPageChange={(e) => {
                setPage(e.page);
                }}
            >
                <HStack>
                    <PaginationPrevTrigger />
                    <PaginationItems />
                    <PaginationNextTrigger />
                </HStack>
            </PaginationRoot>
        </Box>
    );
}

export default TableGeneralReport;