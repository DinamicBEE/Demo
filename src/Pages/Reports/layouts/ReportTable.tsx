import { useEffect, useState } from "react";
import { Box, FormatNumber, HStack, IconButton, Skeleton, Table, TableCell, Text } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "@components/ui/select";
import { NUMBERTYPE_EXECPTION, TABLE_CONFIG } from "@models/const/reportTable.const";
import { HeaderReportModel, ReportTypeMap, SyncErrorsModel } from "@models/reports.model";
import { useReportsContext } from "@context/reports/reportsContext";
import Loading from "@components/Loading";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";
import { changeStatus } from "@services/reportService";
import { PaginatorSize } from "@models/common.const";
import { selectOption } from "@models/common.model";
import { IoPlay } from "react-icons/io5";
import { Tooltip } from "@components/ui/tooltip"
import useSortableTable from "@hooks/useSortableTable/useSortableTable";
import { SortableHeader } from "@utils/table";


function ReportTable<K extends keyof ReportTypeMap>({currentReport}: { currentReport: number}) {
    const [headers, setHeaders] = useState<HeaderReportModel<ReportTypeMap[K]>[]>([]);
    const [visibleItems, setVisibleItems] = useState<ReportTypeMap[K][]>([]);
    const [countTable, setCountTable] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(100)
    const { reportData, loading } = useReportsContext();
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const { sortedData, handleSort, getSortIcon } = useSortableTable<ReportTypeMap[K][]>(reportData);

    const [page, setPage] = useState<number>(1);
    const startRange = (page - 1) * pageSize;
    const endRange = startRange + pageSize;
    
    useEffect(() => {
        async function getHeaders() {
            const reportHeader = TABLE_CONFIG.find(report => report.report === currentReport);
            if (reportHeader) {
                setHeaders(reportHeader.headers as HeaderReportModel<ReportTypeMap[K]>[]);
                setVisibleItems([]);
                setCountTable(0);
                setPage(1);
            } else {
                setHeaders([]);
            }
        }
        getHeaders();
    }, [currentReport]);

    useEffect(() => {
        if(reportData){
            setPage(page);
            let items = sortedData?.slice(startRange, endRange);
            setVisibleItems(items || []);
            setCountTable(sortedData?.length);
        }
    }, [page, reportData, pageSize, sortedData]);

    function renderCellContent(key: keyof ReportTypeMap[K], value: any, index:number) {
        const isNumberExceptions = NUMBERTYPE_EXECPTION.includes(key.toString().toLocaleLowerCase())
        if (isNumberExceptions) {
            return <Text>{value}</Text>;
        }
        
        if (String(key).toLowerCase().includes('percentage')) {
            return <Text>{value} %</Text>;
        }
        
        if (typeof value === 'number') {
            return <FormatNumber value={value} style="currency" currency="USD" />;
        }

        if(key === 'especialStatus') {
            let item = visibleItems as ReportTypeMap[K][]
            const {nextStatus, id} = item[index] as SyncErrorsModel;
            return (
                <HStack alignItems={'center'}>
                  <Text 
                    fontWeight={500}
                    color={nextStatus === 1 ? 'gray.700': nextStatus === 2 ? 'blue.600': 'teal.600'}
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </Text>
                  <Tooltip showArrow content={'Oprimir para cambiar estado a:  ' + (nextStatus === 1 ? 'En proceso': 'Completado')}>
                    <IconButton 
                      rounded="full"
                      color={'gray.600'}
                      onClick={async () => {
                        setDeleteLoading(true);
                        const response = await changeStatus(nextStatus, id)
                        if ( response ){
                            reportData && reportData.splice(index + (pageSize * (page - 1)), 1);
                            setVisibleItems(reportData?.slice(startRange, endRange) || []);
                        }
                        setDeleteLoading(false);
                      }
                    } variant={'ghost'}
                      fontSize={'small'}
                      disabled={deleteLoading}
                    >
                      <IoPlay />
                    </IconButton>
                  </Tooltip>
                </HStack>
            )
        }
        
        return <Text>{String(value)}</Text>;

    }

    return (

        <Box display="flex" flexDirection="column" height="100%">
        {(loading || deleteLoading) && (
            <Box position="fixed" top="50%" left="50%" zIndex={1000}>
            <Loading />
            </Box>
        )}

        <Box
            flex="1"
            display="flex"
            flexDirection="column"
            minHeight="0"
            overflowY={"hidden"}
        >
            <Table.ScrollArea rounded="md" borderWidth="1px">
            <Table.Root size="sm" variant="outline">
                <Table.Header>
                <Table.Row>
                    {headers.map((header) => (
                        <SortableHeader
                            key={String(header.key)}
                            columnKey={String(header.key)}
                            label={header.label}
                            handleSort={handleSort}
                            getSortIcon={getSortIcon}
                        />
                    ))}
                </Table.Row>
                </Table.Header>
                <Table.Body>
                {!loading &&
                    visibleItems.length > 0 &&
                    visibleItems?.map((row, index) => (
                    <Table.Row key={index}>
                        {headers.map((header) => (
                        <TableCell key={String(header.key)}>
                            {renderCellContent(
                            header.key,
                            row[header.key],
                            index,
                            )}
                        </TableCell>
                        ))}
                    </Table.Row>
                ))}
                {loading &&
                    Array.from({ length: 12 }).map((_, rowIndex) => (
                    <Table.Row key={rowIndex}>
                        {Array.from({ length: headers.length }).map(
                        (_, colIndex) => (
                            <Table.Cell key={colIndex} textAlign="center">
                            <Skeleton height="20px" />
                            </Table.Cell>
                        ),
                        )}
                    </Table.Row>
                ))}
                {!loading && visibleItems.length <= 0 && (
                    <Table.Row>
                        <Table.Cell colSpan={headers.length} textAlign="center" py={10}>                            
                            <Text
                                backgroundColor={"#f0f0f0"}
                                textAlign={"center"}
                                borderRadius={"6px"}
                                border={"2px solid #cecece"}
                                borderStyle={"dashed"}
                                color={"#666666"}
                                fontWeight={"600"}
                            >
                                Reporte sin datos
                            </Text>
                        </Table.Cell>
                    </Table.Row>
                )}
                </Table.Body>
            </Table.Root>
            </Table.ScrollArea>
            <Box mt="auto" pt={4} bg="white" bottom="0">
            <PaginationRoot
                count={countTable}
                pageSize={pageSize}
                page={page}
                onPageChange={(e) => {
                setPage(e.page);
                }}
            >
                <HStack justify="end">
                <SelectRoot
                    width="200px"
                    collection={PaginatorSize}
                    onValueChange={(event) => {
                    setPageSize(event.items[0].value);
                    }}
                >
                    <SelectTrigger>
                    <SelectValueText placeholder="Seleccione una opcion" />
                    </SelectTrigger>
                    <SelectContent>
                    {PaginatorSize.items.length > 0 &&
                        PaginatorSize.items.map((item: selectOption) => (
                        <SelectItem item={item} key={item.value}>
                            {item.label}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </SelectRoot>
                <PaginationPrevTrigger />
                <PaginationItems />
                <PaginationNextTrigger />
                </HStack>
            </PaginationRoot>
            </Box>
        </Box>
        </Box>

    );
}

export default ReportTable;