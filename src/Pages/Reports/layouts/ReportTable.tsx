import { useEffect, useState } from "react";
import { Box, FormatNumber, Table, Text } from "@chakra-ui/react";
import { TABLE_CONFIG } from "@models/reportsConstansts.model";
import { HeaderReportModel, ReporGeneralRequesttModel } from "@models/reports.model";
import { useReportsContext } from "@context/reports/reportsContext";
import Loading from "@components/Loading";

function ReportTable({currentReport}: { currentReport: number}) {
    const [headers, setHeaders] = useState<HeaderReportModel[]>([]);
    const [data, setData] = useState<any[]>([]);
    const { reportData, loading, getReportData } = useReportsContext();
  
    useEffect(() => {
        async function getHeaders() {
            const reportHeader = TABLE_CONFIG.find(report => report.report === currentReport);
            if (reportHeader) {
                setHeaders(reportHeader.headers);
            } else {
                setHeaders([]);
            }
            const request: ReporGeneralRequesttModel = {
                report: currentReport
            }
            getReportData(request)
        }
        getHeaders();
    }, [currentReport]);

    useEffect(() => {
        
        if(reportData){
            setData(reportData);
        }

    }, [reportData]);

    function renderCellContent(key: string, value: any) {
        if (key === 'quantity') {
            return <Text>{value}</Text>;
        }
        
        if (typeof value === 'number') {
            return <FormatNumber value={value} style="currency" currency="USD" />;
        }
        
        return <Text>{String(value)}</Text>;

    }

    return (
        <>
            {loading && (
                <Box position="fixed" top="50%" left="50%" zIndex="1">
                    <Loading />
                </Box>
            )}

            <Box>
                <Table.ScrollArea rounded="md" borderWidth="1px">
                    <Table.Root size="sm" variant="outline">
                        <Table.Header>
                            {headers.map((header) => (
                                <Table.ColumnHeader key={header.key}>{header.label}</Table.ColumnHeader>
                            ))}
                        </Table.Header>
                        <Table.Body>
                            {data.map((row, index) => (
                                <Table.Row key={index}>
                                    {headers.map((header) => (
                                        <Table.Cell key={header.key}>
                                            {renderCellContent(header.key, row[header.key])}
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>
                {/* <PaginationRoot
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
                </PaginationRoot> */}
            </Box>
        </>
    );
}

export default ReportTable;