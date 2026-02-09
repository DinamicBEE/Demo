import { useCallback, useState } from "react";
import { Box, Button, Field, Grid, Heading } from "@chakra-ui/react";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { Approval, filterOptionsProps } from "@models/approvals.model";
import { TableApprovals } from "./TableApprovals";
import { DetailApprovals } from "./DetailApprovals";
import { getRequestList } from "@services/approvalsServices";
import DatePicker from "../LotClosure/components/DatePicker";

function Approvals() {

	const { setDataApproval } = useApprovalsList();
	const [isDialogEditOpen, setIsDialogEditOpen] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
        null,
        null,
    ]);
    const [startDate, endDate] = dateRange;

	const openDialogEdit = useCallback((approval: Approval) => {
		setDataApproval(approval);
		setIsDialogEditOpen(true);
	}, []);

	const closeDialogEdit = useCallback(() => setIsDialogEditOpen(false), []);

	const habdleSearch = useCallback( async () => {
		console.log(dateRange)
		if (startDate == null || endDate === null) return; // || closingStartDate == null || closingEndDate === null

		const filterSelected: filterOptionsProps = {
			requestDateStart: startDate,
			requestDateEnd: endDate,
			closingDateStart: new Date(), //closingStartDate,
			closingDateEnd: new Date()//closingEndDate
		}

		console.log( filterSelected )
		const response = await getRequestList(filterSelected);

	}, []);

	return (
		<>
			<Box p={6} boxShadow="xl" borderRadius="lg" bg="white">

				<Heading>Solicitud de Ajuste de Caja / Lote Cerrado </Heading>

				<Grid 
					templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
					gap={4}
					mb={4}
					w="100%"
					alignItems="end"
				>

                        <Field.Root>
                            <Field.Label>Rango de fechas</Field.Label>
                            <DatePicker
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(e) => {
									//console.log(e)
									setDateRange(e)
								}}
                            />
                        </Field.Root>

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