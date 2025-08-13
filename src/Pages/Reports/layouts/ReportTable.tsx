import { useEffect, useState } from "react";
import { Box, FormatNumber, HStack, Table, TableCell, Text } from "@chakra-ui/react";
import { TABLE_CONFIG } from "@models/reportsConstansts.model";
import { HeaderReportModel, ReportTypeMap } from "@models/reports.model";
import { useReportsContext } from "@context/reports/reportsContext";
import Loading from "@components/Loading";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";

const pageSize = 10;

function ReportTable<K extends keyof ReportTypeMap>({currentReport}: { currentReport: number}) {
    const [headers, setHeaders] = useState<HeaderReportModel<ReportTypeMap[K]>[]>([]);
    const [visibleItems, setVisibleItems] = useState<ReportTypeMap[K][]>([]);
    const { reportData, loading } = useReportsContext();

    const [page, setPage] = useState<number>(1);
    const startRange = (page - 1) * pageSize;
    const endRange = startRange + pageSize;
  
    useEffect(() => {
        async function getHeaders() {
            const reportHeader = TABLE_CONFIG.find(report => report.report === currentReport);
            if (reportHeader) {
                setHeaders(reportHeader.headers as HeaderReportModel<ReportTypeMap[K]>[]);
                setVisibleItems([]);
            } else {
                setHeaders([]);
            }
        }
        getHeaders();
    }, [currentReport]);

    useEffect(() => {
        if(reportData){
            setPage(page);
            const items = reportData?.slice(startRange, endRange);
            setVisibleItems(items);
        }
    }, [page, reportData]);

    function renderCellContent(key: keyof ReportTypeMap[K], value: any) {
        if (key === 'quantity') {
            return <Text>{value}</Text>;
        }
        
        if (String(key).toLowerCase().includes('percentage')) {
            return <Text>{value} %</Text>;
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
                          <Table.Row>

                            {headers.map((header) => (
                              <Table.ColumnHeader key={String(header.key)}>{header.label}</Table.ColumnHeader>
                            ))}
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {visibleItems.map((row, index) => (
                                <Table.Row key={index}>
                                    {headers.map((header) => (
                                        <TableCell key={String(header.key)}>
                                            {renderCellContent(header.key, row[header.key])}
                                        </TableCell>
                                    ))}
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>
                <PaginationRoot
                    count={reportData?.length ?? 0}
                    pageSize={pageSize}
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
        </>
    );
}

export default ReportTable;