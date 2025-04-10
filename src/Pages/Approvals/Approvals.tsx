import React, { useCallback, useState } from "react";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useApprovalsRolUser } from "@context/approvals/approvalsRolUserContext";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { Approval } from "@models/approvals.model";
import { TableApprovals } from "./TableApprovals";
import { RegisterApprovals } from "./RegisterApprovals";
import { DetailApprovals } from "./DetailApprovals";
import './Approvals.css';

const Approvals: React.FC = () => {

	const { role } = useApprovalsRolUser();
	const { setDataApproval } = useApprovalsList();
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [isDialogEditOpen, setIsDialogEditOpen] = useState<boolean>(false);

	const openDialog = useCallback(() => setIsDialogOpen(true), []);

	const closeDialog = useCallback(() => setIsDialogOpen(false), []);

	const openDialogEdit = useCallback((approval: Approval) => {
		//seteamos el valor global de approbal para que el componente de Edit pueda tomar el registro.
		setDataApproval(approval);
		setIsDialogEditOpen(true);
	}, []);

	const closeDialogEdit = useCallback(() => setIsDialogEditOpen(false), []);

	return (
		<>
			<Box p={6} boxShadow="xl" borderRadius="lg" bg="white">

				<Heading>Solicitud de Ajuste de Caja / Lote Cerrado </Heading>

				{role == "user" &&
					<Flex justifyContent='end'>

						<Flex width={'250px'}>
							<Button colorPalette="meraPrimary" onClick={() => openDialog()}>
								Agregar nueva Solicitud
							</Button>
						</Flex>

					</Flex>
				}

				<TableApprovals openEditDialog={openDialogEdit} />

			</Box>

			<RegisterApprovals isOpen={isDialogOpen} onClose={closeDialog} />

			<DetailApprovals isOpen={isDialogEditOpen} onClose={closeDialogEdit} />
		</>
	)
}

export default Approvals;