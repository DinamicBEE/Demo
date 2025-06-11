import { Box, Grid, Group, InputAddon, Skeleton, Input, GridItem } from "@chakra-ui/react";
import { CurrencyInput } from "@components/NumericInput";
import { useClousing } from "@context/home/clousingContext";
import { GeneralInfoProps } from "@models/common.clousing.model";

function GeneralInfo({subsidiary, store}: GeneralInfoProps) {

    const { loading, header } = useClousing();

    return (
        <Box>
            <Grid
            templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
            gap={4}
            mb={4}
            >
                <Group>
                    <InputAddon>Subsidiaria</InputAddon>
                    <Skeleton loading={loading}>
                    <Input
                        placeholder="No seleccionada"
                        value={subsidiary.name}
                        readOnly
                    />
                    </Skeleton>
                </Group>
                <Group>
                    <InputAddon>Restaurante</InputAddon>
                    <Skeleton loading={loading}>
                    <Input
                        placeholder="No seleccionada"
                        value={store.name}
                        readOnly
                        id={store.id.toString()}
                    />
                    </Skeleton>
                </Group>
                <Group>
                    <InputAddon>Fecha</InputAddon>
                    <Skeleton loading={loading}>
                    <Input
                        disabled
                        placeholder="No seleccionada"
                        defaultValue={header.date}
                    />
                    </Skeleton>
                </Group>
                <Group>
                    <InputAddon>Hora</InputAddon>
                    <Skeleton loading={loading}>
                    <Input
                        disabled
                        placeholder="No seleccionada"
                        defaultValue={header.time}
                    />
                    </Skeleton>
                </Group>
                <CurrencyInput
                    name={"Total Ventas"}
                    value={header.totalPOS}
                    loading={loading}
                />
                <CurrencyInput
                    name={"Total Ventas Registradas"}
                    value={header.totalPhysical}
                    loading={loading}
                />
                <CurrencyInput
                    name={"Diferencia"}
                    value={header.difference}
                    loading={loading}
                />

                <GridItem colSpan={1} />
            </Grid>

        </Box>
    );
}

export default GeneralInfo;