import { useEffect, useState } from "react";
import { Box, FormatNumber, HStack, IconButton, Table, TableCell, Text } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "@components/ui/select";
import { NUMBERTYPE_EXECPTION, TABLE_CONFIG } from "@models/const/reportTable.const";
import { HeaderReportModel, ReportTypeMap, SyncErrorsModel } from "@models/reports.model";
import { useReportsContext } from "@context/reports/reportsContext";
import Loading from "@components/Loading";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";
import { changeStatus } from "@services/reportService";
import { PaginatorSize } from "@models/common.const";
import { selectOption } from "@models/common.model";
import { REPORT_EXECPTION } from "@models/const/reportsService.const";
import { IoPlay } from "react-icons/io5";
import { Tooltip } from "@components/ui/tooltip"


function ReportTable<K extends keyof ReportTypeMap>({currentReport}: { currentReport: number}) {
    const [headers, setHeaders] = useState<HeaderReportModel<ReportTypeMap[K]>[]>([]);
    const [visibleItems, setVisibleItems] = useState<ReportTypeMap[K][]>([]);
    const [countTable, setCountTable] = useState<number>(0)
    const [pageSize, setPageSize] = useState<number>(100)
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
            const isException = REPORT_EXECPTION.includes(currentReport);
            let items: any;
            if(isException){
                items = reportData?.summary?.slice(startRange, endRange);
            } else {
                items = reportData?.slice(startRange, endRange);
            }
            setVisibleItems(items || []);
            setCountTable(reportData?.length);
        }
    }, [page, reportData, pageSize]);

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
            const {nextStatus, nextStatusTool} = item[index] as SyncErrorsModel;
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
                      onClick={() => changeStatus(nextStatus )} variant={'ghost'}
                      fontSize={'small'}
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
        <>
          {visibleItems.length > 0 
            ? <Box  display="flex" flexDirection="column" height="100%">
              {loading && (
                  <Box position="fixed" top="50%" left="50%">
                      <Loading />
                  </Box>
              )}

              <Box flex="1" display="flex" flexDirection="column" minHeight="0" overflowY={'hidden'}>
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
                              {visibleItems?.map((row, index) => (
                                  <Table.Row key={index}>
                                      {headers.map((header) => (
                                          <TableCell key={String(header.key)}>
                                              {renderCellContent(header.key, row[header.key], index)}
                                          </TableCell>
                                      ))}
                                  </Table.Row>
                              ))}
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
                              <SelectRoot width="200px"
                                  collection={PaginatorSize}
                                  onValueChange={(event) => {
                                      setPageSize(event.items[0].value);
                                  }}
                              >
                                  <SelectTrigger>
                                  <SelectValueText placeholder="Seleccione una opcion" />
                                  </SelectTrigger>
                                  <SelectContent>
                                  {PaginatorSize.items.length > 0 && PaginatorSize.items.map((item: selectOption) => (
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
            : <Text
              backgroundColor={"#f0f0f0"}
              textAlign={"center"}
              borderRadius={"6px"}
              border={"2px solid #cecece"}
              borderStyle={"dashed"}
              color={"#666666"}
              fontWeight={"600"}
          >Reporte sin datos</Text>}
        </>
    );
}

export default ReportTable;