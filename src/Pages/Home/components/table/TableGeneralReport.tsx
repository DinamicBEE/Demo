import { useNavigate } from "react-router-dom";
import { Box, FormatNumber, Skeleton, Table, Tag, Text } from "@chakra-ui/react";
import { HomeParamsProps, ReportClousingLinesModel, ReportTotalsModel } from "@models/common.clousing.model";
import { useClousing } from "@context/home/clousingContext";
import useSortableTable from "@hooks/useSortableTable/useSortableTable";
import { STATUS } from "@models/const/status.const";
import { getStatusColor } from "@utils/getStatusColor";
import { SortableHeader } from "@utils/table";
import "./TableStyle.css";
import { TableDataModel } from "@models/common.model";

function TableGeneralReport({DataReport, Totals, date, loading}: {DataReport: TableDataModel, Totals: ReportTotalsModel, date: string, loading: boolean}) {
    const navigate = useNavigate();
    const { getInfo } = useClousing();
    const { sortedData, handleSort, getSortIcon } = useSortableTable<ReportClousingLinesModel>(DataReport.data);
    
    function getDetailsCDC (id: number){

        const cdcData = DataReport.data.find((cdc) => cdc.cdcId === id);

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
        navigate("/sellers",{
            state: { homeParams }
        })

    }

    const statusColor = (status: STATUS) => {
        return getStatusColor(status);
    }

    function renderCellContent(key: keyof ReportClousingLinesModel, value: any) {

        if(value === undefined){
            return
        }

        if(key === "status") {
            return(
                <Tag.Root colorPalette={statusColor(value as STATUS)}>
                    <Tag.Label>{value}</Tag.Label>
                </Tag.Root>
            )
        }

        return <FormatNumber value={Number(value)} style="currency" currency="USD" />
    }

    return (
        <Box>
            <Table.ScrollArea rounded="md" borderWidth="1px" h="500px" mb="8px">
                <Table.Root size="sm" variant="outline" stickyHeader>
                    <Table.Header>
                        <Table.Row zIndex={1}>
                            <SortableHeader columnProps={{left: "0px", position: "sticky", minW: "294px"}} columnKey="ubicacion" label="Zona" handleSort={handleSort} getSortIcon={getSortIcon} />
                            <SortableHeader columnProps={{left: "294px", position: "sticky"}}columnKey="cdc" label="CDC" handleSort={handleSort} getSortIcon={getSortIcon} />
                            { 
                                DataReport.headers.map(header => (
                                    <SortableHeader key={header.key} columnKey={header.key} label={header.label} handleSort={handleSort} getSortIcon={getSortIcon} />
                                ))
                            }

                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {loading && Array.from({ length: 12 }).map((_, rowIndex) => (
                                <Table.Row key={rowIndex}>
                                {Array.from({ length: 12 }).map((_, colIndex) => (
                                    <Table.Cell key={colIndex} textAlign="center">
                                    <Skeleton height="20px" />
                                    </Table.Cell>
                                ))}
                                </Table.Row>
                            )
                        )}
                        { sortedData.map((row) => (
                            <Table.Row key={row.id} className="row_bg">
                                <Table.Cell className="row_bg_column1"><Text truncate> {row.ubicacion} </Text></Table.Cell>
                                <Table.Cell className="row_bg_column2" truncate
                                  onClick={() => {
                                    getDetailsCDC(row.cdcId);
                                  }}>
                                    <Text
                                        truncate
                                        as="span"
                                        cursor="pointer"
                                        _hover={{
                                          textDecoration:"underline"
                                        }}
                                        color="blue.500"
                                        onClick={() => {
                                            getDetailsCDC(row.cdcId);
                                        }}
                                    > {row.cdc} </Text>
                                </Table.Cell>
                                { 
                                    DataReport.headers.map(header =>(
                                        <Table.Cell key={header.key}>
                                            {renderCellContent(header.key as keyof ReportClousingLinesModel, row[header.key as keyof ReportClousingLinesModel])}
                                        </Table.Cell>
                                    ))
                                }

                            </Table.Row>
                        ))}
                    </Table.Body>
                    <Table.Footer css={{position:"sticky", bottom:0}}>
                        <Table.Row fontWeight="bold" bg={"bg.subtle"}>
                            <Table.Cell css={{position:"sticky", left:0}} bg={"bg.subtle"}/>
                            <Table.Cell css={{position:"sticky", left:"294px"}} bg={"bg.subtle"}><Text> Totales </Text></Table.Cell>
                            {
                                DataReport.headers.map(header => (
                                    <Table.Cell key={header.key}>
                                        {renderCellContent(header.key as keyof ReportClousingLinesModel, Totals[header.key as keyof ReportTotalsModel])}
                                    </Table.Cell>
                                ))
                            }
                        </Table.Row>
                    </Table.Footer>
                </Table.Root>
            </Table.ScrollArea>

            <p className="bt-2"> Mostrando <span style={{fontWeight: "bold"}}>1</span> a <span style={{fontWeight: "bold"}}>{DataReport.data.length}</span> de <span style={{fontWeight: "bold"}}>{DataReport.data.length}</span> Registros </p>
        </Box>
    );
}

export default TableGeneralReport;