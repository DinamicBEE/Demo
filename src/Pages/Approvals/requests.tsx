import React, { useCallback, useState } from "react";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useApprovalContext } from "@context/approvals/approvalsListContext";
import { Approval } from "@models/approvals.model";
import { TableApprovals } from "./TableApprovals";
import { RegisterApprovals } from "./RegisterApprovals";
import { DetailApprovals } from "./DetailApprovals";
import Header from "./Header";

const Approvals: React.FC = () => {

	//const { setDataApproval } = useApprovalContext();
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [isDialogEditOpen, setIsDialogEditOpen] = useState<boolean>(false);

	const openDialog = useCallback(() => setIsDialogOpen(true), []);

	const closeDialog = useCallback(() => setIsDialogOpen(false), []);

	const openDialogEdit = useCallback((approval: Approval) => {
		//setDataApproval(approval);
		setIsDialogEditOpen(true);
	}, []);

	const closeDialogEdit = useCallback(() => setIsDialogEditOpen(false), []);

	return (
		<>
			<Box p={6} boxShadow="xl" borderRadius="lg" bg="white">

				<Header />

				<Flex justifyContent='end'>

					<Flex width={'250px'}>
						<Button colorPalette="meraPrimary" onClick={() => openDialog()}>
							Agregar nueva Solicitud
						</Button>
					</Flex>

				</Flex>

				<TableApprovals openEditDialog={openDialogEdit} />

			</Box>

			<RegisterApprovals isOpen={isDialogOpen} onClose={closeDialog} />

			<DetailApprovals isOpen={isDialogEditOpen} onClose={closeDialogEdit} />
			
		</>
	)
}

export default Approvals;