import { useEffect, useState } from "react";
import { Box, Table, Text, FormatNumber, Button, HStack } from "@chakra-ui/react";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";
import { EmployeeClousingProps, EmployeeLine, EmployeeModel } from "@models/employee.model";
import AddEmployee from "./AddEmployee";
import { useEmployeeContext } from "@context/clousing/employeeClousing";
import { useFooter } from "@context/home/footerClousingContext";
import { CLOUSING_KEY } from "@models/constants.model";
import { useHeaders } from "@context/home/headerContext";
import Loading from "@components/Loading";

const pageSize = 10;

function EmployeesClousing({ data, subsidiaryId, cdc }: EmployeeClousingProps) {
  const [employeeLocal, setEmployee] = useState<EmployeeModel>({} as EmployeeModel);
  const [dialog, setDialog] = useState<boolean>(false);
  const [ editEmployee, setEditEmployee ] = useState<EmployeeLine | null>(null);

  const { getEmployeetData, employee, employeeLoading } = useEmployeeContext();
  const { setFooterData } = useFooter();
  const { updateTotal } = useHeaders();
  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<EmployeeLine[]>([])

  const startRange = (page - 1) * pageSize
  const endRange = startRange + pageSize

  useEffect(() => {
    async function fetchData() {
      
      if (!data) return;      
      const employeeData: EmployeeModel = await getEmployeetData(data?.id);

      if (employeeData) setFooterData(employeeData.total, data.id, CLOUSING_KEY.EMPLOYEE);

      setEmployee(employeeData)
      updateTotal(employeeData.total.totalPhysical, data.id, CLOUSING_KEY.EMPLOYEE);
      
      const items = employeeData?.lines?.slice(startRange, endRange);
      setVisibleItems(items);
    }

    fetchData()

  }, [employee])

  useEffect(() => {
    setPage(page);
    const items = employeeLocal?.lines?.slice(startRange, endRange);
    setVisibleItems(items);
  }, [page])

  const openDiaolog = (isEdited: boolean, employee: EmployeeLine) => {
    isEdited === true ? setEditEmployee(employee) : setEditEmployee(null);
    if (data?.closingConfirmation) return;
    setDialog(true);
  }

  const closeDiaolog = () => {
    setDialog(false);
  }

  return (
    <Box>
      {/* <Toaster /> */}

      <Button mb={2} colorPalette="meraPrimary" onClick={() => openDiaolog(false, {} as EmployeeLine)} disabled={data?.closingConfirmation}>Agregar</Button>

      <Table.ScrollArea rounded="md" borderWidth="1px">
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader textAlign="center">Empleado</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">No. Empleado</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Monto</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Motivo</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Ticket</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visibleItems?.map((item: EmployeeLine) => (
              <Table.Row key={item.id}>
                <Table.Cell textAlign="center">
                  { data?.closingConfirmation 
                    ? <Text
                      > {item.employeeName} </Text>
                    : <Text
                        cursor="pointer"
                        textDecoration="underline"
                        color="blue.500"
                        onClick={() => openDiaolog(true, item)}
                      > {item.employeeName} </Text>
                  }
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text> {item.employeeNumber} </Text>
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
                  <Text> {item.reason} </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text> {item.ticketNumber ? item.ticketNumber : "---"} </Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
      <PaginationRoot count={employeeLocal?.lines?.length??0} pageSize={pageSize} page={page} onPageChange={(e) => setPage(e.page)}>
        <HStack>
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>

      <AddEmployee clousingId={data?.id ?? 0} subsidiaryId={subsidiaryId} cdc={cdc} isOpen={dialog} onClose={closeDiaolog} data={editEmployee}/>

      {employeeLoading && (
        <Box position="fixed" top="50%" left="50%" zIndex="1">
          <Loading />
        </Box>
      )}

    </Box>
  );
}

export default EmployeesClousing;