import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, FormatNumber, HStack, Table, Tag, Text } from "@chakra-ui/react";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";
import { HomeParamsProps, ReportClousingLinesModel, ReportTotalsModel } from "@models/common.clousing.model";
import { useClousing } from "@context/home/clousingContext";
import useSortableTable from "@hooks/useSortableTable/useSortableTable";
import { STATUS } from "@models/const/status.const";
import { getStatusColor } from "@utils/getStatusColor";
import { SortableHeader } from "@utils/table";


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

        getInfo(homeParams.store?.id ?? 0, 0, new Date(date + "T00:00:00"), new Date(date + "T00:00:00"), true, homeParams.isStarbucks)
        navigate("/homeV3",{
            state: { homeParams }
        })

    }

    const statusColor = (status: STATUS) => {
        return getStatusColor(status);
      }

    return (
        <Box>
            <Table.ScrollArea rounded="md" borderWidth="1px" h="500px">
                <Table.Root size="sm" variant="outline" stickyHeader
                
                >
                    <Table.Header>
                        <Table.Row zIndex={1}>
                            <SortableHeader columnProps={{left: "0px", position: "sticky"}} columnKey="ubicacion" label="Zona" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnProps={{left: "294px", position: "sticky"}}columnKey="cdc" label="CDC" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="totalPOS" label="Total POS" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="totalPhysical" label="Total Físico" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="difference" label="Diferencia" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="status" label="Estatus" handleSort={handleSort} getSortIcon={getSortIcon} columnProps={{width: "200px", minWidth: "150px", maxWidth: "250px"}} />
                            <SortableHeader columnKey="mxn" label="MXN" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="usd" label="USD" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="eur" label="EUR" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="lib" label="LIB" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="can" label="CAN" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="customer" label="Clientes Generales" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="specialCustomer" label="Clientes Especiales" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="prepaid" label="Prepago" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="employees" label="CXC Empleados" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="intercompany" label="Intercompañia" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tpvBancomerUsd" label="TPV Bancomer USD" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tpvSbdellMxn" label="TPV Sbdell MXN" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tpvColdpatria" label="TPV Coldpatria" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tpvAmexcoCop" label="TPV Amexco COP" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tpvBanamexUsd" label="TPV Banamex USD" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tpvBancomer" label="TPV Bancomer" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tpvAmexco" label="TPV Amexco" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tpvBanamex" label="TPV Banamex" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tpvBbvaCop" label="TPV Bbva COP" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tpvSbdellUsd" label="TPV Sbdell USD" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tpvBancoColombia" label="TPV BancoColombia" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="sbdellAmexMxn" label="TPV sbdell Amex MXN" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="sbdellAmexUsd" label="TPV sbdell Amex USD" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tpvNetpay" label="TPV Netpay" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="webKiosko" label="USWEB KioskoD" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tpvSantander" label="TPV Santander" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="webappUsd" label="WEB app USD" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tpvDinners" label="TPV Dinners" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tpvAdyen" label="TPV Adyen" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tpvAdyenAmex" label="TPV AdyenAmex" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tpvAdyenKiosko" label="TPV AdyenKiosko" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tpvKioskoUsd" label="TPV KioskoUsd" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnKey="tips" label="Propinas electrónicas" handleSort={handleSort} getSortIcon={getSortIcon} />
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {sortedData.map((row) => (
                            <Table.Row key={row.id}>
                                <Table.Cell css={{position:"sticky"}} left="0"><Text> {row.ubicacion} </Text></Table.Cell>
                                <Table.Cell css={{position:"sticky"}} left="294px">
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

                        <Table.Row bg="gray.100" fontWeight="bold">
                            <Table.Cell css={{position:"sticky"}} left="0"/>
                            <Table.Cell css={{position:"sticky"}} left="294"><Text> Totales </Text></Table.Cell>
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
                    <span> Mostrando 1 a {DataReport.length} de {DataReport.length} Registros </span>
                </HStack>
            </PaginationRoot>
        </Box>
    );
}

export default TableGeneralReport;