import { useState } from "react";
import { Box, Grid, Group, Input, InputAddon  } from "@chakra-ui/react";
import { Skeleton } from "@components/ui/skeleton";
import { Button } from "@components/ui/button"
import { useHeaders } from "@context/clousing/headerContext";
import { useEffect } from "react";

const HeaderClousing = ({ data }) => {
    const [header, setHeader] = useState();
    const {loading, getHeader} = useHeaders();


    useEffect(()=>{
        async function fetchData() {
        const header = await getHeader(data.id, data.employe);
        console.log(header);
        setHeader(header);
        }
        fetchData(data.id, data.employe);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

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
                        <Input value={header?.cdc || ""} placeholder="CDC" readOnly />
                    </Skeleton>
                </Group>

                <Group>
                    <InputAddon>Ubicación</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={header?.location || ""} placeholder="Ubicación" readOnly />
                    </Skeleton>
                </Group>

                <Group>
                    <InputAddon>Empresa</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={header?.subsidiary || ""} placeholder="Empresa" readOnly />
                    </Skeleton>
                </Group>

                <Group>
                    <InputAddon>Fecha</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={header?.date || ""} placeholder="Fecha" readOnly />
                    </Skeleton>
                </Group>

                <Group>
                    <InputAddon>Corte POS</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={header?.totalPOS || ""} placeholder="Corte POS" readOnly />
                    </Skeleton>
                </Group>

                <Group>
                    <InputAddon>Corte físico</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={header?.totalClousing || ""} placeholder="Corte físico" readOnly />
                    </Skeleton>
                </Group>

                <Group>
                    <InputAddon>Diferencia</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={header?.difference || ""} placeholder="Diferencia" readOnly />
                    </Skeleton>
                </Group>

                <Group>
                    <InputAddon>Servicio 10%</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={header?.service || ""} placeholder="Servicio 10%" readOnly />
                    </Skeleton>
                </Group>

                <Group>
                    <InputAddon>Descuento + IVA POS</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={data?.discountPOS || ""} placeholder="Descuento + IVA POS" readOnly />
                    </Skeleton>
                </Group>

                <Group>
                    <InputAddon>Descuento físico</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={data?.discountClousing || ""} placeholder="Descuento físico" readOnly />
                    </Skeleton>
                </Group>

                <Button size="sm">
                    Toggle
                </Button>
            </Grid>

        </Box>
    );

}

export default HeaderClousing;