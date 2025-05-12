import {
  DialogActionTrigger,
  DialogBackdrop,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  FormatNumber,
  Input,
  Table,
} from "@chakra-ui/react";
import { CurrencyInputNumber } from "@components/NumericInput";
import { Button } from "@components/ui/button";
import { useCashClousing } from "@context/clousing/cashClousingContext";
import React, { useEffect, useState } from "react";

interface CashClousingDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    currencyId: string,
    total: number,
    totalMXN: number,
    updatedDenominations: any[]
  ) => void;
  currencyId: string;
  data?: any;
}

export const CashClousingDetails: React.FC<CashClousingDetailsProps> = ({
  isOpen,
  onClose,
  onSave,
  currencyId,
  data,
}) => {
  const { cashClousingSelect } = useCashClousing();
  const [denominations, setDenominations] = useState<any[]>([]);

  useEffect(() => {
    if (cashClousingSelect?.denominations) {
      setDenominations([...cashClousingSelect.denominations]);
    }
  }, [cashClousingSelect]);

  const handleChangeAmount = (index: number, value: string) => {
    const numericValue = parseInt(value) || 0;
    const updated = [...denominations];
    updated[index] = { ...updated[index], amount: numericValue };
    setDenominations(updated);
  };

  const total = denominations.reduce((sum, item) => sum + item.denomination * item.amount, 0);
  const totalMXN = (total * cashClousingSelect.exchangeRate)

  const handleSave = () => {
    onSave(currencyId, total, totalMXN, denominations);
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
          Lista de Denominaciones.{" "}
          <b>Total POS: ${(cashClousingSelect.totalPOS / cashClousingSelect.exchangeRate).toFixed(2)}</b>
        </DialogHeader>
        <DialogBody>
          <Table.ScrollArea>
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
                {denominations.map((item: any, index: number) => (
                  <Table.Row key={item.idDenomination ?? index}>
                    <Table.Cell textAlign="center">
                      ${item.denomination}
                    </Table.Cell>
                    <Table.Cell textAlign="center">

                      <CurrencyInputNumber
                        loading={false}
                        value={item.amount}
                        currency={false}
                        onChange={(value) => handleChangeAmount(index, String(value ?? 0))} // convierte a string si es necesario
                        allowDecimals={false}
                        disabled={data?.closingConfirmation ?? false}
                      />

                    </Table.Cell>
                    <Table.Cell textAlign="center">
                      <FormatNumber
                        value={item.denomination * item.amount}
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
          <Button type="submit" colorPalette="meraPrimary" onClick={handleSave} disabled={data?.closingConfirmation ?? false}>
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};
