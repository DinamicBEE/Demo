import { useEffect, useState } from "react";
import { Box, Table, Text, FormatNumber, ListCollection, createListCollection, SelectRoot, SelectTrigger, SelectValueText, SelectContent, SelectItem  } from "@chakra-ui/react";
import { Toaster } from "@components/ui/toaster";
import { IntercompanyLine, IntercompanyModel } from "@models/intercompany.model";
import { useIntercompanyContext } from "@context/clousing/intercompanyContext";
import { useFooter } from "@context/home/footerClousingContext";
import { CLOUSING_KEY } from "@models/constants.model";
import Loading from "@components/Loading";
import { Employee } from "@models/employee.model";
import { useEmployeeContext } from "@context/clousing/employeeClousing";
import FilterEmployee from "@components/FilterEmployee";
import { TableInput } from "@components/NumericInput";
import { useList } from "@context/home/listsContext";
import { ValueChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/select/namespace";
import { TotalModel } from "@models/common.clousing.model";
import { useHeaders } from "@context/home/headerContext";

function IntercompanyClousing({data}: any) {
  const [intercompany, setIntercompany] = useState<IntercompanyModel>({} as IntercompanyModel);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [subsidiary, setSubsidiary] = useState<ListCollection>(createListCollection({ items: [] }));
  const [loading, setLoading] = useState<boolean>(false);

  const { getIntercompanyData, setIntercompanyData } = useIntercompanyContext();
  const { getEmployeeList } = useEmployeeContext();
  const { getSubsidiariesData } = useList();
  const { updateTotal } = useHeaders();
  const { setFooterData } = useFooter();

  useEffect( ()=>{
    async function fetchData() {
      setLoading(true)
      const intercompanyData: IntercompanyModel = await getIntercompanyData(data?.id);
      const employeeList: Employee[] =  await getEmployeeList();
      const subsidiariesData = await getSubsidiariesData();

      if(intercompanyData){
        setFooterData(intercompanyData.total, data.id, CLOUSING_KEY.INTERCOMPANY);
      }

      setIntercompany(intercompanyData);
      setEmployees(employeeList);

      const subList = createListCollection({
          items: subsidiariesData.map(item =>({
              value: item.id,
              label: item.name
          }))
      })
      
      setSubsidiary(subList);

      setLoading(false)

    }

    fetchData()

  },[]);

  function updateIntercompany(updateLine: IntercompanyLine[]){

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

  function handleSubsidiary(event: ValueChangeDetails<any>, itemId: number){
    
    const subSelect = Number(event.value[0]);
    const subName = subsidiary.items.find(item => item.value === event.value[0]).label;

    const updateLine: IntercompanyLine[] = intercompany?.lines.map((item:IntercompanyLine) => 
      item.id === itemId
        ? {
          ...item,
          subsidiaryId: subSelect,
          subsidiaryname: subName
        }
        : item
    )

    updateIntercompany(updateLine);
    
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
                  <FilterEmployee employees={employees} employeeSelect={item.employeeName} label={false} itemId={item.id} onSelect={handleEmployeeData} />
                </Table.Cell>

                <Table.Cell textAlign="center">
                  <SelectRoot collection={subsidiary}
                            onValueChange={(event) => handleSubsidiary(event, item.id)}>
                    <SelectTrigger>
                      <SelectValueText placeholder={item.subsidiaryname || "Selecciona Subsidiaria"} />
                    </SelectTrigger>
                    
                    <SelectContent>
                        {subsidiary.items.map((item) => (
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
                  <TableInput value={item.physicalAmount} id={item.id} currency={true} onChange={handleAmount} />
                </Table.Cell>

              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      {loading && (
        <Box position="fixed" top="50%" left="50%">
          <Loading />
        </Box>
      )}
      
    </Box>
  );
}

export default IntercompanyClousing;
