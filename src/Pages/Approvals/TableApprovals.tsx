import React, { memo } from "react";
import { Badge, Table, Text, useDisclosure } from "@chakra-ui/react";
import { Toaster, toaster } from "@components/ui/toaster";
import { Button } from "@components/ui/button";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { approvalsServices } from "@services/approvalsServices";
import { useApprovalContext } from "@context/approvals/approvalsListContext";
import { Approval, RequestUpdateDetails, TableApprovalsProps } from "@models/approvals.model";
import { useApi } from "@hooks/useApi";
import { ROLES, ROLES_APPROVALS } from "@models/const/menu.consts";
import { formatToDDMMYYYYstring } from "@utils/dateFormatter";
import { SortableHeader } from "@utils/table";
import useSortableTable from "@hooks/useSortableTable/useSortableTable";
import { REQUEST_TYPE, STATUSLABELS } from "@models/const/approvals.const";


export const TableApprovals: React.FC<TableApprovalsProps> = memo(({ openEditDialog, role }) => {

  const { open, onOpen, onClose } = useDisclosure();
  const { approvalsList, triggerRefresh } = useApprovalContext();
  
  const { sortedData, handleSort, getSortIcon } = useSortableTable<Approval>(approvalsList);

  const [confirmData, setConfirmData] = React.useState<{ item: Approval; newStatus: boolean } | null>(null);
  const [message, setMessage] = React.useState<string>();
  
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

      {/* {isLoading && <Loading />} */}

      <Table.ScrollArea rounded='md' paddingTop={'20px'} paddingBottom={'20px'}>
        <Table.Root variant="outline">
          <Table.Header>
            <Table.Row>
              {ROLES_APPROVALS.includes(role as ROLES || '') && <Table.ColumnHeader textAlign="center">Acciones</Table.ColumnHeader>}

              <SortableHeader columnKey="zone" label="Zona" handleSort={handleSort} getSortIcon={getSortIcon} />
              <SortableHeader columnKey="cdc" label="Centro de consumo" handleSort={handleSort} getSortIcon={getSortIcon} />
              <SortableHeader columnKey="closingEmployee" label="Empleado Corte" handleSort={handleSort} getSortIcon={getSortIcon} />

              <SortableHeader columnKey="status" label="Estatus" handleSort={handleSort} getSortIcon={getSortIcon} />
              <SortableHeader columnKey="date" label="Fecha solicitud" handleSort={handleSort} getSortIcon={getSortIcon} />
              <SortableHeader columnKey="idRequest" label="Solicitud" handleSort={handleSort} getSortIcon={getSortIcon} />
              <SortableHeader columnKey="employee" label="Empleado solicitante" handleSort={handleSort} getSortIcon={getSortIcon} />
              <SortableHeader columnKey="dateCdc" label="Fecha corte" handleSort={handleSort} getSortIcon={getSortIcon} />
              <SortableHeader columnKey="typeRequest" label="Tipo de Solicitud" handleSort={handleSort} getSortIcon={getSortIcon} />
              <SortableHeader columnKey="reason" label="Motivo de Solicitud" handleSort={handleSort} getSortIcon={getSortIcon} />
              <SortableHeader columnKey={ROLES_APPROVALS.includes(role as ROLES || '') ? "comment" : "commentSupervisor"} label={ROLES_APPROVALS.includes(role as ROLES || '') ? "Comentario Cajero" : "Comentario Supervisor"} handleSort={handleSort} getSortIcon={getSortIcon} />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {sortedData.map((item: Approval) => (
              <Table.Row key={item.idRequest}>
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
                          //loading={isLoading}
                        >
                          Aprobar
                        </Button>
                        <Button
                          size='xs'
                          colorPalette='red'
                          variant="surface"
                          rounded="full"
                          onClick={() => handleOpenConfirm(item, false)}
                          //loading={isLoading}
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
                
                <Table.Cell textAlign="center">{item.zone}</Table.Cell>
                <Table.Cell textAlign="center">{item.cdc}</Table.Cell>
                <Table.Cell textAlign="center">{item.closingEmployee}</Table.Cell>

                <Table.Cell textAlign="center">
                  <Badge colorPalette={item.status === 3 ? "meraInfo" : item.status === 1 ? "meraError" : "meraSecondary"}>
                    {STATUSLABELS.find((status) => status.id === item.status)?.label}
                  </Badge>
                </Table.Cell>
                <Table.Cell textAlign="center">{formatToDDMMYYYYstring(item.date)}</Table.Cell>
                <Table.Cell textAlign="center">{item.idRequest}</Table.Cell>
                <Table.Cell textAlign="center">{item.employee}</Table.Cell>
                <Table.Cell textAlign="center">{formatToDDMMYYYYstring(item.dateCdc)}</Table.Cell>
                <Table.Cell textAlign="center">{REQUEST_TYPE.find(type => type.key === item.typeRequest)?.label}</Table.Cell>
                <Table.Cell textAlign="center">{item.reason}</Table.Cell>
                
                <Table.Cell textAlign="center"><Text w={"250px"} lineClamp="3">{ROLES_APPROVALS.includes(role as ROLES || '') ? item.comment : item.commentSupervisor}</Text></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </>
  );
});