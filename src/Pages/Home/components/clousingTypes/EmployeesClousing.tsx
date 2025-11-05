import { useEffect, useState } from "react";
import { Box, Table, Text, FormatNumber, Button, HStack, MenuRoot, MenuTrigger, MenuContent, Portal, MenuPositioner, MenuItem, IconButton } from "@chakra-ui/react";
import { PaginationItems, PaginationNextTrigger, PaginationPrevTrigger, PaginationRoot } from "@components/ui/pagination";
import { EmployeeClousingProps, EmployeeLine, EmployeeModel } from "@models/employee.model";
import AddEmployee from "./AddEmployee";
import { useEmployeeContext } from "@context/clousing/employeeClousing";
import { useFooter } from "@context/home/footerClousingContext";
import { CLOUSING_KEY } from "@models/common.const";
import Loading from "@components/Loading";
import { FiPrinter } from "react-icons/fi";
import EmployeesPayrollDiscountForm from "./EmployeesPayrollDiscountForm";


const pageSize = 10;

function EmployeesClousing({ data, subsidiaryId, cdc }: EmployeeClousingProps) {
  const [employeeLocal, setEmployee] = useState<EmployeeModel>({} as EmployeeModel);
  const [dialog, setDialog] = useState<boolean>(false);
  const [ editEmployee, setEditEmployee ] = useState<EmployeeLine | null>(null);
  const { getEmployeetData, employee, employeeLoading } = useEmployeeContext();
  const { setFooterData } = useFooter();
  const [page, setPage] = useState(1);
  const [visibleItems, setVisibleItems] = useState<EmployeeLine[]>([])
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [empForm, setEmpForm] = useState<EmployeeLine>({} as EmployeeLine);

  const startRange = (page - 1) * pageSize
  const endRange = startRange + pageSize

  useEffect(() => {
    async function fetchData() {      
      if (!data || !cdc || !subsidiaryId) return;
            
      const employeeData: EmployeeModel = await getEmployeetData(data?.id);      
      if (employeeData) setFooterData(employeeData.total, data.id, CLOUSING_KEY.EMPLOYEE);

      setEmployee(employeeData)
      
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

  const openForm = (employee: EmployeeLine) => {
    setEmpForm(employee);
    setIsOpenForm(true);
  }

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

      <Button mb={2} colorPalette="meraPrimary" onClick={() => openDiaolog(false, {} as EmployeeLine)} disabled={data?.closingConfirmation || employeeLocal?.isRoleEditable === false}>Agregar</Button>

      <Table.ScrollArea rounded="md" borderWidth="1px">
        <Table.Root size="sm" variant="outline">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader textAlign="center">Empleado</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">No. Empleado</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Monto</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Motivo</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Ticket</Table.ColumnHeader>
              {(!data?.closingConfirmation && employeeLocal?.isRoleEditable) && <Table.ColumnHeader textAlign="center"></Table.ColumnHeader>}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {visibleItems?.map((item: EmployeeLine) => (
              <Table.Row key={item.id}>
                <Table.Cell textAlign="center">
                  { (!data?.closingConfirmation && employeeLocal?.isRoleEditable) 
                    ? 
                    <Text
                    cursor="pointer"
                    textDecoration="underline"
                    color="blue.500"
                    onClick={() => openDiaolog(true, item)}
                    > {item.employeeName} </Text>
                    : 
                    <Text> {item.employeeName} </Text>
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
                {(data?.closingConfirmation && employeeLocal?.isRoleEditable) &&<Table.Cell textAlign="center">
                  <IconButton rounded={"full"}colorScheme={"blue"} onClick={() =>openForm(item)}>
                    <FiPrinter />
                  </IconButton>
                </Table.Cell>}
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
      <EmployeesPayrollDiscountForm isOpen={isOpenForm} onClose={() => setIsOpenForm(false)} line={empForm} subsidiaryId={subsidiaryId} />
      <AddEmployee clousingId={data?.id ?? 0} subsidiaryId={subsidiaryId} cdc={cdc} isOpen={dialog} onClose={closeDiaolog} data={editEmployee}/>

      {employeeLoading && (
        <Box position="fixed" top="50%" left="50%" zIndex={1000}>
          <Loading />
        </Box>
      )}

    </Box>
  );
}

export default EmployeesClousing;