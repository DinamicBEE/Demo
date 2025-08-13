import { useState, useEffect, useCallback, useMemo } from "react";
import { Box, Grid, Group, Input, InputAddon, Button, Skeleton } from "@chakra-ui/react";
import { useHeaders } from "@context/home/headerContext";
import { HeaderData } from "@models/common.clousing.model";
import { CurrencyInput, EditableCurrencyInput } from "@components/NumericInput";
import { useClousing } from "@context/home/clousingContext";

function HeaderClousing({
  id,
  closingConfirmation,
  location,
  subsidiary,
}: {
  id: number;
  closingConfirmation: boolean;
  location: string;
  subsidiary: string;
}) {
  const { dataRow } = useClousing();
  const { getHeader, header, updateHeaderState } = useHeaders();
  const [localHeader, setLocalHeader] = useState<HeaderData | undefined>();
  const [discountValue, setDiscountValue] = useState(0);

  const currentHeader = useMemo(() => header[id], [header, id]);

  const fetchHeader = useCallback(async () => {
    if (!currentHeader) {
      const headerData = await getHeader(dataRow);
      setLocalHeader(headerData);
    } else {
      setLocalHeader(currentHeader);
    }
  }, [currentHeader, dataRow, getHeader]);

  useEffect(() => {
    fetchHeader();
  }, [fetchHeader]);

  const handleDiscountInputChange = useCallback((value: string) => {
    const numericValue = Number(value.replace(/[^0-9.-]+/g, ""));
    if (!isNaN(numericValue) && value !== undefined) {
      setDiscountValue(numericValue);
    }
  }, []);

  useEffect(() => {
    if (localHeader && discountValue !== localHeader.discountPhysical) {
      const updatedLocal = { ...localHeader, discountPhysical: discountValue };
      setLocalHeader(updatedLocal);
      updateHeaderState({ ...header, [id]: updatedLocal });
    }
  }, [discountValue, localHeader, header, id, updateHeaderState]);

  const memoizedHeaderProps = useMemo(() => ({
    date: localHeader?.date || "",
    totalPOS: localHeader?.totalPOS,
    totalClousing: localHeader?.totalClousing,
    difference: localHeader?.difference ? Number(localHeader.difference.toFixed(2)) : undefined,
    discountClousing: localHeader?.discountClousing,
    discountPhysical: discountValue
  }), [localHeader, discountValue]);

  return (
    <Box>
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
        gap={4}
        mb={4}
      >
        <Group>
          <InputAddon>CDC</InputAddon>
          <Skeleton loading={false} width={"100%"}>
            <Input value={location || ""} placeholder="CDC" readOnly />
          </Skeleton>
        </Group>

        <Group>
          <InputAddon>Ubicación</InputAddon>
          <Skeleton loading={false} width={"100%"}>
            <Input value={location || ""} placeholder="Ubicación" readOnly />
          </Skeleton>
        </Group>

        <Group>
          <InputAddon>Subsidiaria</InputAddon>
          <Skeleton loading={false} width={"100%"}>
            <Input value={subsidiary || ""} placeholder="Subsidiaria" readOnly />
          </Skeleton>
        </Group>

        <Group>
          <InputAddon>Fecha</InputAddon>
          <Skeleton loading={false} width={"100%"}>
            <Input value={memoizedHeaderProps.date} placeholder="Fecha" readOnly />
          </Skeleton>
        </Group>

        {/* Inputs de moneda */}
        <CurrencyInput
          value={memoizedHeaderProps.totalPOS}
          name={"Corte POS"}
          loading={false}
        />

        <CurrencyInput
          value={memoizedHeaderProps.totalClousing}
          name={"Corte físico"}
          loading={false}
        />

        <CurrencyInput
          value={memoizedHeaderProps.difference}
          name={"Diferencia"}
          loading={false}
        />

        <CurrencyInput 
          value={memoizedHeaderProps.discountClousing}
          name={"Descuento POS"}
          loading={false} 
        />

        <EditableCurrencyInput 
          value={memoizedHeaderProps.discountPhysical || 0} 
          name={"Descuento físico"} 
          disabled={closingConfirmation}
          onChange={handleDiscountInputChange}
          loading={false} 
        />

        <Button
          size="sm"
          colorPalette="meraInfo"
          disabled={closingConfirmation}
        >
          Actualizar
        </Button>
      </Grid>
    </Box>
  );
}

export default HeaderClousing;