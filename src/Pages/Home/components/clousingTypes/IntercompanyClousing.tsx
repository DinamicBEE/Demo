import { useEffect, useState } from "react";
import { Box, Table, Text, FormatNumber, ListCollection,
  createListCollection, HStack, Button } from "@chakra-ui/react";
import { PaginationItems, PaginationNextTrigger,
  PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";
import { SelectRoot, SelectTrigger, SelectValueText,
  SelectContent, SelectItem } from "@components/ui/select";
import { IntercompanyClousingProps, IntercompanyLine,
  IntercompanyModel } from "@models/intercompany.model";
import { useIntercompanyContext } from "@context/clousing/intercompanyContext";
import { useFooter } from "@context/home/footerClousingContext";
import { CLOUSING_KEY } from "@models/common.const";
import { Employee } from "@models/employee.model";
import { TableInput } from "@components/NumericInput";
//import { ValueChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/select/namespace";
import { TotalModel } from "@models/common.clousing.model";
import { useHeaders } from "@context/home/headerContext";
import Loading from "@components/Loading";
import FilterEmployee from "@components/FilterEmployee";
import AddIntercompany from "./AddIntercompany";

const pageSize = 10;

function IntercompanyClousing({data, subsidiaryId, cdc}: IntercompanyClousingProps) {
  const [intercompanyLocal, setIntercompany] = useState<IntercompanyModel>({} as IntercompanyModel);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [subsidiariesByRow, setSubsidiariesByRow] = useState<{
    [key: number | string]: ListCollection<any>;
  }>({});

  const {
    intercompany,
    getIntercompanyData,
    setIntercompanyData,
    getEmployeesList,
    getSubsidiaries,
  } = useIntercompanyContext();
  const { updateTotal } = useHeaders();
  const { setFooterData } = useFooter();
  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<IntercompanyLine[]>([]);
  const [dialog, setDialog] = useState<boolean>(false);

  const startRange = (page - 1) * pageSize
  const endRange = startRange + pageSize

  useEffect(() => {
    async function fetchData() {
      if (!data) return;
      setLoading(true);
      const intercompanyData: IntercompanyModel = await getIntercompanyData(
        data?.id
      );
      const employeeList: Employee[] = await getEmployeesList();

      if (intercompanyData)
        setFooterData(
          intercompanyData.total,
          data.id,
          CLOUSING_KEY.INTERCOMPANY
        );

      setIntercompany(intercompanyData);
      setEmployees(employeeList);

      // Inicializar las subsidiarias por fila
      const initialSubsidiariesByRow: {
        [key: number | string]: ListCollection<any>;
      } = {};

      intercompanyData.lines.forEach((line) => {
        initialSubsidiariesByRow[line.id] = createListCollection<any>({
          items: [], // Inicialmente vacío
        });
      });

      if(setSubsidiariesByRow.length === 0) {
        setSubsidiariesByRow(initialSubsidiariesByRow);
      }

      setLoading(false);
    
      const items = intercompanyData?.lines?.slice(startRange, endRange);
      setVisibleItems(items);
    }

    fetchData();
  }, [intercompany]);

  useEffect(() => {
    setPage(page);
    const items = intercompanyLocal?.lines?.slice(startRange, endRange);
    setVisibleItems(items);
  }, [page])

  function updateIntercompany(updateLine: IntercompanyLine[]){
    if (!data) return;

    const newTotalFisico = updateLine.reduce(
      (acc: number, curr: { physicalAmount: number }) =>
        acc + curr.physicalAmount,
      0
    );

    const newDifference = intercompanyLocal.total.totalPOS - newTotalFisico;

    const newTotal: TotalModel = {
      totalPOS: intercompanyLocal.total.totalPOS,
      totalPhysical: newTotalFisico,
      difference: newDifference,
    };

    const intercompanyData: IntercompanyModel = {
      ...intercompanyLocal,
      lines: updateLine,
    };

    setIntercompany(intercompanyData);
    setIntercompanyData(intercompanyData, data?.id);
    updateTotal(newTotalFisico, data.id, CLOUSING_KEY.INTERCOMPANY);
    setFooterData(newTotal, data.id, CLOUSING_KEY.INTERCOMPANY);
  }

  async function handleEmployeeData(
    employee: Employee,
    itemId?: number | string
  ) {
    if (!itemId) return;

    const updateLine: IntercompanyLine[] = intercompanyLocal?.lines.map(
      (item: IntercompanyLine) =>
        item.id === itemId
          ? {
              ...item,
              employeeId: employee.id,
              employeeName: employee.name,
              subsidiaryId: 0,
              subsidiaryName: "",
            }
          : item
    );

    const subsidiaries = await getSubsidiaries(employee.id.toString());

    setSubsidiariesByRow(prev => ({
      ...prev,
      [itemId]: createListCollection<any>({
        items: subsidiaries.map(sub => ({
          value: sub.id,
          label: sub.name,
        })),
      }),
    }));

    updateIntercompany(updateLine);
  }

  function handleAmount(itemId: number | string, value: string) {
    value = value.replace(/[^\d.]/g, "");

    const updateLine: IntercompanyLine[] = intercompanyLocal?.lines.map(
      (item: IntercompanyLine) =>
        item.id === itemId
          ? {
              ...item,
              physicalAmount: parseFloat(value),
            }
          : item
    );

    updateIntercompany(updateLine);
  }

  function handleSubsidiary(
    //event: ValueChangeDetails<any>,
    event: any,//ValueChangeDetails<any>,
    itemId: number | string
  ) {
    if (!subsidiariesByRow[itemId] || !subsidiariesByRow[itemId].items) {
      console.error("No se encontraron subsidiarias para la fila:", itemId);
      return;
    }


    const selectedSubsidiary = subsidiariesByRow[itemId].items.find(
      (item) => item.value === event.value[0]
    );

    if (!selectedSubsidiary) {
      console.error(
        "No se encontró la subsidiaria seleccionada:",
        event.value[0]
      );
      return;
    }

    const subSelect = Number(event.value[0]);
    const subName = selectedSubsidiary.label;

    const updateLine: IntercompanyLine[] = intercompanyLocal?.lines.map(
      (item: IntercompanyLine) =>
        item.id === itemId
          ? {
              ...item,
              subsidiaryId: subSelect,
              subsidiaryName: subName,
            }
          : item
    );

    setIntercompany({ ...intercompanyLocal, lines: updateLine });
    updateIntercompany(updateLine);
  }

  const openDiaolog = () => {
    if (data?.closingConfirmation) return;
    setDialog(true);
  }

  const closeDiaolog = () => {
    setDialog(false);
  }

  return (
    <Box>

      <Button mb={2} colorPalette="meraPrimary" onClick={() => openDiaolog()} disabled={data?.closingConfirmation || intercompanyLocal?.isRoleEditable === false}>Agregar</Button>

      <Table.ScrollArea rounded="md" borderWidth="1px">
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader textAlign="center">
                Empleado
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Subsidiaria
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Monto POS
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Ticket</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Importe físico
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {visibleItems?.map((item: IntercompanyLine) => (
              <Table.Row key={item.id}>
                <Table.Cell textAlign="center">
                  <FilterEmployee
                    employees={employees}
                    employeeSelect={item.employeeName}
                    label={false}
                    itemId={item.id}
                    onSelect={handleEmployeeData}
                    disabled={data?.closingConfirmation || intercompanyLocal?.isRoleEditable === false}
                    employeeToEdit={null}
                  />
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <SelectRoot
                    collection={subsidiariesByRow[item.id]}
                    key={item.employeeId}
                    onValueChange={(event) => handleSubsidiary(event, item.id)}
                    disabled={data?.closingConfirmation || intercompanyLocal?.isRoleEditable === false}
                  >
                    <SelectTrigger>
                      <SelectValueText
                        placeholder={
                          item.subsidiaryName || "Selecciona Subsidiaria"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subsidiariesByRow[item.id]?.items.map((subsidiary) => (
                        <SelectItem item={subsidiary} key={subsidiary.value}>
                          {subsidiary.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <Text>
                    <FormatNumber
                      value={item.amount}
                      style="currency"
                      currency="USD"
                    />
                  </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text> {item.ticket} </Text>
                </Table.Cell>

                <Table.Cell textAlign="end">
                  <TableInput
                    value={item.physicalAmount}
                    id={item.id}
                    currency={true}
                    onChange={handleAmount}
                    disabled={data?.closingConfirmation || intercompanyLocal?.isRoleEditable === false}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
      <PaginationRoot count={intercompanyLocal?.lines?.length??0} pageSize={pageSize} page={page} onPageChange={(e) => setPage(e.page)}>
        <HStack>
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>

      <AddIntercompany clousingId={data?.id ?? 0} isOpen={dialog} onClose={closeDiaolog}/>

      {loading && (
        <Box position="fixed" top="50%" left="50%" zIndex={1000}>
          <Loading />
        </Box>
      )}
    </Box>
  );
}

export default IntercompanyClousing;
