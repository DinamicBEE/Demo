import React, { memo, useEffect, useState } from "react";
import { Badge, Table, useDisclosure, Button } from "@chakra-ui/react";
import { useApi } from "@hooks/useApi";
import { approvalsServices } from "@services/approvalsServices";
import { Approval, TableApprovalsProps } from "@models/approvals.model";
import { useApprovalsRolUser } from "@context/approvals/approvalsRolUserContext";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { ConfirmDialog } from "./components/ConfirmDialog";
import Loading from "@components/loading";


export const TableApprovals: React.FC<TableApprovalsProps> = memo(
  ({ openEditDialog }) => {

    const statusLabels: Record<number, string> = { 0: "Rechazado", 1: "Aprobado", 2: "En espera", };
    const { role } = useApprovalsRolUser()
    const { approvalsList, fectApprovals, addOrUpdateApprovalList, dataApproval } = useApprovalsList();
    const { data: fecthData, error, isLoading } = useApi(approvalsServices.getListApprovals);
    const { open, onOpen, onClose } = useDisclosure();
    const [confirmData, setConfirmData] = useState<{ item: Approval; newStatus: number } | null>(null);// Estado para el diálogo de confirmación
    const [message, setMessage] = useState<string>();

    //este se ejecuta cuando cargan los datos desde la peticion por primera vez.
    useEffect(() => {
      if (fecthData && approvalsList.length === 0) fectApprovals(fecthData);
    }, [fecthData, error]);

    //este se ejecuta cuando se agrega un registro nuevo o se actualiza algun registro.
    useEffect(() => {
      if (dataApproval.id) addOrUpdateApprovalList(dataApproval);
    }, [dataApproval]);


    const handleOpenConfirm = (item: Approval, newStatus: number) => {
      setConfirmData({ item, newStatus });
      setMessage(newStatus == 1 ? 'Aprovar' :  'Rechazar');
      onOpen();
    };

    // Manejo de la confirmación
    const handleConfirm = () => {
      if (confirmData) {
        addOrUpdateApprovalList({ ...confirmData.item, status: confirmData.newStatus });
        setConfirmData(null);
        onClose();
      }
    };
    
    return (
      <>
        <ConfirmDialog
          isOpen={open}
          onClose={onClose}
          onConfirm={handleConfirm}
          message={`¿Estás seguro de que deseas ${message}?`}
          title=""
        />

        {isLoading && <Loading />}

        <Table.ScrollArea rounded='md' paddingTop={'20px'} paddingBottom={'20px'}>
          <Table.Root variant="outline" striped>

            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader textAlign={'center'}>Solicitud</Table.ColumnHeader>
                <Table.ColumnHeader textAlign={'center'}>Fecha</Table.ColumnHeader>
                <Table.ColumnHeader textAlign={'center'}>Tipo de Solicitud</Table.ColumnHeader>
                <Table.ColumnHeader textAlign={'center'}>Motivo de Solicitud</Table.ColumnHeader>

                {role === 1 ?
                  <Table.ColumnHeader textAlign={'center'}>Comentario Cajero</Table.ColumnHeader>
                  :
                  <Table.ColumnHeader textAlign={'center'}>Comentario Supervisor</Table.ColumnHeader>
                }

                <Table.ColumnHeader textAlign={'center'}>Estatus</Table.ColumnHeader>

                {role === 1 && <Table.ColumnHeader textAlign={'center'}>Acciones</Table.ColumnHeader>}

              </Table.Row>
            </Table.Header>

            <Table.Body>
              {
                approvalsList.map((item: Approval) => (
                  <Table.Row key={item.id}>
                    <Table.Cell textAlign={'center'}> {item.id} </Table.Cell>
                    <Table.Cell textAlign={'center'}> {item.date} </Table.Cell>
                    <Table.Cell textAlign={'center'}> {item.typeRequest} </Table.Cell>
                    <Table.Cell textAlign={'center'}> {item.reasons} </Table.Cell>
                    <Table.Cell textAlign={'center'}> {role === 1 ? item.comment : item.commentSupervisor} </Table.Cell>

                    <Table.Cell textAlign={'center'}>
                      <Badge colorPalette={item.status === 2 ? "blue" : item.status === 0 ? "red" : "green"}>
                        {statusLabels[item.status]}
                      </Badge>
                    </Table.Cell>

                    {
                      role === 1 &&
                      <Table.Cell textAlign={'center'}>

                        {
                          item.status === 2 &&
                          (
                            <>
                              <Button size='xs' colorPalette='green' variant="surface" rounded="full" marginRight='5px'
                                onClick={() => handleOpenConfirm(item, 1)}>
                                Aprobar
                              </Button>

                              <Button size='xs' colorPalette='red' variant="surface" rounded="full"
                                onClick={() => handleOpenConfirm(item, 0)}>
                                Rechazar
                              </Button>
                            </>
                          )
                        }

                        <Button marginLeft='10px' size='xs' variant="surface" colorPalette='gray' rounded="full"
                          onClick={() => openEditDialog(item)}>
                          Detalle
                        </Button>

                      </Table.Cell>
                    }

                  </Table.Row>
                ))
              }
            </Table.Body>

          </Table.Root>
        </Table.ScrollArea>
      </>
    );

  }
);
