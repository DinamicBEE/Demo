import { useEffect, useState } from "react";
import { Box, Table, Text, FormatNumber, ListCollection, createListCollection } from "@chakra-ui/react";
import { SelectRoot, SelectTrigger, SelectValueText, SelectContent, SelectItem, } from "@components/ui/select"
import { IntercompanyLine, IntercompanyModel } from "@models/intercompany.model";
import { useIntercompanyContext } from "@context/clousing/intercompanyContext";
import { useFooter } from "@context/home/footerClousingContext";
import { CLOUSING_KEY } from "@models/constants.model";
import { Employee } from "@models/employee.model";
import { TableInput } from "@components/NumericInput";
import { useList } from "@context/home/listsContext";
import { ValueChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/select/namespace";
import { TotalModel } from "@models/common.clousing.model";
import { useHeaders } from "@context/home/headerContext";
import Loading from "@components/Loading";
import FilterEmployee from "@components/FilterEmployee";

function IntercompanyClousing({ data }: any) {
  const [intercompany, setIntercompany] = useState<IntercompanyModel>({} as IntercompanyModel);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [subsidiariesByRow, setSubsidiariesByRow] = useState<{ [key: number]: ListCollection }>({});

  const { getIntercompanyData, setIntercompanyData, getEmployeesList, getSubsidiaries } = useIntercompanyContext();
  const { getSubsidiariesData } = useList();
  const { updateTotal } = useHeaders();
  const { setFooterData } = useFooter();

  useEffect(() => {
    async function fetchData() {

      setLoading(true)

      const intercompanyData: IntercompanyModel = await getIntercompanyData(data?.id);
      const employeeList: Employee[] = await getEmployeesList();
      const subsidiariesData = await getSubsidiariesData();

      if (intercompanyData) setFooterData(intercompanyData.total, data.id, CLOUSING_KEY.INTERCOMPANY);

      setIntercompany(intercompanyData);
      setEmployees(employeeList);

      // Inicializar las subsidiarias por fila
      const initialSubsidiariesByRow: { [key: number]: ListCollection } = {};

      intercompanyData.lines.forEach((line) => {
        initialSubsidiariesByRow[line.id] = createListCollection({
          items: subsidiariesData.map(item => ({
            value: item.id,
            label: item.name,
          })),
        });
      });


      setSubsidiariesByRow(initialSubsidiariesByRow);
      setLoading(false);
      updateTotal(intercompanyData.total.totalPhysical, data.id, CLOUSING_KEY.INTERCOMPANY);
    }

    fetchData();

  }, []);

  function updateIntercompany(updateLine: IntercompanyLine[]) {

    const newTotalFisico = updateLine.reduce(
      (acc: number, curr: { physicalAmount: number }) => acc + curr.physicalAmount,
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
      lines: updateLine
    }

    setIntercompany(intercompanyData);
    setIntercompanyData(intercompanyData, data?.id);
    updateTotal(newTotalFisico, data.id, CLOUSING_KEY.INTERCOMPANY);
    setFooterData(newTotal, data.id, CLOUSING_KEY.INTERCOMPANY);

  }

  async function handleEmployeeData(employee: Employee, itemId?: number) {

    if (!itemId) return;

    const updateLine: IntercompanyLine[] = intercompany?.lines.map((item: IntercompanyLine) =>
      item.id === itemId
        ? {
          ...item,
          employeeId: employee.id,
          employeeName: employee.name + " " + employee.lastName
        }
        : item
    );

    const subsidiaries = await getSubsidiaries(employee.id.toString());

    // Actualizar las subsidiarias solo para la fila actual
    const updatedSubsidiariesByRow = {
      ...subsidiariesByRow,

      [itemId]: createListCollection({
        items: subsidiaries.map(item => ({
          value: item.id,
          label: item.name,
        })),
      }),

    };

    setSubsidiariesByRow(updatedSubsidiariesByRow);
    updateIntercompany(updateLine);
  }

  function handleAmount(itemId: number, value: string) {

    value = value.replace(/[^\d.]/g, "");

    const updateLine: IntercompanyLine[] = intercompany?.lines.map((item: IntercompanyLine) =>
      item.id === itemId
        ? {
          ...item,
          physicalAmount: parseFloat(value),
        }
        : item
    )

    updateIntercompany(updateLine);

  }

  function handleSubsidiary(event: ValueChangeDetails<any>, itemId: number) {
    // Verificar que subsidiariesByRow[itemId] existe y tiene items
    if (!subsidiariesByRow[itemId] || !subsidiariesByRow[itemId].items) {
      console.error("No se encontraron subsidiarias para la fila:", itemId);
      return;
    }

    // Buscar la subsidiaria seleccionada
    const selectedSubsidiary = subsidiariesByRow[itemId].items.find(
      (item) => item.value === event.value[0]
    );

    // Verificar que se encontró una subsidiaria válida
    if (!selectedSubsidiary) {
      console.error("No se encontró la subsidiaria seleccionada:", event.value[0]);
      return;
    }

    const subSelect = Number(event.value[0]);
    const subName = selectedSubsidiary.label;

    // Actualizar la línea correspondiente en el estado
    const updateLine: IntercompanyLine[] = intercompany?.lines.map((item: IntercompanyLine) =>
      item.id === itemId
        ? {
          ...item,
          subsidiaryId: subSelect,
          subsidiaryname: subName,
        }
        : item
    );

    setIntercompany({ ...intercompany, lines: updateLine });
    updateIntercompany(updateLine);
  }

  return (
    <Box>
      {/* <Toaster /> */}

      <Table.ScrollArea rounded="md" borderWidth="1px">
        <Table.Root size="sm" variant="outline">

          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader textAlign="center">Empleado</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Subsidiaria</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Monto POS</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Ticket</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Importe físico</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {intercompany?.lines?.map((item: IntercompanyLine) => (
              <Table.Row key={item.id}>

                <Table.Cell textAlign="center">

                  <FilterEmployee employees={employees}
                    employeeSelect={item.employeeName}
                    label={false}
                    itemId={item.id}
                    onSelect={handleEmployeeData}
                    disabled={data?.closingConfirmation} />

                </Table.Cell>

                <Table.Cell textAlign="center">

                  <SelectRoot collection={subsidiariesByRow[item.id]}
                    onValueChange={(event) => handleSubsidiary(event, item.id)} disabled={data?.closingConfirmation}>

                    <SelectTrigger>
                      <SelectValueText placeholder={item.subsidiaryname || "Selecciona Subsidiaria"} />
                    </SelectTrigger>

                    <SelectContent>
                      {subsidiariesByRow[item.id].items.map((item) => (
                        <SelectItem item={item} key={item.value}>
                          {item.label}
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
                  <TableInput value={item.physicalAmount} id={item.id} currency={true} onChange={handleAmount} disabled={data?.closingConfirmation} />
                </Table.Cell>

              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {loading && (
        <Box position="fixed" top="50%" left="50%" zIndex="1">
          <Loading />
        </Box>
      )}

    </Box>
  );
}

export default IntercompanyClousing;
