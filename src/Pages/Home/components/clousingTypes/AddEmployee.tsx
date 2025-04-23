import { useEffect, useState } from "react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
  DialogFooter,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import FilterEmployee from "@components/FilterEmployee";
import {
  Box,
  createListCollection,
  Group,
  Input,
  InputAddon,
  ListCollection,
  Stack,
} from "@chakra-ui/react";
import {
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  SelectContent,
  SelectItem,
} from "@components/ui/select";
import {
  AddEmployeeProp,
  Employee,
  EmployeeLine,
  NewEmployeeModel,
  ReasonsModel,
  TicketModel,
} from "@models/employee.model";
import { useEmployeeContext } from "@context/clousing/employeeClousing";
import Loading from "@components/Loading";
import { v4 as uuidv4 } from "uuid";
import { sendNewEmployeeRegister } from "@services/clousingService";
import { ResponseModel } from "@models/common.clousing.model";

function AddEmployee({
  clousingId,
  subsidiaryId,
  cdc,
  isOpen,
  onClose,
}: AddEmployeeProp) {
  const [selectEmployee, setSelectEmployee] = useState<Employee>();
  const [reasonsList, setReasonsList] = useState<ReasonsModel[]>([]);
  const [ticketsList, setTicketsList] = useState<TicketModel[]>([]);

  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState<string[]>([]);
  const [ticket, setTicket] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [reasons, setReasons] = useState<ListCollection>(
    createListCollection({ items: [] })
  );
  const [tickets, setTickets] = useState<ListCollection>(
    createListCollection({ items: [] })
  );

  const { getEmployeeList, getReasonsList, setNewEmployee, getTicketsList } =
    useEmployeeContext();

  useEffect(() => {
    async function fetchData() {
      setCatalogLoading(true);
      const employeeList: Employee[] = await getEmployeeList(subsidiaryId, cdc);
      const reasonsList: ReasonsModel[] = await getReasonsList(
        subsidiaryId,
        cdc
      );
      const ticketsList: TicketModel[] = await getTicketsList(subsidiaryId);
      console.log("Tickets List", ticketsList);

      setEmployees(employeeList);

      const reasonCollection = createListCollection({
        items: reasonsList.map((reason) => ({
          label: reason.reasonName,
          value: reason.id,
        })),
      });

      const ticketCollection = createListCollection({
        items: ticketsList.map((ticket) => ({
          label: ticket.ticketNumber,
          value: ticket.id,
        })),
      });

      setReasonsList(reasonsList);
      setReasons(reasonCollection);
      setTickets(ticketCollection);
      setTicketsList(ticketsList);
      setCatalogLoading(false);
    }

    fetchData();
  }, []);

  async function handleData() {
    setLoading(true);

    if (!selectEmployee || !amount || !reason) {
      alert("Por favor, complete todos los campos obligatorios.");
      setLoading(false);
      return;
    }

    console.log(reason);
    // const newEmployee: NewEmployeeModel = {
    //   employeeId: selectEmployee.id,
    //   amount: amount,
    //   reason: Number(reason[0]),
    //   ticket: ticket,
    // };

    const newEmployee: EmployeeLine = {
      id: "employee-" + uuidv4(),
      //employeeId: selectEmployee.id,
      employeeNumber: selectEmployee.employeeNumber,
      employeeName: selectEmployee.name,
      employeeId: selectEmployee.id,
      amount: amount,
      reason:
        reasonsList.find((item) => item.id === Number(reason[0]))?.reasonName ||
        "",
      reasonId:
        reasonsList.find((item) => item.id === Number(reason[0]))?.id ||
        undefined,
      ticketId:
        ticketsList.find((item) => item.id === Number(ticket[0]))?.id ||
        undefined,
      ticketNumber:
        ticketsList.find((item) => item.id === Number(ticket[0]))
          ?.ticketNumber || undefined,
    };

    // console.log(newEmployee);

    // const response: ResponseModel = await sendNewEmployeeRegister(clousingId, newEmployee);

    // if(response.success){

    setNewEmployee(newEmployee, clousingId);
    setLoading(false);
    onClose();
    setAmount(0);
    setReason([]);
    setTicket([]);
    // } else {
    //   alert(response.message);
    //   setLoading(false);
    // }
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

            <Group attached>
              <InputAddon>Monto</InputAddon>
              <Input
                type="number"
                placeholder="Ingrese el monto"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
              />
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

            {reasonsList.find((item) => item.id === Number(reason[0]))
              ?.useCase === "A" && (
              /*  <Group attached>
                <InputAddon>Ticket</InputAddon>
                <Input
                  placeholder="Ingrese el ticket"
                  value={ticket}
                  onChange={(e) => setTicket(e.target.value)}
                />
              </Group> */
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
            )}
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

export default AddEmployee;
