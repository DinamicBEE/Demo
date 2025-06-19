import { useEffect, useState } from "react";
import { Headers, Row } from "../../models/report.model";
import { Table, Button, Input, Box, Text, FormatNumber, Heading, Spinner, Skeleton } from "@chakra-ui/react";
import { ActionBarContent, ActionBarRoot, ActionBarSelectionTrigger, ActionBarSeparator } from "@components/ui/action-bar";
import { RiCheckFill } from "react-icons/ri";
import { Checkbox } from "@components/ui/checkbox";
import "./ReportViewer.css";
import { InputGroup } from "@components/ui/input-group";
import { useReportContext } from "@context/reports/reportsContext";
import { Toaster, toaster } from "@components/ui/toaster";
import { fetchInitialData } from "@services/reportService";
//import { Skeleton } from "@components/ui/skeleton";
import { ReportFilterComponent } from "./ReportFilterComponent/ReportFilterComponent";
import { getCurrentDate } from './ReportComponents/getCurrentDate';
import Cookies from "js-cookie";

function ReportViewer() {
  const user = Cookies.get('username');
  const { report, setReport, respaldar, resetRows } = useReportContext();
  const { rows, headers} = report;
  const [useRows, setUseRows] = useState<Row[]>(rows);
  const [useHeaders, setHeaders] = useState<Headers[]>([]);
  const [selection, setSelection] = useState<number[]>([]);
  const [disabledRow, setDisabledRowCount] = useState<number>(0);
  const [totalsByColumn, setTotalsByColumn] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);


  const hasSelection = selection.length > disabledRow;
  const indeterminate = hasSelection && selection.length < useRows.length;

  const getSortedHeaders = (headers: Headers[]) => {
    const general = headers.filter(
      (header) =>
        !header.code.startsWith("pos_") && !header.code.startsWith("ns_")
    );
    const pos = headers.filter((header) => header.code.startsWith("pos_"));
    const ns = headers.filter((header) => header.code.startsWith("ns_"));
    setHeaders([
      ...general,
      ...ns,
      ...pos,
      { code: "diference", name: "Diferencia" },
    ]);
  };

  useEffect(() => {
    fetchData();
    setConfirmLoading(false);
  }, []);

  const fetchData = async() => {
    setLoading(true);
    await fetchInitialData()
      .then( (data) => {
        if (data != null) {
          
          setLoading(false);
          // console.log(data);
          getSortedHeaders(data.headers);
          // updateAllRowsTotals(data.rows);
          initialHandleDisabledRows(data.rows);
          const newArr = data.rows.filter((row) => row.confirmed).map((row) => row.id);
          setSelection(newArr);
          setDisabledRowCount(newArr.length);
          // setUseRows(initialHandleDisabledRows(data.rows));
        }
      });
      // updateAllRowsTotals();
  }

  useEffect(() => {

    getTotalByColumns();
    setReport({ headers, rows: useRows });
    const newArr = useRows.filter((row) => row.confirmed).map((row) => row.id);
    setSelection(newArr);
    setDisabledRowCount(newArr.length);
    
  }, [useRows]);


  
  useEffect(() => {
    if (JSON.stringify(rows) !== JSON.stringify(useRows)) {
      setUseRows(rows);
    }
  }, [rows]);

  
  const initialHandleDisabledRows = (rows: Row[]) => {
    const newArr = rows.map((row) => {
      if (selection.includes(row.id)) {
        const updatedRow = {
          ...row,
          confirmed: true,
          approved: {
            id: 0,
            name: row.approved.name,
            date: row.approved.date,
          },
        };
        return updatedRow;
      }
      return row;
    });

    const sumArr = newArr.map((row) => {
      const posTotal = row.data
        .filter((item) => item.code.startsWith('pos_') && item.code !== 'pos_total')
        .reduce((sum, item) => sum + (typeof item.value === 'number' ? item.value : 0), 0);

      const updatedData = row.data.map((item) =>
        item.code === 'pos_total' ? { ...item, value: posTotal } : item,
      );

      return { ...row, data: updatedData };
    });    

    // return sumArr
    if (useRows.length == 0) {

      setUseRows(sumArr); // TODO: Reemplazar con función a API para guardar las selecciones
    }
    respaldar(sumArr);
    // updateAllRowsTotals(newArr);
  }

  const confirm = async () => {
    setConfirmLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 5000)); 
    const newArr = useRows.map((row) => {
      if (selection.includes(row.id)) {
        const updatedRow = {
          ...row,
          confirmed: true,
          approved: {
            id: 0,
            name: row.approved.name === "" 
                  ? user!
                  : row.approved.name,
            date: row.approved.date === ""
                  ? getCurrentDate()
                  : row.approved.date,
          },
        };
        return updatedRow;
      }
      return row;
    });
    
    setUseRows(newArr);
    setReport({ headers, rows: newArr });
    respaldar(newArr);
    setConfirmLoading(false);
    toaster.create({
      title: `Se ha guardado correctamente`,
      type: "success",});
  };

  const getConfirmationButton = () => {
    if (!confirmLoading) {
      return <Button
      onClick={ confirm }
      colorPalette="teal"
      variant="solid"
    >
      Confirmar <RiCheckFill />
    </Button>

    } else {
      return <Button 
      colorPalette="teal"
      variant="solid"
      disabled={true}
      >
        Guardando <Spinner size="sm" />
      </Button>
    }
  }

  const handleCheckAll = (changes: any) => {
    setSelection(
      changes.checked
        ? useRows.map((row) => row.id)
        : useRows.filter((row) => row.confirmed).map((row) => row.id)
    );
  };

  // Función para obtener el valor de la celda
  const getCellValue = (row: Row, header: Headers) => {
    const dataItem = row.data.find((d) => d.code === header.code);
    return dataItem ? dataItem.value : "";
  };

  const handleInputChange = (rowId: number, newValue: number, code: string) => {
    const updatedRows = useRows.map((row) =>
      row.id === rowId
        ? {
            ...row,
            data: row.data.map((d) =>
              d.code === code ? { ...d, value: newValue } : d
            ),
          }
        : row
    );
    const rowsWithTotals = updateRowTotal(rowId, updatedRows);
    setUseRows(rowsWithTotals);
    getDiference(rowsWithTotals.find((row) => row.id === rowId)!);
    setReport({ headers, rows: rowsWithTotals });
  };

  const updateRowTotal = (rowId: number, updatedRows: Row[] = useRows) => {
    return updatedRows.map((row) => {
      if (row.id === rowId) {
        const posTotal = row.data
          .filter((item) => item.code.startsWith("pos_") && item.code !== "pos_total")
          .reduce((sum, item) => sum + (typeof item.value === "number" ? item.value : 0), 0);
        const updatedData = row.data.map((item) =>
          item.code === "pos_total" ? { ...item, value: posTotal } : item
        );
        return { ...row, data: updatedData };
      }
      return row;
    });
  };

  const updateAllRowsTotals = (newRows: Row[]) => {
    
    
    const newArr = newRows.map((row) => {
      const posTotal = row.data
        .filter((item) => item.code.startsWith('pos_') && item.code !== 'pos_total')
        .reduce((sum, item) => sum + (typeof item.value === 'number' ? item.value : 0), 0);

      const updatedData = row.data.map((item) =>
        item.code === 'pos_total' ? { ...item, value: posTotal } : item,
      );

      return { ...row, data: updatedData };
    });    
    // console.log("rows total", newArr);
    setUseRows(newArr);
   
    setReport({ headers: headers, rows: newArr });
    respaldar(newArr);
    // resetRows();
    // setReport({headers: headers, rows: newArr});
  };


  const getDiference = (row: Row) => {
    const a = row?.data
      .filter((r) => r.code == "pos_total")
      .map((r) => r.value);
    const b = row?.data.filter((r) => r.code == "ns_total").map((r) => r.value);

    const diference = Number(b) - Number(a);
    return diference;
  };

  const getTotalByColumns = () => {
    const totals: Record<string, number> = {};
    useRows.map((row) => {
      row.data.map((d) => {
        if (typeof d.value === "number") {
          if (!totals[d.code]) {
            totals[d.code] = 0;
          }
          totals[d.code] += d.value;
        } else {
          totals[d.code] = 0;
        }
      });
    });

    setTotalsByColumn(totals);
  };

  const renderCellContent = (row: Row, header: Headers) => {
    const { code } = header;
    if (code === "approvedName") {
      return (
        <Table.Cell key={`${row.id}-${code}`} textAlign="center">
          {row.approved.name}
        </Table.Cell>)
    }
    if (code === "approvedDate") {
      return (
        <Table.Cell key={`${row.id}-${code}`} textAlign="center">
          {row.approved.date}
        </Table.Cell>)
    }
    if (code === "diference") {
      return (
        <Table.Cell key={`${row.id}-${code}`} textAlign="end">
          <Text textAlign="center">
            <FormatNumber
              value={getDiference(row)}
              style="currency"
              currency="USD"
            />
          </Text>
        </Table.Cell>
      );
    }
    if (!code.startsWith("pos_")) {
      const cellValue = getCellValue(row, header);
      return typeof cellValue === "string" ? (
        <Table.Cell key={`${row.id}-${code}`} textAlign="center">
          {cellValue}
        </Table.Cell>
      ) : (
        <Table.Cell key={`${row.id}-${code}`} textAlign="end">
          <Text>
            <FormatNumber
              value={Number(cellValue)}
              style="currency"
              currency="USD"
            />
          </Text>

        </Table.Cell>
      );
    }
    return (
      <Table.Cell key={`${row.id}-${code}`} textAlign="end">
        <InputGroup w="100%" startElement="$">
          <Input
            minW="100px"
            readOnly={header.code === "pos_total"}
            disabled={row.confirmed}
            type="number"
            textAlign="end"
            value={getCellValue(row, header)}
            onChange={(e) =>
              handleInputChange(row.id, Number(e.target.value), header.code)
            }
          />
        </InputGroup>
      </Table.Cell>
    );
  };

  const getTable = () => {
    return (
      <>
        <Table.ScrollArea
            borderWidth="1px"
            maxW="100%"
            rounded="md"
            mt="4"
            overflowY="auto"
            flex={1}
          >
            <Table.Root size="sm" variant="outline">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader textAlign="center">
                    <Checkbox
                      checked={
                        indeterminate
                          ? "indeterminate"
                          : selection.length - disabledRow > 0
                      }
                      onCheckedChange={(changes) => {
                        // console.log(changes);
                        handleCheckAll(changes);
                      }}
                    />
                  </Table.ColumnHeader>
                  {useHeaders.map((h) => (
                    <Table.ColumnHeader textAlign="center" key={h.code}>
                      {h.name}
                    </Table.ColumnHeader>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body position="relative">
                {
                  // TODO: Mover a componente de únicamente Rows
                }
                {useRows.map((row) => (
                  <Table.Row key={row.id}>
                    <Table.Cell 
                      textAlign="center"
                    >
                      <Checkbox
                        disabled={row.confirmed}
                        checked={selection.includes(row.id)}
                        onCheckedChange={(changes) => {
                          setSelection((prev) =>
                            changes.checked
                              ? [...prev, row.id]
                              : selection.filter((id) => id !== row.id)
                          );
                        }}
                      />
                    </Table.Cell>
                    {useHeaders.map((h) => (
                        renderCellContent(row, h)
                      
                    ))}
                    {/* <Table.Cell> {} </Table.Cell> */}
                  </Table.Row>
                ))}
                <Table.Row>
                  <Table.Cell textAlign="end">
                    <Heading size="sm">Totales</Heading>
                  </Table.Cell>
                  {useHeaders.map((h, i) =>
                    !h.code.startsWith("pos_") && !h.code.startsWith("ns_") ? (
                      <Table.Cell  key={i}></Table.Cell>
                    ) : (
                      <Table.Cell textAlign="end" key={i}>
                        <Heading size="sm">
                          
                          <Text>
                            <FormatNumber
                              value={typeof totalsByColumn[h.code] == 'number' ? totalsByColumn[h.code] : 0}
                              style="currency"
                              currency="USD"
                            />
                          </Text>
                        </Heading>
                      </Table.Cell>
                    )
                  )}
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
      </>

    )
  }

  const getSkeletons = () => {
    if (loading) {
      return (
        <Table.ScrollArea
          borderWidth="1px"
          maxW="100%"
          rounded="md"
          mt="4"
          overflowY="auto"
          flex={1}
        >
          <Table.Root 
          variant="outline"
          >
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>
                  <Skeleton height="5" width="100%" />
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <Skeleton height="5" width="100%" />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Skeleton height="5" width="100%" />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Skeleton height="5" width="100%" />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Skeleton height="5" width="100%" />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      )
    }
  }

  return (
    <>
      <Box p={6} boxShadow="xl" borderRadius="lg" bg="white" maxH="max-content">
        <Heading>Generación de Reportes</Heading>
        <ReportFilterComponent />
        
      {loading ? getSkeletons() : getTable()}

      </Box>
        <ActionBarRoot open={hasSelection}>
          <ActionBarContent>
            <ActionBarSelectionTrigger>
              {selection.length - disabledRow} {`venta(s) seleccionada(s)`}
            </ActionBarSelectionTrigger>
            <ActionBarSeparator />
              {getConfirmationButton()}
          </ActionBarContent>
        </ActionBarRoot>
              <Toaster />
      
    </>
  );
}

export default ReportViewer;
