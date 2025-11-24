import React, { memo } from "react";
import { Badge, Table, useDisclosure } from "@chakra-ui/react";
import { Toaster, toaster } from "@components/ui/toaster";
import { Button } from "@components/ui/button";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { approvalsServices } from "@services/approvalsServices";
import { useApprovalsRolUser } from "@context/approvals/approvalsRolUserContext";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { Approval, RequestUpdateDetails, TableApprovalsProps } from "@models/approvals.model";
import { useApi } from "@hooks/useApi";
import Loading from "@components/Loading";
import { ROLES, ROLES_APPROVALS } from "@models/const/menu.consts";
import { formatToDDMMYYYYstring } from "@utils/dateFormatter";


export const TableApprovals: React.FC<TableApprovalsProps> = memo(({ openEditDialog }) => {

  const statusLabels: Record<number, string> = { 1: "Rechazado", 2: "Aprobado", 3: "En espera" };
  const typeRequestLabel: Record<string, string> = { "CASH_CLOSURE": 'Corte de Caja', 'LOTE': 'Cierre de Lote' };

  const [confirmData, setConfirmData] = React.useState<{ item: Approval; newStatus: boolean } | null>(null);
  const [message, setMessage] = React.useState<string>();

  const { role } = useApprovalsRolUser();
  const { open, onOpen, onClose } = useDisclosure();
  const { approvalsList, fectApprovals, shouldRefetch, triggerRefresh } = useApprovalsList();

  const { isLoading } = useApi(approvalsServices.getListApprovalsUser, {
    dependencies: [shouldRefetch],
    onSuccess: (data) => {
      fectApprovals(data);
    }
  });

  const { refetch, isLoading: isLoadingEdit } = useApi(
    () => {
      const dataEdit: RequestUpdateDetails = {
        idRequest: confirmData?.item.idRequest || 0,
        idCashLote: confirmData?.item.idCashBatch || 0,
        typeRequest: confirmData?.item.typeRequest || '',
        comment: '', // comentario del supervisor.
        status: confirmData?.newStatus || false
      };
      return approvalsServices.updateStatusRequest(dataEdit)
    },
    {
      autoFetch: false,
      onSuccess: (data) => {

        toaster.create({ title: `Se actualizo los datos correctamente`, type: 'success' });

        setConfirmData(null);
        onClose();
        triggerRefresh();

      },
      onError: (error) => {

       
        toaster.create({ title: `No se actualizo los datos correctamente`, type: 'error' });

        setConfirmData(null);
        onClose();
      }
    }
  );

  const handleOpenConfirm = (item: Approval, newStatus: boolean) => {
    setConfirmData({ item, newStatus });
    setMessage(newStatus ? "Aprobar" : "Rechazar");
    onOpen();
  };

  const handleConfirm = () => refetch();

  return (
    <>
      <Toaster />

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
              <Table.ColumnHeader textAlign="center">Solicitud</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Empleado</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Fecha</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Tipo de Solicitud</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Motivo de Solicitud</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">{ROLES_APPROVALS.includes(role as ROLES || '') ? "Comentario Cajero" : "Comentario Supervisor"}</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Estatus</Table.ColumnHeader>
              {ROLES_APPROVALS.includes(role as ROLES || '') && <Table.ColumnHeader textAlign="center">Acciones</Table.ColumnHeader>}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {approvalsList.map((item: Approval) => (
              <Table.Row key={item.idRequest}>
                <Table.Cell textAlign="center">{item.idRequest}</Table.Cell>
                <Table.Cell textAlign="center">{item.employee}</Table.Cell>
                <Table.Cell textAlign="center">{formatToDDMMYYYYstring(item.date)}</Table.Cell>
                <Table.Cell textAlign="center">{typeRequestLabel[item.typeRequest]}</Table.Cell>
                <Table.Cell textAlign="center">{item.reason}</Table.Cell>
                <Table.Cell textAlign="center">{ROLES_APPROVALS.includes(role as ROLES || '') ? item.comment : item.commentSupervisor}</Table.Cell>
                <Table.Cell textAlign="center">
                  <Badge colorPalette={item.status === 3 ? "meraInfo" : item.status === 1 ? "meraError" : "meraSecondary"}>
                    {statusLabels[item.status]}
                  </Badge>
                </Table.Cell>
                {ROLES_APPROVALS.includes(role as ROLES || '') && (
                  <Table.Cell textAlign="center">
                    {item.status === 3 && (
                      <>
                        <Button
                          size='xs'
                          colorPalette='green'
                          variant="surface"
                          rounded="full"
                          marginRight='5px'
                          onClick={() => handleOpenConfirm(item, true)}
                          loading={isLoading}
                        >
                          Aprobar
                        </Button>
                        <Button
                          size='xs'
                          colorPalette='red'
                          variant="surface"
                          rounded="full"
                          onClick={() => handleOpenConfirm(item, false)}
                          loading={isLoading}
                        >
                          Rechazar
                        </Button>
                      </>
                    )}
                    <Button marginLeft='10px' size='xs' variant="surface" colorPalette='gray' rounded="full" onClick={() => openEditDialog(item)}>
                      Detalle
                    </Button>
                  </Table.Cell>
                )}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </>
  );
});