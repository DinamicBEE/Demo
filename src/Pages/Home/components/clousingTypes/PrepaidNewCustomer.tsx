import {
  VStack,
  Box,
  Flex,
  Button,
  FieldRoot,
  FieldLabel,
  NumberInputRoot,
  NumberInputControl,
  NumberInputInput,
  InputGroup,
} from "@chakra-ui/react";
import FilterCustomer from "@components/FilterCustomer";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@components/ui/dialog";
import { PrepaidLineModel } from "@models/prepaid.model";
import { getCustomersPrepaid } from "@services/catalogService";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { BiDollar } from "react-icons/bi";

function PrepaidNewCustomer({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (line: PrepaidLineModel) => void;
}) {
  const [selectedCustomer, setSelectedCustomer] = useState<{
    value: number;
    label: string;
  } | null>(null);
  const [customers, setCustomers] = useState<
    { value: number; label: string }[]
  >([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [amount, setAmount] = useState<number>(0);
  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen]);

  async function fetchData() {
    setCustomers(await getCustomersPrepaid());
  }

  function handleAddCustomer() {
    const newLine: PrepaidLineModel = {
      id: "prepaid-" + uuidv4(),
      client: selectedCustomer?.label || null,
      quantity: 0,
      supplementsQuantity: quantity,
      unitPrice: amount,
      totalPOS: 0,
      physical: 0,
      difference: 0,
      isEdit: true,
      coupons: [],
      ticketId: 0,
    };
    setSelectedCustomer(null);
    setAmount(0);
    setQuantity(1);
    onSave(newLine);
  }

  return (
    <DialogRoot
      open={isOpen}
      closeOnEscape={false}
      closeOnInteractOutside={false}
      scrollBehavior="inside"
      onOpenChange={() => {
        onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo Cliente Complementario</DialogTitle>
        </DialogHeader>

        <DialogBody>
          <VStack w={"full"}>
            <FieldRoot w={"full"}>
              <FieldLabel>Cliente</FieldLabel>
              <Box w={"full"}>
                <FilterCustomer
                  disabled={false}
                  customers={customers}
                  customerSelect={
                    selectedCustomer?.label || "Selecciona cliente"
                  }
                  label={false}
                  onSelect={(customer) => {
                    setSelectedCustomer(customer);
                  }}
                />
              </Box>
            </FieldRoot>
            <FieldRoot>
              <FieldLabel>Cantidad</FieldLabel>
              <NumberInputRoot
                w={"full"}
                step={1}
                variant="outline"
                min={0}
                max={200}
                defaultValue={"1"}
                value={quantity.toString()}
                onValueChange={(ev) => setQuantity(Number(ev.value))}
              >
                <NumberInputControl />
                <NumberInputInput />
              </NumberInputRoot>
            </FieldRoot>
            <FieldRoot>
              <FieldLabel>Costo unitario ($)</FieldLabel>
              <NumberInputRoot
                w={"full"}
                variant="outline"
                step={0.01}
                min={0}
                prefix="$"
                defaultValue={"0"}
                value={amount.toString()}
                onValueChange={(ev) => setAmount(Number(ev.value))}
              >
                <NumberInputControl />
                <InputGroup startElement={<BiDollar />}>
                  <NumberInputInput />
                </InputGroup>
              </NumberInputRoot>
            </FieldRoot>
          </VStack>
        </DialogBody>

        <DialogFooter>
          <Flex gap={4}>
            <Button
              colorPalette="meraError"
              onClick={() => {
                setSelectedCustomer(null);
                setAmount(0);
                setQuantity(1);
                onClose();
              }}
            >
              Cerrar
            </Button>
            <Button
              colorPalette="meraPrimary"
              disabled={
                selectedCustomer === null || amount == 0 || quantity == 0
              }
              onClick={(ev) => {
                ev.preventDefault();
                handleAddCustomer();
              }}
            >
              Agregar Complementario
            </Button>
          </Flex>
        </DialogFooter>
        <DialogCloseTrigger
          onClick={() => {
            setSelectedCustomer(null);
            setAmount(0);
            setQuantity(1);
          }}
        />
      </DialogContent>
    </DialogRoot>
  );
}

export default PrepaidNewCustomer;
