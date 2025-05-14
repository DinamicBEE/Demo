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
  data,
}: AddEmployeeProp) {
  const [selectEmployee, setSelectEmployee] = useState<Employee>();
  const [reasonsList, setReasonsList] = useState<ReasonsModel[]>([]);
  const [ticketsList, setTicketsList] = useState<TicketModel[]>([]);

  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState<string[]>([]);
  const [ticket, setTicket] = useState<string[]>([]);

  const [isEdited, setIsEdited] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [reasons, setReasons] = useState<ListCollection>(
    createListCollection({ items: [] })
  );
  const [tickets, setTickets] = useState<ListCollection>(
    createListCollection({ items: [] })
  );

  const {
    getEmployeeList,
    getReasonsList,
    setNewEmployee,
    getTicketsList,
    updateEmployee,
    deleteEmployee,
  } = useEmployeeContext();

  useEffect(() => {
    async function fetchData() {
      setCatalogLoading(true);
      const employeeList: Employee[] = await getEmployeeList(subsidiaryId, cdc);
      const reasonsList: ReasonsModel[] = await getReasonsList(subsidiaryId, cdc);
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

      if (isOpen && data) {
        console.log("Employee a editar", data);
        
        setIsEdited(true);
        setSelectEmployee({
          id: data.employeeId || 0,
          name: data.employeeName,
          employeeNumber: data.employeeNumber,
        });
        setAmount(data.amount);
        setReason([data.reasonId?.toString() || ""]);
        if (data.ticketId) {
          setTicket([data.ticketId.toString()]);
        } else {
          setTicket([]);
        }
      } else if (isOpen && !data) {
        setAmount(0);
        setReason([]);
        setTicket([]);
        setSelectEmployee(undefined);
        setIsEdited(false);
      }
    }

    fetchData();
  }, [getEmployeeList, getReasonsList, getTicketsList, subsidiaryId, cdc, isOpen, data]);


  async function handleData() {
    setLoading(true);

    if (!selectEmployee || !amount || !reason) {
      alert("Por favor, complete todos los campos obligatorios.");
      setLoading(false);
      return;
    }

    const selectedReason = reasonsList.find(
      (item) => item.id === Number(reason[0])
    );
    const selectedTicket = ticketsList.find(
      (item) => item.id === Number(ticket[0])
    );

    const newEmployee: EmployeeLine = {
      id: isEdited ? data!.id : "employee-" + uuidv4(),
      //employeeId: selectEmployee.id,
      employeeNumber: selectEmployee.employeeNumber,
      employeeName: selectEmployee.name,
      employeeId: selectEmployee.id,
      amount: amount,
      reason: selectedReason?.reasonName || "",
      reasonId: selectedReason?.id || undefined,
      ticketId: selectedTicket?.id || undefined,
      ticketNumber: selectedTicket?.ticketNumber || undefined,
    };
    if (isEdited) {
      updateEmployee(newEmployee, clousingId);
      console.log("Updated Employee", newEmployee);
    } else {
      setNewEmployee(newEmployee, clousingId);
      console.log("New Employee", newEmployee);
    }

    // console.log(newEmployee);

    // const response: ResponseModel = await sendNewEmployeeRegister(clousingId, newEmployee);

    // if(response.success){

    setLoading(false);
    onClose();
    setAmount(0);
    setReason([]);
    setTicket([]);
    setSelectEmployee(undefined);
    setIsEdited(false);
    // } else {
    //   alert(response.message);
    //   setLoading(false);
    // }
  }

  async function handleDelete(employeeId: string | number, clousingId: number) {
    setLoading(true);
    deleteEmployee(employeeId, clousingId);
    onClose();
    setAmount(0);
    setReason([]);
    setTicket([]);
    setSelectEmployee(undefined);
    setLoading(false);
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
          {isEdited ? (
            <DialogTitle>Edición o eliminación de empleado</DialogTitle>
          ) : (
            <DialogTitle>Agregar empleado</DialogTitle>
          )}
        </DialogHeader>

        <DialogBody>
          <Stack gap="6">
            <FilterEmployee
              employees={employees}
              label={true}
              onSelect={setSelectEmployee}
              disabled={false}
              employeeToEdit={
                isEdited
                  ? { id: selectEmployee?.id, name: selectEmployee?.name }
                  : null
              }
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
              value={ isEdited && data?.reasonId ? [data.reasonId.toString()] : reason}
              onValueChange={(e) => {
                setReason(e.value);
                setTicket([]);
              }}
            >
              <SelectLabel>Motivo</SelectLabel>
              <SelectTrigger>
                <SelectValueText
                  placeholder={isEdited ? data?.reason : "Motivo"}
                />
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
                value={
                  isEdited && data?.ticketId
                    ? [data.ticketId.toString()]
                    : ticket
                }
                onValueChange={(e) => setTicket(e.value)}
              >
                <SelectLabel>Ticket</SelectLabel>
                <SelectTrigger>
                  <SelectValueText
                    placeholder={
                      isEdited && data?.ticketId != undefined
                        ? data?.ticketNumber
                        : "Ticket"
                    }
                  />
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

        <DialogFooter display={"flex"} justifyContent={"space-between"}>
          {data != null && (
            <Button
              colorPalette="meraError"
              loading={loading}
              onClick={() => handleDelete(data?.id!, clousingId)}
            >
              Eliminar
            </Button>
          )}
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
