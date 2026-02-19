import { useCallback, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { Approval } from "@models/approvals.model";
import { TableApprovals } from "./TableApprovals";
import { DetailApprovals } from "./DetailApprovals";
import Header from "./Header";

function Approvals() {

	const { setDataApproval } = useApprovalsList();

	const [isDialogEditOpen, setIsDialogEditOpen] = useState<boolean>(false);

	const openDialogEdit = useCallback((approval: Approval) => {
		setDataApproval(approval);
		setIsDialogEditOpen(true);
	}, []);

	const closeDialogEdit = useCallback(() => setIsDialogEditOpen(false), []);

	return (
		<>
			<Box p={6} boxShadow="xl" borderRadius="lg" bg="white">

				<Header />
				
				<TableApprovals openEditDialog={openDialogEdit} />

			</Box>

			<DetailApprovals isOpen={isDialogEditOpen} onClose={closeDialogEdit} />
		</>
	)
}

export default Approvals;