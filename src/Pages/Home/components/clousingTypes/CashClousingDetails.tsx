import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  FormatNumber,
  Input,
  Table,
} from "@chakra-ui/react";
import { Button } from "@components/ui/button";
import React, { useState, useMemo } from "react";

interface CashClousingDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (currencyId: string, total: number) => void;
  currencyId: string;
}

export const CashClousingDetails: React.FC<CashClousingDetailsProps> = ({ isOpen, onClose, onSave, currencyId, }) => {
  
  const [denominations, setDenominations] = useState([
    { id: null, idDenimination: 1, denomination: 500.0, amount: 2 },
    { id: null, idDenimination: 2, denomination: 100.0, amount: 2 },
  ]);

  const handleChangeAmount = (index: number, value: string) => {
    const numericValue = parseInt(value) || 0;
    const updated = [...denominations];
    updated[index].amount = numericValue;
    setDenominations(updated);
  };

  const total = useMemo(() => {
    return denominations.reduce((sum, item) => sum + item.denomination * item.amount, 0);
  }, [denominations]);

  const handleSave = () => {
    const total = denominations.reduce((sum, d) => sum + d.amount * d.denomination, 0);
    onSave(currencyId, total);
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
      <DialogContent>
        <DialogHeader>Lista de Denominaciones.</DialogHeader>

        <DialogBody>
          <Table.ScrollArea>
            <Table.Root size="sm" variant="outline">
              <Table.Header>
                <Table.Row bg="bg.subtle">
                  <Table.ColumnHeader textAlign="center">Denominación</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Cantidad</Table.ColumnHeader>
                  <Table.ColumnHeader textAlign="center">Subtotal</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {denominations.map((item, index) => (
                  <Table.Row key={item.idDenimination}>
                    <Table.Cell textAlign="center">${item.denomination}</Table.Cell>
                    <Table.Cell textAlign="center">
                      <Input
                        type="number"
                        value={item.amount}
                        onChange={(e) => handleChangeAmount(index, e.target.value)}
                        textAlign="center"
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
                    <FormatNumber value={total} style="currency" currency="USD" />
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

          <Button type="submit" colorPalette="meraPrimary" onClick={handleSave}>
            Guardar
          </Button>

        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
};