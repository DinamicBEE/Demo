import React, { useCallback, useState } from "react";
import { Box, Heading } from "@chakra-ui/react";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { Approval } from "@models/approvals.model";
import { TableApprovals } from "./TableApprovals";
import { DetailApprovals } from "./DetailApprovals";

const Approvals: React.FC = () => {

	const { setDataApproval } = useApprovalsList();
	const [isDialogEditOpen, setIsDialogEditOpen] = useState<boolean>(false);

	const openDialogEdit = useCallback((approval: Approval) => {
		console.log("modal detalles|")
		setDataApproval(approval);
		setIsDialogEditOpen(true);
	}, []);

	const closeDialogEdit = useCallback(() => setIsDialogEditOpen(false), []);

	return (
		<>
			<Box p={6} boxShadow="xl" borderRadius="lg" bg="white">

				<Heading>Solicitud de Ajuste de Caja / Lote Cerrado </Heading>

				<TableApprovals openEditDialog={openDialogEdit} />

			</Box>

			<DetailApprovals isOpen={isDialogEditOpen} onClose={closeDialogEdit} />
		</>
	)
}

export default Approvals;