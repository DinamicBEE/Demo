import { useEffect, useState } from "react";
import { Box, Table, Text, FormatNumber, Button  } from "@chakra-ui/react";
import { Toaster } from "@components/ui/toaster";
import { IntercompanyLine, IntercompanyModel } from "@models/intercompany.model";
import { useIntercompanyContext } from "@context/clousing/intercompanyContext";
import { useFooter } from "@context/home/footerClousingContext";
import { CLOUSING_KEY } from "@models/constants.model";
import Loading from "@components/loading";
import { Employee } from "@models/employee.model";
import { useEmployeeContext } from "@context/clousing/employeeClousing";
import FilterEmployee from "@components/FilterEmployee";
import { TableInput } from "@components/NumericInput";

function IntercompanyClousing({data}: any) {
  const [intercompany, setIntercompany] = useState<IntercompanyModel>({} as IntercompanyModel);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const intercompanyContext = useIntercompanyContext();
  const employeeContext = useEmployeeContext();
  const footerContext = useFooter();

  useEffect( ()=>{
    async function fetchData() {
      const intercompanyData: IntercompanyModel = await intercompanyContext.getIntercompanyData(data?.id, data?.employeId);
      const employeeList: Employee[] =  await employeeContext.getEmployeeList();

      if(intercompanyData){
        footerContext?.setFooterData(intercompanyData.total, data.id, CLOUSING_KEY.INTERCOMPANY);
      }

      setIntercompany(intercompanyData);
      setEmployees(employeeList);

    }

    fetchData()

  },[]);

  function updateIntercompany(updateLine: IntercompanyLine[]){

    const intercompanyData: IntercompanyModel = {
      ...intercompany,
      lines: updateLine
    }

    setIntercompany(intercompanyData);

    intercompanyContext.setIntercompanyData(intercompanyData, data?.id, data?.employeId)

  }

  function handleEmployeeData(employee:Employee, itemId?: number){

    const updateLine: IntercompanyLine[] = intercompany?.lines.map((item:IntercompanyLine) => 
      item.id === itemId
        ? {
          ...item,
          employeeId: employee.id,
          employeeName: employee.name + " " + employee.lastName
        }
        : item
    )

    updateIntercompany(updateLine);
    
  }

  function handleAmount(itemId: number, value: string){

    value = value.replace(/[^\d.]/g, "");

    const updateLine: IntercompanyLine[] = intercompany?.lines.map((item:IntercompanyLine) => 
      item.id === itemId
        ? {
          ...item,
          physicalAmount: parseFloat(value),
        }
        : item
    )

    updateIntercompany(updateLine);

  }

  function handleSubsidiary(){
    
  }
  
  return (
    <Box>
      {/* <Toaster /> */}

      <Table.ScrollArea rounded="md" borderWidth="1px">
        <Table.Root size="sm" variant="outline" striped>
          <Table.Header>
            <Table.Row>
              <Table.Cell textAlign="center">Empleado</Table.Cell>
              <Table.Cell textAlign="center">Subsidiaria</Table.Cell>
              <Table.Cell textAlign="center">Monto POS</Table.Cell>
              <Table.Cell textAlign="center">Ticket</Table.Cell>
              <Table.Cell textAlign="center">Importe físico</Table.Cell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {intercompany?.lines?.map((item: IntercompanyLine) => (
              <Table.Row key={item.id}>
                
                <Table.Cell textAlign="center">
                  <FilterEmployee employees={employees}  label={false} itemId={item.id} onSelect={handleEmployeeData} />
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <Text> {item.subsidiaryname} </Text>
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
                  <TableInput value={item.physicalAmount} id={item.id} currency={true} onChange={handleAmount} />
                </Table.Cell>

              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {intercompanyContext.intercompanyLoading && (
        <Box position="fixed" top="50%" left="50%">
          <Loading />
        </Box>
      )}
      
    </Box>
  );
}

export default IntercompanyClousing;
