import { useEffect, useState } from "react";
import { Box, Table, Text, FormatNumber, ListCollection,
  createListCollection, HStack } from "@chakra-ui/react";
import { PaginationItems, PaginationNextTrigger,
  PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";
import { SelectRoot, SelectTrigger, SelectValueText,
  SelectContent, SelectItem } from "@components/ui/select";
import { IntercompanyClousingProps, IntercompanyLine,
  IntercompanyModel } from "@models/intercompany.model";
import { useIntercompanyContext } from "@context/clousing/intercompanyContext";
import { useFooter } from "@context/home/footerClousingContext";
import { CLOUSING_KEY } from "@models/constants.model";
import { Employee } from "@models/employee.model";
import { TableInput } from "@components/NumericInput";
import { ValueChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/select/namespace";
import { TotalModel } from "@models/common.clousing.model";
import { useHeaders } from "@context/home/headerContext";
import Loading from "@components/Loading";
import FilterEmployee from "@components/FilterEmployee";
import { it } from "node:test";

const pageSize = 10;

function IntercompanyClousing({data}: IntercompanyClousingProps) {
  const [intercompany, setIntercompany] = useState<IntercompanyModel>({} as IntercompanyModel);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [subsidiariesByRow, setSubsidiariesByRow] = useState<{
    [key: number | string]: ListCollection;
  }>({});

  const {
    getIntercompanyData,
    setIntercompanyData,
    getEmployeesList,
    getSubsidiaries,
  } = useIntercompanyContext();
  const { updateTotal } = useHeaders();
  const { setFooterData } = useFooter();
  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<IntercompanyLine[]>([])

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
        [key: number | string]: ListCollection;
      } = {};

      intercompanyData.lines.forEach((line) => {
        initialSubsidiariesByRow[line.id] = createListCollection({
          items: [], // Inicialmente vacío
        });
      });

      setSubsidiariesByRow(initialSubsidiariesByRow);
      setLoading(false);
      updateTotal(intercompanyData.total.totalPhysical, data.id, CLOUSING_KEY.INTERCOMPANY);
    
      const items = intercompanyData?.lines?.slice(startRange, endRange);
      setVisibleItems(items);
    }

    fetchData();
  }, []);

  useEffect(() => {
    setPage(page);
    const items = intercompany?.lines?.slice(startRange, endRange);
    setVisibleItems(items);
  }, [page])

  function updateIntercompany(updateLine: IntercompanyLine[]){
    if (!data) return;

    const newTotalFisico = updateLine.reduce(
      (acc: number, curr: { physicalAmount: number }) =>
        acc + curr.physicalAmount,
      0
    );

    const newDifference = intercompany.total.totalPOS - newTotalFisico;

    const newTotal: TotalModel = {
      totalPOS: intercompany.total.totalPOS,
      totalPhysical: newTotalFisico,
      difference: newDifference,
    };

    const intercompanyData: IntercompanyModel = {
      ...intercompany,
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

    const updateLine: IntercompanyLine[] = intercompany?.lines.map(
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

    // Actualizar las subsidiarias solo para la fila actual
    const updatedSubsidiariesByRow = {
      ...subsidiariesByRow,
      [itemId]: createListCollection({
        items: subsidiaries.map((item) => ({
          value: item.id,
          label: item.name,
        })),
      }),
    };

    setSubsidiariesByRow(updatedSubsidiariesByRow);
    updateIntercompany(updateLine);
  }

  function handleAmount(itemId: number | string, value: string) {
    value = value.replace(/[^\d.]/g, "");

    const updateLine: IntercompanyLine[] = intercompany?.lines.map(
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
    event: ValueChangeDetails<any>,
    itemId: number | string
  ) {
    if (!subsidiariesByRow[itemId] || !subsidiariesByRow[itemId].items) {
      console.error("No se encontraron subsidiarias para la fila:", itemId);
      return;
    }

    console.log("subsidiariesByRow", event);

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

    const updateLine: IntercompanyLine[] = intercompany?.lines.map(
      (item: IntercompanyLine) =>
        item.id === itemId
          ? {
              ...item,
              subsidiaryId: subSelect,
              subsidiaryName: subName,
            }
          : item
    );

    setIntercompany({ ...intercompany, lines: updateLine });
    updateIntercompany(updateLine);
  }

  return (
    <Box>
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
                    disabled={data?.closingConfirmation ?? false}
                  />
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <SelectRoot
                    collection={subsidiariesByRow[item.id]}
                    key={item.employeeId}
                    onValueChange={(event) => handleSubsidiary(event, item.id)}
                    disabled={data?.closingConfirmation}
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
                    disabled={data?.closingConfirmation}
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
      <PaginationRoot count={intercompany?.lines?.length??0} pageSize={pageSize} page={page} onPageChange={(e) => setPage(e.page)}>
        <HStack>
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>

      {loading && (
        <Box position="fixed" top="50%" left="50%" zIndex="1">
          <Loading />
        </Box>
      )}
    </Box>
  );
}

export default IntercompanyClousing;
