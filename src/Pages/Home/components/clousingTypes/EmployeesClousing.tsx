import { useEffect, useState } from "react";
import { Box, Table, Text, FormatNumber, Button  } from "@chakra-ui/react";
import { Toaster } from "@components/ui/toaster";
import { EmployeeLine, EmployeeModel } from "@models/employee.model";
import AddEmployee from "./AddEmployee";
import { useEmployeeContext } from "@context/clousing/employeeClousing";
import Loading from "@components/loading";
import { useFooter } from "@context/home/footerClousingContext";
import { CLOUSING_KEY } from "@models/constants.model";

function EmployeesClousing({data}: any) {
  const [employee, setEmployee] = useState<EmployeeModel>()
  const [dialog, setDialog] = useState<boolean>(false);

  const employeeContext = useEmployeeContext();
  const footerContext = useFooter();

  useEffect(()=>{
    async function fetchData() {

      const employeeData: EmployeeModel = await employeeContext.getEmployeetData(data?.id, data?.employeId);

      if(employeeData){
        console.log(employeeData.total)
        footerContext?.setFooterData(employeeData.total, data.id, CLOUSING_KEY.EMPLOYEE)
      }
      setEmployee(employeeData)

    }

    fetchData()
    
  },[employeeContext.employee])


  const openDiaolog = () =>{
    setDialog(true);
  }

  const closeDiaolog = () => {
    setDialog(false);
  }
  
  return (
    <Box>
      {/* <Toaster /> */}

      <Button mb={2} onClick={() => openDiaolog()}>Agregar</Button>

      <Table.ScrollArea rounded="md" borderWidth="1px">
        <Table.Root size="sm" variant="outline" striped>
          <Table.Header>
            <Table.Row>
              <Table.Cell textAlign="center">Empleado</Table.Cell>
              <Table.Cell textAlign="center">No. Empleado</Table.Cell>
              <Table.Cell textAlign="center">Monto</Table.Cell>
              <Table.Cell textAlign="center">Motivo</Table.Cell>
              <Table.Cell textAlign="center">Ticket</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {employee?.lines?.map((item: EmployeeLine) => (
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
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      <AddEmployee clousingId={data?.id} employeId={data?.employeId} isOpen={dialog} onClose={closeDiaolog} />

      {employeeContext.employeeLoading && (
        <Box position="fixed" top="50%" left="50%">
          <Loading />
        </Box>
      )}

    </Box>
  );
}

export default EmployeesClousing;

const tdcData = {
"id": 1,
  "employeId": 150,
  "globalTotalPOS": 9622.32,
  "globalTotalFisico": 9622.32,
  "globalDifference": 0,
  "currencies": [
    {
      "id": 1,
      "employee": "Mario Vásquez",
      "employeId": "0015",
      "amount": 125.00,
      "reason": "Diferencia de efectivo",
      "ticket": "---"
    },
    {
      "id": 2,
      "employee": "Luis Castillo",
      "employeId": "0029",
      "amount": 150.00,
      "reason": "Consumo empelado",
      "ticket": "123"
    },
    {
      "id": 3,
      "employee": "BANREGIO",
      "employeId": "0105",
      "amount": 300.00,
      "reason": "Mala elaboración del producto",
      "ticket": "---"
    }
  ]
}