import { useCallback, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useApprovalContext } from "@context/approvals/approvalsListContext";
import { Approval } from "@models/approvals.model";
import { TableApprovals } from "./TableApprovals";
import { DetailApprovals } from "./DetailApprovals";
import Header from "./Header";
import { ROLES } from "@models/const/menu.consts";
import { APPROVALS_TYPE } from "@models/const/approvals.const";

function Approvals() {

	const { setDataApproval } = useApprovalContext();

	const [isDialogEditOpen, setIsDialogEditOpen] = useState<boolean>(false);

	const openDialogEdit = useCallback((approval: Approval) => {
		setDataApproval(approval);
		setIsDialogEditOpen(true);
	}, []);

	const closeDialogEdit = useCallback(() => setIsDialogEditOpen(false), []);

	return (
		<>
			<Box p={6} boxShadow="xl" borderRadius="lg" bg="white">

				<Header type={APPROVALS_TYPE.APPROVALS}/>
				
				<TableApprovals openEditDialog={openDialogEdit} role={ROLES.COMPTROLLER}/>

			</Box>

			<DetailApprovals isOpen={isDialogEditOpen} onClose={closeDialogEdit} />
		</>
	)
}

export default Approvals;