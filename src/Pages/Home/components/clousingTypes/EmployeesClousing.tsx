import { useEffect, useState } from "react";
import { Box, Table, Text, FormatNumber, Button } from "@chakra-ui/react";
import { EmployeeLine, EmployeeModel } from "@models/employee.model";
import AddEmployee from "./AddEmployee";
import { useEmployeeContext } from "@context/clousing/employeeClousing";
import { useFooter } from "@context/home/footerClousingContext";
import { CLOUSING_KEY } from "@models/constants.model";
import { useHeaders } from "@context/home/headerContext";
import Loading from "@components/Loading";


function EmployeesClousing({ data }: any) {
  const [employeeLocal, setEmployee] = useState<EmployeeModel>()
  const [dialog, setDialog] = useState<boolean>(false);

  const { getEmployeetData, employee, employeeLoading } = useEmployeeContext();
  const { setFooterData } = useFooter();
  const { updateTotal } = useHeaders();

  useEffect(() => {
    async function fetchData() {

      const employeeData: EmployeeModel = await getEmployeetData(data?.id);

      if (employeeData) setFooterData(employeeData.total, data.id, CLOUSING_KEY.EMPLOYEE);

      setEmployee(employeeData)
      updateTotal(employeeData.total.totalPhysical, data.id, CLOUSING_KEY.EMPLOYEE);
      
    }

    fetchData()

  }, [employee])


  const openDiaolog = () => {
    if (data?.closingConfirmation) return;
    setDialog(true);
  }

  const closeDiaolog = () => {
    setDialog(false);
  }

  return (
    <Box>
      {/* <Toaster /> */}

      <Button mb={2} colorPalette="meraPrimary" onClick={() => openDiaolog()} disabled={data?.closingConfirmation}>Agregar</Button>

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
            {employeeLocal?.lines?.map((item: EmployeeLine) => (
              <Table.Row key={item.id}>
                <Table.Cell textAlign="center">
                  <Text> {item.name + ' ' + item.lastName} </Text>
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text> {item.employeeCode} </Text>
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
                  <Text> {item.ticket} </Text>
                  <Text> {item.id} </Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      <AddEmployee clousingId={data?.id} employeId={data?.employeId} isOpen={dialog} onClose={closeDiaolog} />

      {employeeLoading && (
        <Box position="fixed" top="50%" left="50%" zIndex="1">
          <Loading />
        </Box>
      )}

    </Box>
  );
}

export default EmployeesClousing;