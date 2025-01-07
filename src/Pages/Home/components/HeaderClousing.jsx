import { useState } from "react";
import { Box, Grid, Group, Input, InputAddon  } from "@chakra-ui/react";
import { Skeleton } from "@components/ui/skeleton";
import { Button } from "@components/ui/button"

const HeaderClousing = ({ data }) => {
    const [loading, setLoading] = useState(true)

    return(
        <Box>
            <Grid
                templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
                gap={4}
                mb={4}
            >
                <Group attached>
                    <InputAddon>CDC</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={data?.employe} placeholder="Empleado" />
                    </Skeleton>
                </Group>

                <Group attached>
                    <InputAddon>Ubicación</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={data?.employe} placeholder="Empleado" />
                    </Skeleton>
                </Group>

                <Group attached>
                    <InputAddon>Empresa</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={data?.employe} placeholder="Empleado" />
                    </Skeleton>
                </Group>

                <Group attached>
                    <InputAddon>Fecha</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={data?.employe} placeholder="Empleado" />
                    </Skeleton>
                </Group>

                <Group attached>
                    <InputAddon>Corte POS</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={data?.employe} placeholder="Empleado" />
                    </Skeleton>
                </Group>

                <Group attached>
                    <InputAddon>Corte físico</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={data?.employe} placeholder="Empleado" />
                    </Skeleton>
                </Group>

                <Group attached>
                    <InputAddon>Diferencia</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={data?.employe} placeholder="Empleado" />
                    </Skeleton>
                </Group>

                <Group attached>
                    <InputAddon>Servicio 10%</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={data?.employe} placeholder="Empleado" />
                    </Skeleton>
                </Group>

                <Group attached>
                    <InputAddon>Descuento + IVA POS</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={data?.employe} placeholder="Empleado" />
                    </Skeleton>
                </Group>

                <Group attached>
                    <InputAddon>Descuento físico</InputAddon>
                    <Skeleton loading={loading}>
                        <Input value={data?.employe} placeholder="Empleado" />
                    </Skeleton>
                </Group>

                <Button size="sm" onClick={() => setLoading((c) => !c)}>
                    Toggle
                </Button>
            </Grid>

        </Box>
    );

}

export default HeaderClousing;