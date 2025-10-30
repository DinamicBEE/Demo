import {  Flex, FormatNumber, Table } from "@chakra-ui/react";
import { CurrencyInput, CurrencyInputNumber } from "@components/NumericInput";
import { Button } from "@components/ui/button";
import { DialogActionTrigger, DialogBackdrop, DialogBody, DialogContent,
  DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogCloseTrigger } from "@components/ui/dialog";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import { CashClousingDetailsProps } from "@models/cash.model";
import React, { useEffect, useState } from "react";

export const CashClousingDetails: React.FC<CashClousingDetailsProps> =
  ({ isOpen, onClose, onSave, currencyId, data, isRoleEditable }) => {

  const { cashClousingSelect } = useCashClousing();
  const [denominations, setDenominations] = useState<any[]>([]);

  useEffect(() => {
    if (cashClousingSelect?.denominations) {
      setDenominations([...cashClousingSelect.denominations]);
    }
  }, [cashClousingSelect]);

  const handleChangeAmount = (index: number, value: string) => {
    const numericValue = parseFloat(value) || 0;

    const updated = [...denominations];
    updated[index] = { ...updated[index], amount: numericValue };
    setDenominations(updated);
  };

  const total = denominations.reduce((sum, item) => {
    if (item.denomination === "Cambio") {
      return sum + (parseFloat(item.amount) || 0);
    }

    const denom = parseFloat(item.denomination);
    const amount = parseFloat(item.amount) || 0;

    return sum + (denom * amount);
  }, 0);

  // const totalMXNRaw = (total * cashClousingSelect.exchangeRate);
  // const totalMXN = Math.ceil(totalMXNRaw);
  const totalMXN = (total * cashClousingSelect.exchangeRate)

  const handleSave = () => {
    let newTotalMXN = totalMXN;
    if(total == (parseFloat((cashClousingSelect.totalPOS / cashClousingSelect.exchangeRate).toFixed(2)))){
      newTotalMXN = cashClousingSelect.totalPOS;
    }

    onSave(currencyId, total, newTotalMXN, denominations);
    onClose();
  };

  return (
    <DialogRoot
      scrollBehavior="inside"
      size="lg"
      open={isOpen}
      onOpenChange={onClose}
      closeOnEscape={false}
      closeOnInteractOutside={false}
    >
      <DialogBackdrop />
      <DialogContent>
        <DialogHeader>
           <DialogTitle>Lista de Denominaciones</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Flex gap={4}  mb={4}>
            <CurrencyInput
              value={parseFloat((cashClousingSelect.totalPOS / cashClousingSelect.exchangeRate).toFixed(2))}
              name={"POS"}
              loading={false}
            />
            <CurrencyInput
              value={total}
              name={"Físico"}
              loading={false}
            />
            <CurrencyInput
              value={parseFloat((cashClousingSelect.totalPOS / cashClousingSelect.exchangeRate).toFixed(2)) - total}
              name={"Diferencia"}
              loading={false}
            />
          </Flex>

          <Table.ScrollArea borderWidth="1px" rounded="md">
            <Table.Root size="sm" variant="outline">
              <Table.Header>
                <Table.Row bg="bg.subtle">
                  <Table.ColumnHeader textAlign="center">
                    Denominación
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">
                    Cantidad
                  </Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">
                    Subtotal
                  </Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  denominations.map((item: any, index: number) => (
                    <Table.Row key={item.idDenomination ?? index}>

                      <Table.Cell textAlign="center">
                        {item.denomination === 'Cambio' ? item.denomination : `$${item.denomination}`}
                      </Table.Cell>

                      <Table.Cell textAlign="center">

                        <CurrencyInputNumber
                          loading={false}
                          value={item.amount}
                          currency={false}
                          onChange={(value) => handleChangeAmount(index, String(value ?? 0))} // convierte a string si es necesario
                          allowDecimals={item.denomination === 'Cambio' ? true : false}
                          disabled={data?.closingConfirmation || !isRoleEditable}
                        />

                      </Table.Cell>

                      <Table.Cell textAlign="center">
                        <FormatNumber
                          value={item.denomination === 'Cambio' ? item.amount : item.denomination * item.amount}
                          style="currency"
                          currency="USD"
                        />
                      </Table.Cell>

                    </Table.Row>
                  ))}

                <Table.Row bg="bg.subtle">

                  <Table.Cell colSpan={2} textAlign="right" fontWeight="bold">
                    Total:
                  </Table.Cell>

                  <Table.Cell textAlign="center" fontWeight="bold">
                    <FormatNumber
                      value={total}
                      style="currency"
                      currency="USD"
                    />
                  </Table.Cell>
                </Table.Row>

              </Table.Body>
            </Table.Root>
          </Table.ScrollArea>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button colorPalette="meraError">Cancelar</Button>
          </DialogActionTrigger>
          <Button type="submit" colorPalette="meraPrimary" onClick={handleSave} disabled={data?.closingConfirmation || !isRoleEditable}>
            Guardar
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};
