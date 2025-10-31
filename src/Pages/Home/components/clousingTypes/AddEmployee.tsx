import { useEffect, useState } from "react";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogCloseTrigger,
  DialogFooter,
  DialogActionTrigger,
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
  ReasonsModel,
  TicketModel,
  reasonPaymentMethods
} from "@models/employee.model";
import { useEmployeeContext } from "@context/clousing/employeeClousing";
import Loading from "@components/Loading";
import { v4 as uuidv4 } from "uuid";
import { selectOption } from "@models/common.model";
import { toast } from "@utils/Toast";

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
  const [showTicketSelector, setShowTicketSelector] = useState(false);


  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState<string[]>([]);
  const [ticket, setTicket] = useState<string[]>([]);

  const [isEdited, setIsEdited] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [reasons, setReasons] = useState<ListCollection>(
    createListCollection<selectOption>({ items: [] })
  );
  const [tickets, setTickets] = useState<ListCollection>(
    createListCollection<selectOption>({ items: [] })
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
        
        setIsEdited(true);

        const employeeToEdit = employeeList.find(
          (emp) => emp.name === data.employeeName
        );

        setSelectEmployee({
          id: employeeToEdit?.id || 0,
          name: data.employeeName,
          employeeNumber: data.employeeNumber,
        });
        setAmount(data.amount);
        const reasonToSelect = reasonsList.find(
          (reasonItem) => reasonItem.reasonName === data.reason
        );
        if (reasonToSelect) {
          handleReasonChange(reasonToSelect.id.toString());
        } else {
          setShowTicketSelector(false);
          setReason([]);
        }
        if (data.ticketNumber) {
          const ticketToSelect = ticketsList.find(
            (ticketItem) => ticketItem.ticketNumber === data.ticketNumber
          );
          if (ticketToSelect) {
            setTicket([ticketToSelect.id.toString() || '']);
          } else {
            setTicket([]);
          }
        } else {
          setTicket([]);
        }
      } else if (isOpen && !data) {
        setAmount(0);
        setReason([]);
        setTicket([]);
        setSelectEmployee(undefined);
        setIsEdited(false);
        setShowTicketSelector(false);
      }
    }

    fetchData();
  }, [getEmployeeList, getReasonsList, getTicketsList, subsidiaryId, cdc, isOpen, data]);

  useEffect(() => {
    if (isNaN(amount) || amount < 0) {
      setAmount(0);
    }
  }, [amount])
  
  const handleReasonChange = (selectedReasonId: string) => {
    setReason([selectedReasonId]);
    setTicket([]);
    
    const selectedReason = reasonsList.find(item => item.id === Number(selectedReasonId));
    if (!selectedReason) {
      setShowTicketSelector(false);
      return;
    }

    const reasonConfig = reasonPaymentMethods[selectedReason.reasonName] || { methods: [], showTickets: false };
    setShowTicketSelector(reasonConfig.showTickets);

    if (!reasonConfig.showTickets) return;

    const allowedPaymentMethods = reasonConfig.methods;
    
    const filteredTickets = ticketsList.filter(ticket => {
      return ticket.paymentTypeResponse?.some(payment => 
        payment?.paymentMethod && allowedPaymentMethods.includes(payment.paymentMethod)
      ) ?? false;
    });

    const ticketCollection = createListCollection({
      items: filteredTickets.map((ticket) => ({
        label: ticket.ticketNumber,
        value: ticket.id,
      })),
    });

    setTickets(ticketCollection);
  };


  async function handleData() {
    setLoading(true);

    if (!selectEmployee || amount === 0 || !reason[0] || isNaN(amount)) {
      alert("Por favor, complete todos los campos faltantes.");
      setLoading(false);
      return;
    } else if (showTicketSelector  && !ticket[0]) {
      alert("Por favor, agregue un ticket.");
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
    } else {
      setNewEmployee(newEmployee, clousingId);
    }

    setLoading(false);
    onClose();
    setAmount(0);
    setReason([]);
    setTicket([]);
    setShowTicketSelector(false);
    setSelectEmployee(undefined);
    setIsEdited(false);

  }

  async function handleDelete(employeeId: string | number, clousingId: number) {
    setLoading(true);
    //Ignorar error de abajo, sí jala bien :'u
    const deletionSuccessful: boolean = await deleteEmployee(employeeId, clousingId);
    setLoading(false);
    if (deletionSuccessful === false) {
      toast("Error al eliminar el empleado. Por favor, inténtalo de nuevo.", "error")
      return;
    } else {
      toast("Empleado eliminado correctamente", "success");
      onClose();
      setAmount(0);
      setReason([]);
      setTicket([]);
      setIsEdited(false);
      setShowTicketSelector(false);
      setSelectEmployee(undefined);
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
          {isEdited ? (
            <DialogTitle>Edición de empleado</DialogTitle>
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
                min={0}
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
              />
            </Group>

            <SelectRoot
              collection={reasons}
              value={reason}
              onValueChange={(e) => handleReasonChange(e.value[0])}
            >
              <SelectLabel>Motivo</SelectLabel>
              <SelectTrigger>
                <SelectValueText
                  placeholder={isEdited && data?.reason ? data.reason : "Motivo"}
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

            {showTicketSelector && (
              <SelectRoot
                collection={tickets}
                value={ticket}
                onValueChange={(e) => setTicket(e.value)}
              >
                <SelectLabel>Ticket</SelectLabel>
                <SelectTrigger>
                  <SelectValueText
                    placeholder={
                      ticket.length > 0 
                      ? ticketsList.find(t => t.id === Number(ticket[0]))?.ticketNumber 
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
            <Box position="fixed" top="50%" left="50%" zIndex={1000}>
              <Loading />
            </Box>
          )}
        </DialogBody>

        <DialogFooter  >
          <Box>
           {data != null && (
            <Button
              colorPalette="meraError"
              loading={loading}
              onClick={() => handleDelete(data?.id!, clousingId)}
            >
              Eliminar
            </Button>
          )}
          {
            data == null && (
              <DialogActionTrigger asChild>
                <Button colorPalette="meraError">Cancelar</Button>
              </DialogActionTrigger>
            )
          }
          </Box> 
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
