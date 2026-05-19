import { Box, Grid, Group, InputAddon, Skeleton, Input, GridItem } from "@chakra-ui/react";
import { CurrencyInput } from "@components/NumericInput";
import { useClousing } from "@context/home/clousingContext";
import { GeneralInfoProps, HeaderClousingModel } from "@models/common.clousing.model";
import { useEffect, useState } from "react";

function GeneralInfo({subsidiary, store, isReport, totals}: GeneralInfoProps) {

    const { loading, header } = useClousing();
    const [localHeader, setLocalHeader] = useState({} as HeaderClousingModel)

    useEffect(() => {
        setLocalHeader(header);
    }, [header])

    return (
        <Box>
            {!isReport && (

                <Grid
                templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
                gap={4}
                mb={4}
                >
                    <Group>
                        <InputAddon>Subsidiaria</InputAddon>
                        <Skeleton loading={loading} >
                            <Input
                                placeholder="No seleccionada"
                                value={subsidiary?.name}
                                readOnly
                            />
                        </Skeleton>
                    </Group>
                    <Group>
                        <InputAddon>CDC</InputAddon>
                        <Skeleton loading={loading} >
                            <Input
                                placeholder="No seleccionada"
                                value={store?.name}
                                readOnly
                                id={store?.id.toString()}
                            />
                        </Skeleton>
                    </Group>

                    <Group>
                        <InputAddon>Fecha</InputAddon>
                        <Skeleton loading={loading} >
                        <Input
                            disabled
                            placeholder="No seleccionada"
                            defaultValue={localHeader.date}
                        />
                        </Skeleton>
                    </Group>
                    <Group>
                        <InputAddon>Hora</InputAddon>
                        <Skeleton loading={loading} >
                        <Input
                            disabled
                            placeholder="No seleccionada"
                            defaultValue={localHeader.time}
                        />
                        </Skeleton>
                    </Group>

                    <CurrencyInput
                        name={"Total POS"}
                        value={localHeader.totalPOS}
                        loading={loading}
                    />
                    <CurrencyInput
                        name={"Total Físico"}
                        value={localHeader.totalPhysical}
                        loading={loading}
                    />
                    <CurrencyInput
                        name={"Diferencia"}
                        value={localHeader.difference}
                        loading={loading}
                    />

                    <GridItem colSpan={1} />
                </Grid>
            )}

            {isReport && (
                <Grid
                    templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                    gap={4}
                    mb={4}
                >
                    <CurrencyInput
                        name={"Total POS"}
                        value={totals?.totalPOS}
                        loading={loading}
                    />
                    <CurrencyInput
                        name={"Total Físico"}
                        value={totals?.totalPhysical}
                        loading={loading}
                    />
                    <CurrencyInput
                        name={"Diferencia"}
                        value={totals?.difference}
                        loading={loading}
                    />

                </Grid>
            )}

        </Box>
    );
}

export default GeneralInfo;