import { useState } from "react";
import { Box, Grid, Group, Input, InputAddon, Button  } from "@chakra-ui/react";
import { Skeleton } from "@components/ui/skeleton";
import { useHeaders } from "@context/home/headerContext";
import { useEffect } from "react";
import { HeaderClousingProps, HeaderData } from "@models/common.clousing.model"
import { CurrencyInput } from "@components/NumericInput";

function HeaderClousing ({ id, employe }: HeaderClousingProps) {
    const [localHeader, setLocalHeader] = useState<HeaderData | undefined>();
    const headerContext = useHeaders()
    if (!headerContext) {
        return null;
    }
    const {loading, header, getHeader} = headerContext;


    useEffect(()=>{
        async function fetchData() {
            if(!header[id]){
                const data = await getHeader(id, employe);
                setLocalHeader(data);
            } else {
                setLocalHeader(header[id][employe]);
            }
        }
        fetchData()
    },[header]);

    return(
        <Box>
            <Grid
                templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
                gap={4}
                mb={4}
            >
                <Group>
                    <InputAddon>CDC</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={localHeader?.cdc || ""} placeholder="CDC" readOnly />
                    </Skeleton>
                </Group>

                <Group>
                    <InputAddon>Ubicación</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={localHeader?.location || ""} placeholder="Ubicación" readOnly />
                    </Skeleton>
                </Group>

                <Group>
                    <InputAddon>Empresa</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={localHeader?.subsidiary || ""} placeholder="Empresa" readOnly />
                    </Skeleton>
                </Group>

                <Group>
                    <InputAddon>Fecha</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={localHeader?.date || ""} placeholder="Fecha" readOnly />
                    </Skeleton>
                </Group>

                <CurrencyInput value={localHeader?.totalPOS} name={"Corte POS"} loading={loading} />

                <CurrencyInput value={localHeader?.totalClousing} name={"Corte físico"} loading={loading} />

                <CurrencyInput value={localHeader?.difference} name={"Diferencia"} loading={loading} />

                <CurrencyInput value={localHeader?.service} name={"Servicio 10%"} loading={loading} />

                <CurrencyInput value={localHeader?.discountPOS} name={"Descuento + IVA POS"} loading={loading} />

                <CurrencyInput value={localHeader?.discountClousing} name={"Descuento físico"} loading={loading} />

                <Button size="sm" className="primary-button">
                    Actualizar
                </Button>
            </Grid>

        </Box>
    );

}

export default HeaderClousing;