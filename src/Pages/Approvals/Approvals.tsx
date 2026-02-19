import { useCallback, useEffect, useState } from "react";
import { Box, Button, Field, Grid, Heading } from "@chakra-ui/react";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { Approval, filterOptionsProps } from "@models/approvals.model";
import { TableApprovals } from "./TableApprovals";
import { DetailApprovals } from "./DetailApprovals";
import { getRequestList, getStatus } from "@services/approvalsServices";
import DatePicker from "../LotClosure/components/DatePicker";
import { createListCollection, ListCollection } from "@chakra-ui/react";
import { selectOption } from "@models/common.model";
import { fetchAndSetData } from "@utils/selectManagement";
import { renderMultiSelectWithControls, handleMultiSelectChange } from "@utils/selectManagement";
import FilterEmployee from "@components/FilterEmployee";
import { Employee } from "@models/employee.model";
import Loading from "@components/Loading";
import ComboBoxCustom from "@components/ComboBoxCustom";

function Approvals() {

	const { setDataApproval, getEmployeeList, getSubsidiaries, getZoneList, getCDCs } = useApprovalsList();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDialogEditOpen, setIsDialogEditOpen] = useState<boolean>(false);
	const [requestRange, setRequestRange] = useState<[Date | null, Date | null]>([null, null]);
	const [closingRange, setClosingRange] = useState<[Date | null, Date | null]>([null, null]);
    const [requestStart, requestEnd] = requestRange;
	const [closingStart, closingEnd] = closingRange;
	const [status, setStatus] = useState<ListCollection<selectOption>>(
    	createListCollection<selectOption>({ items: [] }));
	const [selectedStatus, setSelectedStatus] = useState<selectOption[]>([]);
	const [selectEmployee, setSelectEmployee] = useState<Employee>();
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [subsidiaries, setSubsidiaries] = useState<selectOption[]>([]);
	const [zones, setZones] = useState<selectOption[]>([]);
	const [cdc, setCDC] = useState<selectOption[]>([]);

	const [subSelected, setSubSelected] = useState<string[]>([]);
	const [zonesSelected, setZonesSelected] = useState<string[]>([]);
	const [cdcSelected, setCDCSelected] = useState<string[]>([]);

	const handleStatusChange = (event: { items: selectOption[] }) => {
		handleMultiSelectChange({
			newItems: event.items,
			currentSelected: selectedStatus,
			setSelectedOptions: setSelectedStatus
		});
	}

	useEffect( () => {
		async function fetchData() {
			setIsLoading(true);

			fetchAndSetData(getStatus, setStatus)

			const employeeList: Employee[] = await getEmployeeList(0, 0);
			setEmployees(employeeList);

			const subsidiariesData = await getSubsidiaries();
			setSubsidiaries(subsidiariesData);

			setIsLoading(false);
		}

		fetchData();
	},[])
	

	const openDialogEdit = useCallback((approval: Approval) => {
		setDataApproval(approval);
		setIsDialogEditOpen(true);
	}, []);

	const closeDialogEdit = useCallback(() => setIsDialogEditOpen(false), []);

	const habdleSearch = async () => {

		if (requestStart == null || requestEnd === null || closingStart == null || closingEnd == null) return; // || closingStartDate == null || closingEndDate === null

		const filterSelected: filterOptionsProps = {
			requestDateStart: requestStart,
			requestDateEnd: requestEnd,
			closingDateStart: closingStart,
			closingDateEnd: closingEnd,
			status: selectedStatus.map(option => option.value).join(','),
			employeeId: selectEmployee ? selectEmployee.id : 0,
			cdc: cdcSelected.map(Number)
		}

		console.log( filterSelected )
		const response = await getRequestList(filterSelected);

	};

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

	},[zonesSelected])

	return (
		<>
			<Box p={6} boxShadow="xl" borderRadius="lg" bg="white">

				{isLoading && <Loading />}

				<Heading>Solicitud de Ajuste de Caja / Lote Cerrado </Heading>

				<Grid
					templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
					gap={4}
					mb={4}
					w="100%"
					alignItems="end"
				>
					<ComboBoxCustom options={subsidiaries} label="Subsidiarias" onValueChange={setSubSelected} selectedValues={subSelected} disableCondition={false}></ComboBoxCustom>

					<ComboBoxCustom options={zones} label="Zonas" onValueChange={setZonesSelected} selectedValues={zonesSelected} disableCondition={false}></ComboBoxCustom>
					
					<ComboBoxCustom options={cdc} label="Centros de consumo" onValueChange={setCDCSelected} selectedValues={cdcSelected} disableCondition={false}></ComboBoxCustom>

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

					{renderMultiSelectWithControls(
						status,
						handleStatusChange,
						"Estatus",
						"Selecciona un estatus",
						selectedStatus,
						true
						)
					}

					<Button
						colorPalette="meraInfo"
						onClick={() => habdleSearch()}
					>
						Buscar
					</Button>

				</Grid>

				<TableApprovals openEditDialog={openDialogEdit} />

			</Box>

			<DetailApprovals isOpen={isDialogEditOpen} onClose={closeDialogEdit} />
		</>
	)
}

export default Approvals;