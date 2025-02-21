import { useEffect, useState } from "react";
import { Headers, Row } from "../../models/report.model";
import { Table, Button, Input, Box, Text, FormatNumber, Heading } from "@chakra-ui/react";
import { ActionBarContent, ActionBarRoot, ActionBarSelectionTrigger, ActionBarSeparator } from "@components/ui/action-bar";
import { RiCheckFill } from "react-icons/ri";
import { Checkbox } from "@components/ui/checkbox";
import { CheckedChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/checkbox/namespace";
import { useUser } from "../../context/UserContext";
import "./ReportViewer.css";
import "../Home/Home.css";
import { ReportFilterComponent } from "./ReportFilterComponent/ReportFilterComponent";
import { getCurrentDate } from "./ReportComponents/getCurrentDate";
import { InputGroup } from "@components/ui/input-group";
import { useReportContext } from "@context/reports/reportsContext";
import { Toaster, toaster } from "@components/ui/toaster";

function ReportViewer() {
  const { user } = useUser();
  const { report, setReport, respaldo, respaldar } = useReportContext();
  const { rows, headers} = report;
  const [useRows, setRows] = useState<Row[]>(rows);
  const [useHeaders, setHeaders] = useState<Headers[]>([]);
  const [selection, setSelection] = useState<number[]>([]);
  const [disabledRow, setDisabledRowCount] = useState<number>(0);
  const [totalsByColumn, setTotalsByColumn] = useState<Record<string, number>>({});


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

  const initializeRespaldo = () => {
    if (respaldo.length === 0) {
      respaldar(rows);
    }
  };
  // TODO: Agregar función de llamado a API para obtener la data de la tabla
  useEffect(() => {
    getSortedHeaders(headers);
    initialHandleDisabledRows();
    updateAllRowsTotals();
    const newArr = useRows.filter((row) => row.confirmed).map((row) => row.id);
    setSelection(newArr);
    setDisabledRowCount(newArr.length);
  }, []);

  useEffect(() => {
    getTotalByColumns();
    // handleDisabledRows();
    setReport({ headers, rows: useRows });
    const newArr = useRows.filter((row) => row.confirmed).map((row) => row.id);
    setSelection(newArr);
    setDisabledRowCount(newArr.length);
  }, [useRows]);

  useEffect(() => {
    setRows(rows);
  }, [rows]);

  
  const initialHandleDisabledRows = () => {
    const newArr = useRows.map((row) => {
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

    // setRows(newArr); // TODO: Reemplazar con función a API para guardar las selecciones
    
    setRows(newArr);
    setReport({ headers, rows: newArr });
  }

  const confirm = () => {
    const newArr = useRows.map((row) => {
      if (selection.includes(row.id)) {
        const updatedRow = {
          ...row,
          confirmed: true,
          approved: {
            id: 0,
            name: row.approved.name === "" 
                  ? `${user.first_name} ${user.last_name}`
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
    
    setRows(newArr);
    setReport({ headers, rows: newArr });
    respaldar(newArr);
    toaster.create({
      title: `Se ha guardado correctamente`,
      type: "success",});
  };

  const handleCheckAll = (changes: CheckedChangeDetails) => {
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
    setRows(rowsWithTotals);
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

  const updateAllRowsTotals = () => {
    
    const newArr = useRows.map((row) => {
      const posTotal = row.data
        .filter((item) => item.code.startsWith('pos_') && item.code !== 'pos_total')
        .reduce((sum, item) => sum + (typeof item.value === 'number' ? item.value : 0), 0);

      const updatedData = row.data.map((item) =>
        item.code === 'pos_total' ? { ...item, value: posTotal } : item,
      );

      return { ...row, data: updatedData };
    });
    setRows(newArr);
    setReport({headers: headers, rows: newArr});4

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

  // const confirm =() => {
  //   handleDisabledRows();
    
  //   respaldar(useRows);
  //   console.log("confirm",useRows);
  //   toaster.create({
  //     title: `Se ha guardado correctamente`,
  //     type: "success",});
  // }

  return (
    <>
      <Box p={6} boxShadow="xl" borderRadius="lg" bg="white" maxH="max-content">
        <Heading size="md">Generación de Reportes</Heading>
        <ReportFilterComponent />
        <Table.ScrollArea
          borderWidth="1px"
          maxW="100%"
          rounded="md"
          mt="4"
          overflowY="auto"
          flex={1}
        >
          <Table.Root size="sm" variant="outline" striped>
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
                      console.log(changes);
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
                {useHeaders.map((h) =>
                  !h.code.startsWith("pos_") && !h.code.startsWith("ns_") ? (
                    <Table.Cell></Table.Cell>
                  ) : (
                    <Table.Cell textAlign="end">
                      <Heading size="sm">
                        <Text>
                          <FormatNumber
                            value={totalsByColumn[h.code]}
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

        {
          //TODO: Mover el Action a un componente
        }
        <ActionBarRoot open={hasSelection}>
          <ActionBarContent>
            <ActionBarSelectionTrigger>
              {selection.length - disabledRow} {`venta(s) seleccionada(s)`}
            </ActionBarSelectionTrigger>
            <ActionBarSeparator />
            <Button
              onClick={ confirm }
              colorPalette="teal"
              variant="solid"
            >
              Confirmar <RiCheckFill />
            </Button>
          </ActionBarContent>
        </ActionBarRoot>
              <Toaster />
      </Box>
      
    </>
  );
}

export default ReportViewer;
