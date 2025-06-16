import { useState } from "react";
import { Box, Grid, Group, Input, InputAddon, Button, Skeleton } from "@chakra-ui/react";
import { useHeaders } from "@context/home/headerContext";
import { useEffect } from "react";
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
  const [localHeader, setLocalHeader] = useState<HeaderData | undefined>();

  const { dataRow } = useClousing();
  const { getHeader, header, updateHeaderState } = useHeaders();

  useEffect(() => {
    if (!header[id]) {
      const headerData = getHeader(dataRow);
      // console.log("Header info", headerData);
      
      setLocalHeader(headerData);
    } else {
      setLocalHeader(header[id]);
    }
  }, [header, id, dataRow, getHeader]);

  const handleDiscountInputChange = (value: string) => {

    const numericValue = Number(value.replace(/[^0-9.-]+/g, ""));

    if (!isNaN(numericValue) && value !== undefined) {

      setLocalHeader((prev) => {
        if (!prev) return undefined;
        const updatedLocal = { ...prev, discountClousing: numericValue };
        updateHeaderState({ ...header, [id]: updatedLocal });
              
        return updatedLocal;
      });
    }
    
  }

  return (
    <Box>
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
        gap={4}
        mb={4}
      >
        <Group>
          <InputAddon>CDC</InputAddon>
          <Skeleton loading={false}>
            <Input value={location || ""} placeholder="CDC" readOnly />
          </Skeleton>
        </Group>

        <Group>
          <InputAddon>Ubicación</InputAddon>
          <Skeleton loading={false}>
            <Input
              value={location || ""}
              placeholder="Ubicación"
              readOnly
            />
          </Skeleton>
        </Group>

        <Group>
          <InputAddon>Empresa</InputAddon>
          <Skeleton loading={false}>
            <Input
              value={subsidiary || ""}
              placeholder="Empresa"
              readOnly
            />
          </Skeleton>
        </Group>

        <Group>
          <InputAddon>Fecha</InputAddon>
          <Skeleton loading={false}>
            <Input
              value={localHeader?.date || ""}
              placeholder="Fecha"
              readOnly
            />
          </Skeleton>
        </Group>

        <CurrencyInput
          value={localHeader?.totalPOS}
          name={"Corte POS"}
          loading={false}
        />

        <CurrencyInput
          value={localHeader?.totalClousing}
          name={"Corte físico"}
          loading={false}
        />

        <CurrencyInput
          value={Number(localHeader?.difference?.toFixed(2))}
          name={"Diferencia"}
          loading={false}
        />

        {/* <CurrencyInput value={localHeader?.service} name={"Servicio 10%"} loading={false} /> 

                
                <EditableCurrencyInput 
                  value={localHeader?.discountClousing} 
                  name={"Descuento físico"} 
                  disabled={closingConfirmation}
                  onChange={handleDiscountInputChange}
                  loading={false} /> */}
                  <CurrencyInput 
                  value={localHeader?.discountPOS}
                  name={"Descuento + IVA POS"}
                  loading={false} />


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
