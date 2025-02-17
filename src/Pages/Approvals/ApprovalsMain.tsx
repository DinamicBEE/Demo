import React, { useCallback, useState } from "react";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { TableApprovals } from "./TableApprovals";
import { RegisterApprovals } from "./RegisterApprovals";
import { useApprovalsRolUser } from "@context/approvals/approvalsRolUserContext";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { Approval } from "@models/approvals.model";
import { EditStatusApprovals } from "./EditStatusApprovals";
import './Approvals.css';

const Approvals: React.FC = () => {

	const { role, switchRole } = useApprovalsRolUser();
	const { setDataApproval } = useApprovalsList();
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const [isDialogEditOpen, setIsDialogEditOpen] = useState<boolean>(false);


	const openDialog = useCallback(() => setIsDialogOpen(true), []);

	const closeDialog = useCallback(() => setIsDialogOpen(false), []);

	const openDialogEdit = useCallback((approval: Approval) => {
		setDataApproval(approval);
		setIsDialogEditOpen(true);
	}, []);

	const closeDialogEdit = useCallback(() => setIsDialogEditOpen(false), []);

	return (
		<>
			{/* Esta parte del codigo es de solo uso demostrativo para manejar los tipos de usuario. */}
			<Flex justifyContent='end' paddingBottom={'10px'}>
				<Flex width={'250px'}>
					<Button onClick={switchRole}>
						Cambiar a {role === "cajero" ? "supervisor" : "cajero"}
					</Button>
				</Flex>
			</Flex>

			<Box p={6} boxShadow="xl" borderRadius="lg" bg="white">

				<Heading>Solicitud de Ajuste de Caja / Lote Cerrado </Heading>

				{role == 'cajero' &&
					<Flex justifyContent='end'>

						<Flex width={'250px'}>
							<Button className='primary-button' onClick={() => openDialog()}>
								Agregar nueva Solicitud
							</Button>
						</Flex>

					</Flex>
				}

				<TableApprovals openEditDialog={openDialogEdit} />

			</Box>

			<RegisterApprovals isOpen={isDialogOpen} onClose={closeDialog} />

			<EditStatusApprovals isOpen={isDialogEditOpen} onClose={closeDialogEdit} />
		</>
	)
}

export default Approvals;