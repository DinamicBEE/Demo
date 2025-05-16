import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle,
  DialogBody, DialogCloseTrigger, DialogFooter } from "@components/ui/dialog";
import { SelectRoot, SelectTrigger, SelectValueText,
  SelectContent, SelectItem, SelectLabel } from "@components/ui/select";
import { createListCollection, Group, Input, InputAddon, 
  ListCollection, Stack } from "@chakra-ui/react";
import { Button } from "@components/ui/button";
import FilterEmployee from "@components/FilterEmployee";
import { AddIntercompanyProp, IntercompanyLine } from "@models/intercompany.model";
import { Employee } from "@models/employee.model";
import { useIntercompanyContext } from "@context/clousing/intercompanyContext";


function AddIntercompany({clousingId, isOpen, onClose}: AddIntercompanyProp) {

  const [selectEmployee, setSelectEmployee] = useState<Employee>();
  const [subsidiariesByRow, setSubsidiariesByRow] = useState<{
      [key: number | string]: ListCollection;
    }>({});
  const [tickets, setTickets] = useState<ListCollection>(
    createListCollection({ items: [] })
  );

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [ticket, setTicket] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(false);

    const {
        getEmployeesList,
        getSubsidiaries,
        setNewIntercompanyRegister
      } = useIntercompanyContext();

  useEffect(() => {
    async function getEmployees() {
      setCatalogLoading(true);
      const employeeList: Employee[] = await getEmployeesList();

      const initialSubsidiariesByRow: {
        [key: number | string]: ListCollection;
      } = {};
      
      setSubsidiariesByRow(initialSubsidiariesByRow);
      
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

  function handleSubsidiary (event: any) {
    console.log("Subsidiary selected:", event);
  }

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
      subsidiaryId: 0,
      subsidiaryName: "",
      amount: amount,
      ticket: ticket[0],
      physicalAmount: amount,
    }

    setNewIntercompanyRegister(newIntercompany, clousingId);

    setLoading(false);
    onClose();

    //TODO: limpiar los campos
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
            />

            <SelectRoot
              collection={subsidiariesByRow[selectEmployee?.id?.toString() ?? ""]}
              onValueChange={(event) => handleSubsidiary(event)}
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