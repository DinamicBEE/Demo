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
  SelectItemText,
  Span,
  Stack,
  VStack,
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
  TicketPaymentMethod,
  reasonPaymentMethods
} from "@models/employee.model";
import { useEmployeeContext } from "@context/clousing/employeeClousing";
import Loading from "@components/Loading";
import { v4 as uuidv4 } from "uuid";
import { selectOption } from "@models/common.model";
import { toast } from "@utils/Toast";
import { getTicketListClousing } from "@services/catalogService";

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
  const [reason, setReason] = useState<number[]>([]);
  const [ticket, setTicket] = useState<string[]>([]);

  const [isEdited, setIsEdited] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [catalogLoading, setCatalogLoading] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [reasons, setReasons] = useState<ListCollection>(
    createListCollection<selectOption[]>({ items: [] })
  );
  const [tickets, setTickets] = useState<ListCollection>(
    createListCollection<selectOption[]>({ items: [] })
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
    const fetchData = async () => { 
      if (isOpen) {
        setCatalogLoading(true);

        const reasonsListResponse: ReasonsModel[] = await getReasonsList(subsidiaryId, cdc);
        const reasonCollection = createListCollection({
          items: reasonsListResponse.map((reason) => ({
            label: reason.reasonName,
            value: reason.id,
          })),
        });
        setReasonsList(reasonsListResponse);
        setReasons(reasonCollection);
  
        const ticketsListResponse: TicketModel[] = await getTicketListClousing(clousingId);
        const ticketCollection = createListCollection({
          items: ticketsListResponse.map((ticket) => ({
            label: ticket.ticketNumber,
            value: ticket.id,
          })),
        });
        setTickets(ticketCollection);
        setTicketsList(ticketsListResponse);

        if (data !== null) {
          setIsEdited(true);
  
          const employeeToEdit = employees.find(
            (emp) => emp.name === data.employeeName
          );

          if (!employeeToEdit) {
            console.warn("Empleado no encontrado:", data.employeeName);
            return;
          }
  
          setSelectEmployee({
            id: employeeToEdit?.id || 0,
            name: data.employeeName,
            employeeNumber: data.employeeNumber,
          });
          setAmount(data.amount);
          const reasonToSelect = reasonsListResponse.find(
            (reasonItem) => reasonItem.reasonName === data.reason
          );
          if (reasonToSelect) {
            setReason([Number(reasonToSelect.id)])
            // handleReasonChange(reasonToSelect.id.toString());
          } else {
            setShowTicketSelector(false);
            setReason([]);
          }
          if (data.ticketNumber) {
            const ticketToSelect = ticketsListResponse.find(
              t => t.ticketNumber === data.ticketNumber
            );

            if (ticketToSelect) {
              setTicket([ticketToSelect.id.toString()]);
            }
          }
        }
        setCatalogLoading(false);
        
      } else {
        resetForm()
      }
    }

    fetchData();
  }, [getEmployeeList, getReasonsList, getTicketsList, subsidiaryId, cdc, isOpen, data]);

  useEffect(() => {
    async function fetchEmployees() {
      const employeeList: Employee[] = await getEmployeeList(subsidiaryId, cdc);
      if (employeeList) {
        setEmployees(employeeList);
      }};
    fetchEmployees();
  }, [getEmployeeList])
  

  useEffect(() => {
    const selectedReason = reasonsList.find(item => item.id === Number(reason[0]));
    
    if (!selectedReason) {
      setShowTicketSelector(false);
      return;
    }

    const reasonConfig = reasonPaymentMethods[selectedReason.reasonName] || { methods: [], showTickets: false };
    setShowTicketSelector(reasonConfig.showTickets);

    if (!reasonConfig.showTickets) return;

    const allowedPaymentMethods = reasonConfig.methods;

    const expandedTickets = ticketsList.flatMap((ticket) => {
      const matches = ticket.paymentTypeResponse?.filter(payment =>
        payment?.paymentMethod && allowedPaymentMethods.includes(payment.paymentMethod)
      ) ?? [];

      return matches.map((payment, index) => ({
        label: `${ticket.ticketNumber}`,
        value: `${ticket.id}-${index}`, 
        description: `$${Number(payment.amount).toFixed(2)}`,
        originalValue: ticket.id
      }));
    });

    const ticketCollection: ListCollection = createListCollection({
      items: expandedTickets,
    });

    setTickets(ticketCollection);
    
  }, [reason]);


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
      (item) => item.id === Number(ticket[0].split("-")[0])
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

    resetForm();
    onClose();
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
      resetForm();
      setLoading(false);
    }
  }

  function resetForm() {
    setAmount(0);
    setReason([]);
    setTicket([]);
    setShowTicketSelector(false);
    setSelectEmployee(undefined);
    setIsEdited(false);
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
        <DialogHeader bg="#7ca1ee" color="white" style={{ borderRadius: '6px 6px 0px 0px' }}>
          <DialogTitle fontWeight="medium" fontSize="xl">{isEdited ? "Edición de empleado" : "Agregar empleado"}</DialogTitle>
          <DialogCloseTrigger onClick={() => onClose()} color="#166534" />
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



            <SelectRoot
              collection={reasons}
              value={reason.map(num => num.toString())}
              onValueChange={(e) => setReason([Number(e.value[0])])}
            >
              <SelectLabel>Motivo</SelectLabel>
              <SelectTrigger>
                <SelectValueText
                  placeholder={"Motivo"}
                />
              </SelectTrigger>
              <SelectContent>
                {reasons.items.map((item) => (
                  <SelectItem item={item} key={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>

            {(showTicketSelector && tickets.items.length > 0) && (
              <SelectRoot
                collection={tickets}
                value={ticket}
                onValueChange={(e) => {
                  setTicket([e.value[0]]);  
                  setAmount(Number(e.items[0].description.replace("$", "")) || 0)                  
                }}
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
                  {tickets.items.map((ticket, index) => (
                    <SelectItem item={ticket} key={ticket.value}>
                      <VStack alignItems={"flex-start"} gap={0}>
                        <SelectItemText>{ticket.label}</SelectItemText>
                        <Span color="fg.muted" textStyle="xs">
                          {ticket.description}
                        </Span>
                      </VStack>
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            )}
            <Group attached>
              <InputAddon>Monto</InputAddon>
              <Input
                type="number"
                prefix="$ "
                placeholder="Ingrese el monto"
                min={0}
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value))}
              />
            </Group>
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

      </DialogContent>
    </DialogRoot>
  );
}

export default AddEmployee;
