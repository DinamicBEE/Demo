import { useEffect, useState } from "react";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogCloseTrigger, DialogFooter } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import FilterEmployee from "@components/FilterEmployee";
import { Box, createListCollection, Group, Input, InputAddon, ListCollection, SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText, Stack } from "@chakra-ui/react";
import { AddEmployeeProp, Employee, NewEmployeeModel, ReasonsModel } from "@models/employee.model";
import { useEmployeeContext } from "@context/clousing/employeeClousing";
import Loading from "@components/loading";
import { sendNewEmployeeRegister } from "@services/clousingService";
import { ResponseModel } from "@models/common.clousing.model";


function AddEmployee({clousingId, employeId, isOpen, onClose}: AddEmployeeProp){
    const [selectEmployee, setSelectEmployee] = useState<Employee>();
    const [reasonsList, setReasonsList] = useState<ReasonsModel[]>([]);
    const [amount, setAmount] = useState<number>(0);
    const [reason, setReason] = useState<string[]>([]);
    const [ticket, setTicket] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [catalogLoading, setCatalogLoading] = useState<boolean>(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [reasons, setReasons] = useState<ListCollection>(createListCollection({ items: [] }));

    const employeeContext = useEmployeeContext();

    useEffect(()=>{

      async function fetchData() {
        setCatalogLoading(true);
        const employeeList: Employee[] =  await employeeContext.getEmployeeList();
        const reasonsList: ReasonsModel[] = await employeeContext.getReasonsList(); 
        
        setEmployees(employeeList)

        const reasonCollection = createListCollection({
          items: reasonsList.map(reason => ({
            label: reason.reason,
            value: reason.id
          }))
        })

        setReasonsList(reasonsList);
        setReasons(reasonCollection);
        setCatalogLoading(false);
      }

      fetchData();
        
      },[])

    async function handleData(){
      setLoading(true);

      if (!selectEmployee || !amount || !reason) {
        alert("Por favor, complete todos los campos obligatorios.");
        return;
      }

      console.log(reason)
      const newEmployee: NewEmployeeModel = {
        employeeId: selectEmployee.id,
        amount: amount,
        reason: Number(reason[0]),
        ticket: ticket,
      };

      console.log(newEmployee);

      const response: ResponseModel = await sendNewEmployeeRegister(clousingId, newEmployee);

      if(response.success){

        employeeContext.setNewEmployee(response.data, clousingId, employeId,);
        setLoading(false);
        onClose();
        setAmount(0);
        setReason([]);

      } else {
        alert(response.message);
        setLoading(false);
      }

    }
    
    return (
      <DialogRoot
        open={isOpen}
        closeOnEscape={false}
        closeOnInteractOutside={false}
        scrollBehavior="inside"
        onOpenChange={() => onClose()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar</DialogTitle>
          </DialogHeader>

          <DialogBody>
            <Stack gap="6">
                
              <FilterEmployee employees={employees} onSelect={setSelectEmployee} />

              <Group attached>
                <InputAddon>Monto</InputAddon>
                <Input 
                    type="number"
                    placeholder="Ingrese el monto"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))} />
              </Group>

              <SelectRoot
                collection={reasons}
                value={reason}
                onValueChange={(e) => setReason(e.value)}
              >
                <SelectLabel>Motivo</SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder="Motivo" />
                </SelectTrigger>

                <SelectContent>
                  {reasons.items.map((movie) => (
                    <SelectItem item={movie} key={movie.value}>
                      {movie.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>

              { reasonsList.find(item => item.id === Number(reason[0]))?.type === "A" && (
                <Group attached>
                  <InputAddon>Ticket</InputAddon>
                  <Input 
                      placeholder="Ingrese el ticket"
                      value={ticket}
                      onChange={(e) => setTicket(e.target.value)} />
                </Group>)
              }

            </Stack>

            {catalogLoading && (
              <Box position="fixed" top="50%" left="50%">
                <Loading />
              </Box>
            )}

          </DialogBody>

          <DialogFooter>
            <Button
              className="secondary-button save-button"
              loading={loading}
              onClick={() => handleData()}
            >
              Guardar
            </Button>
          </DialogFooter>

          <DialogCloseTrigger />

        </DialogContent>
      </DialogRoot>
    );

}

export default AddEmployee;