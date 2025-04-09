import React, { memo, useEffect, useState } from "react";
import { Badge, Table, useDisclosure } from "@chakra-ui/react";
import { useApi } from "@hooks/useApi";
import { approvalsServices } from "@services/approvalsServices";
import { Approval, TableApprovalsProps } from "@models/approvals.model";
import { useApprovalsRolUser } from "@context/approvals/approvalsRolUserContext";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { Button } from "@components/ui/button";
import { ConfirmDialog } from "./components/ConfirmDialog";
import Loading from "@components/loading";


export const TableApprovals: React.FC<TableApprovalsProps> = memo(({ openEditDialog }) => {

  const statusLabels: Record<number, string> = { 1: "Rechazado", 2: "Aprobado", 3: "En espera", };
  const typeRequestLabel: Record<string, string> = { "CASH_CLOSURE": 'Corte de Caja', 'LOTE': 'Corte de Lote' }

  const [confirmData, setConfirmData] = useState<{ item: Approval; newStatus: number } | null>(null);// Estado para el diálogo de confirmación
  const [message, setMessage] = useState<string>();

  const { role } = useApprovalsRolUser()
  const { open, onOpen, onClose } = useDisclosure();
  const { approvalsList, fectApprovals, dataApproval } = useApprovalsList();
  const { data: fecthData, error, isLoading } = useApi(approvalsServices.getListApprovalsUser);

  // //este se ejecuta cuando cargan los datos desde la peticion por primera vez.
  useEffect(() => {
    if (fecthData && approvalsList.length === 0) fectApprovals(fecthData);
  }, [fecthData, error]);

  // //este se ejecuta cuando se agrega un registro nuevo o se actualiza algun registro.
  // useEffect(() => {
  //   if (dataApproval.id) addOrUpdateApprovalList(dataApproval);
  // }, [dataApproval]);

  const handleOpenConfirm = (item: Approval, newStatus: number) => {
    setConfirmData({ item, newStatus });
    setMessage(newStatus == 1 ? 'Aprobar' : 'Rechazar');
    onOpen();
  };

  // Manejo de la confirmación
  const handleConfirm = () => {
    if (confirmData) {
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
        title={message === "Aprobar" ? "Confirmar aprobación" : "Confirmar rechazo"}
      />

      {isLoading && <Loading />}

      <Table.ScrollArea rounded='md' paddingTop={'20px'} paddingBottom={'20px'}>
        <Table.Root variant="outline">

          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader textAlign={'center'}>Solicitud</Table.ColumnHeader>
              <Table.ColumnHeader textAlign={'center'}>Fecha</Table.ColumnHeader>
              <Table.ColumnHeader textAlign={'center'}>Tipo de Solicitud</Table.ColumnHeader>
              <Table.ColumnHeader textAlign={'center'}>Motivo de Solicitud</Table.ColumnHeader>

              {role === 'admin' ?
                <Table.ColumnHeader textAlign={'center'}>Comentario Cajero</Table.ColumnHeader>
                :
                <Table.ColumnHeader textAlign={'center'}>Comentario Supervisor</Table.ColumnHeader>
              }

              <Table.ColumnHeader textAlign={'center'}>Estatus</Table.ColumnHeader>

              {role === 'admin' && <Table.ColumnHeader textAlign={'center'}>Acciones</Table.ColumnHeader>}

            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              approvalsList.map((item: Approval) => (
                <Table.Row key={item.idRequest}>
                  <Table.Cell textAlign={'center'}> {item.idRequest} </Table.Cell>
                  <Table.Cell textAlign={'center'}> {item.date} </Table.Cell>
                  <Table.Cell textAlign={'center'}> {typeRequestLabel[item.typeRequest]} </Table.Cell>
                  <Table.Cell textAlign={'center'}> {item.reason} </Table.Cell>
                  <Table.Cell textAlign={'center'}> {role === 'admin' ? item.comment : item.commentSupervisor} </Table.Cell>

                  <Table.Cell textAlign={'center'}>
                    <Badge colorPalette={item.status === 3 ? "meraInfo" : item.status === 0 ? "meraError" : "meraSecondary"}>
                      {statusLabels[item.status]}
                    </Badge>
                  </Table.Cell>

                  {
                    role === 'admin' &&
                    <Table.Cell textAlign={'center'}>

                      {
                        item.status === 3 &&
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

});
