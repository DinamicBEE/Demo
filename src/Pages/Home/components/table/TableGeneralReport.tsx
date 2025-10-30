import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, FormatNumber, HStack, Table, Tag, Text } from "@chakra-ui/react";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";
import { HomeParamsProps, ReportClousingLinesModel, ReportTotalsModel } from "@models/common.clousing.model";
import { useClousing } from "@context/home/clousingContext";
import useSortableTable from "@hooks/useSortableTable/useSortableTable";
import { STATUS } from "@models/status.model";
import { getStatusColor } from "@utils/getStatusColor";


function TableGeneralReport({DataReport, Totals, date}: {DataReport: ReportClousingLinesModel[], Totals: ReportTotalsModel, date: string}) {

    const [page, setPage] = useState<number>(1);
    const navigate = useNavigate();
    const { getInfo } = useClousing();
    const { sortedData, handleSort, getSortIcon } = useSortableTable<ReportClousingLinesModel>(DataReport);
    
    function getDetailsCDC (id: number){

        const cdcData = DataReport.find((cdc) => cdc.cdcId === id);

        const homeParams: HomeParamsProps = {
            subsidiary: {
                id: cdcData?.subsidiariaId ?? 0,
                name: cdcData?.ubicacion ??  "",
                idCurrency: cdcData?.subsidiariaCurrencyId ?? 0
            },
            store:{
                id: cdcData?.cdcId  ?? 0,
                name: cdcData?.cdc ??  ""
            },
            date: date,
            isStarbucks: cdcData?.isStarbucks || false,
        }

        getInfo(homeParams.store?.id ?? 0, 0, new Date(date + "T00:00:00"), new Date(date + "T00:00:00"), true)
        navigate("/homeV3",{
            state: { homeParams }
        })

    }

    const statusColor = (status: STATUS) => {
        return getStatusColor(status);
      }

    return (
        <Box>
            <Table.ScrollArea rounded="md" borderWidth="1px">
                <Table.Root size="sm" variant="outline">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader onClick={() => handleSort('ubicacion')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>Ubicación {getSortIcon('ubicacion')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('cdc')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>CDC {getSortIcon('cdc')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('totalPOS')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>Total POS {getSortIcon('totalPOS')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('totalPhysical')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>Total Físico {getSortIcon('totalPhysical')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('difference')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>Diferencia {getSortIcon('difference')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader minW="110px" onClick={() => handleSort('status')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>Estatus {getSortIcon('status')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('mxn')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>MXN {getSortIcon('mxn')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('usd')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>USD {getSortIcon('usd')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('eur')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>EUR {getSortIcon('eur')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('lib')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>LIB {getSortIcon('lib')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('can')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>CAN {getSortIcon('can')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('customer')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>Clientes Generales {getSortIcon('customer')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('specialCustomer')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>Clientes Especiales {getSortIcon('specialCustomer')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('prepaid')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>Prepago {getSortIcon('prepaid')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('employees')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>CXC Empleados {getSortIcon('employees')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('intercompany')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>Intercompañia {getSortIcon('intercompany')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tpvBancomerUsd')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV Bancomer USD {getSortIcon('tpvBancomerUsd')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tpvSbdellMxn')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV Sbdell MXN {getSortIcon('tpvSbdellMxn')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tpvColdpatria')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV Coldpatria {getSortIcon('tpvColdpatria')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tpvAmexcoCop')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV Amexco COP {getSortIcon('tpvAmexcoCop')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tpvBanamexUsd')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV Banamex USD {getSortIcon('tpvBanamexUsd')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tpvBancomer')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV Bancomer {getSortIcon('tpvBancomer')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tpvAmexco')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV Amexco {getSortIcon('tpvAmexco')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tpvBanamex')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV Banamex {getSortIcon('tpvBanamex')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tpvBbvaCop')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV Bbva COP {getSortIcon('tpvBbvaCop')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tpvSbdellUsd')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV Sbdell USD {getSortIcon('tpvSbdellUsd')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tpvBancoColombia')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV BancoColombia {getSortIcon('tpvBancoColombia')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('sbdellAmexMxn')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV sbdell Amex MXN {getSortIcon('sbdellAmexMxn')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('sbdellAmexUsd')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV sbdell Amex USD {getSortIcon('sbdellAmexUsd')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tpvNetpay')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV Netpay {getSortIcon('tpvNetpay')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('webKiosko')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>WEB Kiosko {getSortIcon('webKiosko')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tpvSantander')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV Santander {getSortIcon('tpvSantander')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('webappUsd')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>WEB app USD {getSortIcon('webappUsd')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tpvDinners')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV Dinners {getSortIcon('tpvDinners')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tpvAdyen')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV Adyen {getSortIcon('tpvAdyen')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tpvAdyenAmex')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV AdyenAmex {getSortIcon('tpvAdyenAmex')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tpvAdyenKiosko')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV AdyenKiosko {getSortIcon('tpvAdyenKiosko')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tpvKioskoUsd')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>TPV KioskoUsd {getSortIcon('tpvKioskoUsd')}</HStack>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader onClick={() => handleSort('tips')} _hover={{textDecoration: "underline"}} cursor="pointer">
                              <HStack justify={"center"}>Propinas electrónica {getSortIcon('tips')}</HStack>
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {sortedData.map((row) => (
                            <Table.Row key={row.id}>
                                <Table.Cell><Text> {row.ubicacion} </Text></Table.Cell>
                                <Table.Cell>
                                    <Text
                                        as="span"
                                        cursor="pointer"
                                        textDecoration="underline"
                                        color="blue.500"
                                        onClick={() => {
                                            getDetailsCDC(row.cdcId);
                                        }}

                                    > {row.cdc} </Text>
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.totalPOS} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.totalPhysical} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                    <FormatNumber value={row.difference} style="currency" currency="USD" />
                                </Table.Cell>
                                <Table.Cell>
                                  <Tag.Root
                                    colorPalette={statusColor(row.status as STATUS)}
                                  >
                                    <Tag.Label>{row.status}</Tag.Label>
                                  </Tag.Root>
                                </Table.Cell>
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
                                <FormatNumber value={Totals.usd  ?? 0} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.eur  ?? 0} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.lib  ?? 0} style="currency" currency="USD" />
                            </Table.Cell>
                            <Table.Cell>
                                <FormatNumber value={Totals.can  ?? 0} style="currency" currency="USD" />
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