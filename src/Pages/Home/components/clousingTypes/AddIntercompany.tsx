import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle,
  DialogBody, DialogCloseTrigger, DialogFooter } from "@components/ui/dialog";
import { SelectRoot, SelectTrigger, SelectValueText,
  SelectContent, SelectItem, SelectLabel } from "@components/ui/select";
import { createListCollection, Group, Input, InputAddon, 
  ListCollection, Stack, Box } from "@chakra-ui/react";
import { Button } from "@components/ui/button";
import FilterEmployee from "@components/FilterEmployee";
import { AddIntercompanyProp, IntercompanyLine } from "@models/intercompany.model";
import { Employee, TicketModel } from "@models/employee.model";
import { useIntercompanyContext } from "@context/clousing/intercompanyContext";
import { useEmployeeContext } from "@context/clousing/employeeClousing";
import Loading from "@components/Loading";


function AddIntercompany({clousingId, isOpen, onClose}: AddIntercompanyProp) {

  const [selectEmployee, setSelectEmployee] = useState<Employee>();
  const [subsidiariesByRow, setSubsidiariesByRow] = useState<{
      [key: number | string]: ListCollection;
    }>({});
  const [tickets, setTickets] = useState<ListCollection>(
    createListCollection({ items: [] })
  );

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [subsidiary, setSubsidiary] = useState<string[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [ticket, setTicket] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(false);

  const {
      getEmployeesList,
      getSubsidiaries,
      setNewIntercompanyRegister
    } = useIntercompanyContext();

  const { getTicketsList } = useEmployeeContext();

  useEffect(() => {
    async function getEmployees() {
      setCatalogLoading(true);
      const employeeList: Employee[] = await getEmployeesList();

      const initialSubsidiariesByRow: {
        [key: number | string]: ListCollection;
      } = {};
      
      setSubsidiariesByRow(initialSubsidiariesByRow);

      const ticketsList: TicketModel[] = await getTicketsList(clousingId);
      console.log("Tickets List", ticketsList);

      // ! Cambiar PROPINA POR INTERCOMPANY!!!!!!
      const ticketIntercompany: TicketModel[] = ticketsList.filter(ticket => 
      ticket.paymentTypeResponse.some(payment => 
        payment.paymentMethod == "PROPINA" 
      )
      );

      const ticketCollection = createListCollection({
        items: ticketIntercompany.map((ticket) => ({
          label: ticket.ticketNumber,
          value: ticket.id,
          amount: ticket.paymentTypeResponse.reduce((acc, payment) => {
            if (payment.paymentMethod === "PROPINA") {
              return acc + payment.amount;
            }
            return acc;
          }, 0),
        })),
      });
      
      setTickets(ticketCollection);
      setEmployees(employeeList);
      setCatalogLoading(false);
    }

    getEmployees();
  }, [])

  useEffect(() => {
    async function getSubsidiariesByRow() {
      if (!selectEmployee) return;
      setCatalogLoading(true);
      const subsidiaries = await getSubsidiaries(selectEmployee.id.toString());

      const updatedSubsidiariesByRow = {
        ...subsidiariesByRow,
        [selectEmployee.id.toString()]: createListCollection({
          items: subsidiaries.map((item) => ({
            value: item.id,
            label: item.name,
          })),
        }),
      };
      
      setSubsidiariesByRow(updatedSubsidiariesByRow);
      setCatalogLoading(false);
    }

    getSubsidiariesByRow();
  }, [selectEmployee]);


  async function handleData() {

    setLoading(true);

     if (!selectEmployee || !amount || !ticket) {
      alert("Por favor, complete todos los campos obligatorios.");
      setLoading(false);
      return;
    }

    console.log("Data to save:", selectEmployee, amount, ticket);
    const newIntercompany: IntercompanyLine = {
      id: "intercompany-" + uuidv4(),
      employeeId: selectEmployee?.id ,
      employeeName: selectEmployee?.name,
      subsidiaryId: parseInt(subsidiary[0]),
      subsidiaryName: subsidiariesByRow[selectEmployee.id.toString()]?.items.find(item => item.value == subsidiary[0])?.label,
      amount: tickets.items.find(item => item.value == ticket[0]).amount,
      ticket: ticket[0],
      physicalAmount: amount,
    }

    setNewIntercompanyRegister(newIntercompany, clousingId);

    setLoading(false);
    onClose();

    setTicket([]);
    setSubsidiary([]);
    setAmount(0);
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
            <FilterEmployee
              employees={employees}
              label={true}
              onSelect={setSelectEmployee}
              disabled={false}
              employeeToEdit={null}
            />

            <SelectRoot
              collection={subsidiariesByRow[selectEmployee?.id?.toString() ?? ""]}
              onValueChange={(event) => setSubsidiary(event.value)}
            >
              <SelectTrigger>
                <SelectValueText
                  placeholder={"Selecciona Subsidiaria"}
                />
              </SelectTrigger>
              <SelectContent>
                {selectEmployee && subsidiariesByRow[selectEmployee.id.toString()]?.items.map((subsidiary) => (
                  <SelectItem item={subsidiary} key={subsidiary.value}>
                    {subsidiary.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>

            <SelectRoot
              collection={tickets}
              value={ticket}
              onValueChange={(e) => setTicket(e.value)}
            >
              <SelectLabel>Ticket</SelectLabel>
              <SelectTrigger>
                <SelectValueText placeholder="Ticket" />
              </SelectTrigger>

              <SelectContent>
                {tickets.items.map((ticket) => (
                  <SelectItem item={ticket} key={ticket.value}>
                    {ticket.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>
                        
            <Group attached>
              <InputAddon>Monto</InputAddon>
              <Input
                type="number"
                placeholder="Ingrese el monto"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
              />
            </Group>

          </Stack>

          {catalogLoading && (
            <Box position="fixed" top="50%" left="50%">
              <Loading />
            </Box>
          )}
          
        </DialogBody>
        
        <DialogFooter>
          <Button 
            colorPalette="meraPrimary"
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

export default AddIntercompany;