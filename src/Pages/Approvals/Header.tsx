import { useCallback, useEffect, useState } from "react";
import { Box, Button, Field, Grid, GridItem, Heading, } from "@chakra-ui/react";
import { useApprovalContext } from "@context/approvals/approvalsListContext";
import { selectOption } from "@models/common.model";
import { Employee } from "@models/employee.model";
import { filterOptionsProps, HeaderProps } from "@models/approvals.model";
import FilterEmployee from "@components/FilterEmployee";
import ComboBoxCustom from "@components/ComboBoxCustom";
import  DatePicker from "../LotClosure/components/DatePicker";
import Loading from "@components/Loading";
import { RegisterApprovals } from "./RegisterApprovals";
import { APPROVALS_TYPE } from "@models/const/approvals.const";

function Header({type}:HeaderProps) {

    const { getEmployeeList, getSubsidiaries, getZoneList, getCDCs, getStatusList, fectApprovals } = useApprovalContext();

    const [requestRange, setRequestRange] = useState<[Date | null, Date | null]>([null, null]);
	const [closingRange, setClosingRange] = useState<[Date | null, Date | null]>([null, null]);
    const [requestStart, requestEnd] = requestRange;
	const [closingStart, closingEnd] = closingRange;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<selectOption[]>([]);
    const [selectEmployee, setSelectEmployee] = useState<Employee>();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [subsidiaries, setSubsidiaries] = useState<selectOption[]>([]);
    const [zones, setZones] = useState<selectOption[]>([]);
    const [cdc, setCDC] = useState<selectOption[]>([]);
        
    const [subSelected, setSubSelected] = useState<string[]>([]);
    const [zonesSelected, setZonesSelected] = useState<string[]>([]);
    const [cdcSelected, setCDCSelected] = useState<string[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
        
    useEffect( () => {
        async function fetchData() {
            setIsLoading(true);

            const statusData = await getStatusList();
            setStatus(statusData);

            const employeeList: Employee[] = await getEmployeeList(0, 0);
            setEmployees(employeeList);

            const subsidiariesData = await getSubsidiaries();
            setSubsidiaries(subsidiariesData);

            habdleSearch();
            setIsLoading(false);
        }

        fetchData();
    },[]);

    useEffect(() => { 
        async function fetchZones() {
            if (subSelected.length === 0) setZonesSelected([]);
            const zoneData = await getZoneList(subSelected.map(Number));
            setZones(zoneData);
        }

        fetchZones();

    },[subSelected])

    useEffect(() => { 
        async function fetchCDC() {
            if(zonesSelected.length === 0) setCDCSelected([]);
            const cdcData = await getCDCs(zonesSelected.map(Number));
            setCDC(cdcData);
        }

        fetchCDC();

    },[zonesSelected]);

    const habdleSearch = async () => {

        setIsLoading(true);
        const statusString = selectedStatus.map(item => item.toString())

        const statusSelected = status
            .filter(item => statusString.includes(item.value.toString())).map(item => item.label) 

        const filterSelected: filterOptionsProps = {
            requestDateStart: requestStart,
            requestDateEnd: requestEnd,
            closingDateStart: closingStart,
            closingDateEnd: closingEnd,
            status: statusSelected || null,
            employeeId: selectEmployee ? selectEmployee.id : null,
            cdc: cdcSelected.map(Number)
        }

        await fectApprovals(filterSelected, true);

        setIsLoading(false);

    };

    const openDialog = useCallback(() => setIsDialogOpen(true), []);

    const closeDialog = useCallback(() => setIsDialogOpen(false), []);
    
    return (
        <>
            <Box p={6}>
                
                {isLoading && <Loading />}
                
                <Heading>Solicitud de Ajuste de Caja / Lote Cerrado </Heading>

                <Grid
                    templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
                    gap={4}
                    w="100%"
                    alignItems="end"
                >
                    <ComboBoxCustom multiple={false} options={subsidiaries} label="Subsidiarias" onValueChange={setSubSelected} selectedValues={subSelected} disableCondition={false}></ComboBoxCustom>

                    <ComboBoxCustom multiple={true} options={zones} label="Zonas" onValueChange={setZonesSelected} selectedValues={zonesSelected} disableCondition={false}></ComboBoxCustom>
                    
                    <ComboBoxCustom multiple={true} options={cdc} label="Centros de consumo" onValueChange={setCDCSelected} selectedValues={cdcSelected} disableCondition={false}></ComboBoxCustom>

                    <Field.Root>
                        <Field.Label>Empleado solicitante</Field.Label>
                        <FilterEmployee
                            employees={employees}
                            label={false}
                            onSelect={setSelectEmployee}
                            disabled={false}
                            employeeToEdit={null}
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Fechas de solicitud</Field.Label>
                        <DatePicker
                            startDate={requestStart}
                            endDate={requestEnd}
                            onChange={setRequestRange}
                        />
                    </Field.Root>

                    <Field.Root>
                        <Field.Label>Fechas de cierre</Field.Label>
                        <DatePicker
                            startDate={closingStart}
                            endDate={closingEnd}
                            onChange={setClosingRange}
                        />
                    </Field.Root>

                    <ComboBoxCustom multiple={true} options={status} label="Estatus" onValueChange={setSelectedStatus} selectedValues={selectedStatus} disableCondition={false}></ComboBoxCustom>

                    { type == APPROVALS_TYPE.APPROVALS && (
                            <Button
                                colorPalette="meraInfo"
                                onClick={() => habdleSearch()}
                            >
                                Buscar
                            </Button>
                        )
                    }

                    { type == APPROVALS_TYPE.REQUEST && (
                            <>                        
                                <GridItem />
                                <GridItem />

                                <Button
                                    colorPalette="meraInfo"
                                    onClick={() => habdleSearch()}
                                >
                                    Buscar
                                </Button>


                                <Button colorPalette="meraPrimary" onClick={() => openDialog()}>
                                    Agregar nueva Solicitud
                                </Button>
                            </>
                        )
                    }


                </Grid>
            </Box>

            <RegisterApprovals isOpen={isDialogOpen} onClose={closeDialog} />
        </>
    )
}

export  default Header;