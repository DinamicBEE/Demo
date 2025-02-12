import React, { useCallback, useState } from "react";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { TableApprovals } from "./TableApprovals";
import { RegisterApprovals } from "./RegisterApprovals";
import './Approvals.css';

const Approvals: React.FC = () => {

	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	const openDialog = useCallback(() => {
		setIsDialogOpen(true);
	}, [])

	const closeDialog = useCallback(() => {
		setIsDialogOpen(false);
	}, []);

	return (
		<>

			<Box p={6} boxShadow="xl" borderRadius="lg" bg="white">

				<Heading>Solicitud de Ajuste de Caja / Lote Cerrado </Heading>
				<Flex justifyContent='end'>

					<Flex width={'250px'}>
						<Button className='primary-button' onClick={() => openDialog()}>
							Agregar nueva Solicitud
						</Button>
					</Flex>

				</Flex>

				<TableApprovals />

			</Box>

			<RegisterApprovals onClose={closeDialog} isOpen={isDialogOpen} />
		</>
	)
}

export default Approvals;