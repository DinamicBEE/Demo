import React, { useEffect } from "react";
import { Status, Table } from "@chakra-ui/react";
import { useApi } from "@hooks/useApi";
import { approvalsServices } from "@services/approvalsServices";
import { Approval, StateApprovalsProps, TableApprovalsProps } from "@models/approvals.model";
import { useApprovalsRolUser } from "@context/approvals/approvalsRolUserContext";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { Button } from "@components/ui/button";


export const TableApprovals: React.FC<TableApprovalsProps> = ({ openEditDialog }) => {

  const { role } = useApprovalsRolUser()
  const { approvalsList, fectApprovals, addOrUpdateApprovalList, dataApproval } = useApprovalsList();
  const { data: fecthData, error } = useApi(approvalsServices.getListApprovals);

  //este se ejecuta cuando cargan los datos desde la peticion por primera vez.
  useEffect(() => {
    if (fecthData && approvalsList.length === 0) fectApprovals(fecthData);
  }, [fecthData, error]);

  //este se ejecuta cuando se agrega un cambio o se actualiza algun registro, y actualiza la tabla.
  useEffect(() => {
    if (dataApproval.id) addOrUpdateApprovalList(dataApproval);
  }, [dataApproval]);

  const handleSwitchChange = (data: Approval) => {
    const updatedDataEdit: Approval = { ...data, status: data.status ? false : true };

    addOrUpdateApprovalList(updatedDataEdit)
  };

  return (
    <>
      <Table.ScrollArea rounded='md' paddingTop={'20px'} paddingBottom={'20px'}>
        <Table.Root variant="outline" striped>

          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader textAlign={'center'}>Solicitud</Table.ColumnHeader>
              <Table.ColumnHeader textAlign={'center'}>Fecha</Table.ColumnHeader>
              <Table.ColumnHeader textAlign={'center'}>Estado</Table.ColumnHeader>
              <Table.ColumnHeader textAlign={'center'}>Tipo de Solicitud</Table.ColumnHeader>
              <Table.ColumnHeader textAlign={'center'}>Motivo de Solicitud</Table.ColumnHeader>

              {role === 'supervisor' ?
                <Table.ColumnHeader textAlign={'center'}>Comentario Cajero</Table.ColumnHeader>
                :
                <Table.ColumnHeader textAlign={'center'}>Comentario Supervisor</Table.ColumnHeader>
              }

              {role === 'supervisor' && <Table.ColumnHeader textAlign={'center'}>Acciones</Table.ColumnHeader>}

            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              approvalsList.map((item: Approval) => (
                <Table.Row key={item.id}>
                  <Table.Cell textAlign={'center'}> {item.id} </Table.Cell>
                  <Table.Cell textAlign={'center'}> {item.date} </Table.Cell>
                  <Table.Cell textAlign={'center'}> <StateApprovals state={item.state} />  </Table.Cell>
                  <Table.Cell textAlign={'center'}> {item.typeRequest} </Table.Cell>
                  <Table.Cell textAlign={'center'}> {item.reasons} </Table.Cell>
                  <Table.Cell textAlign={'center'}> {role === 'supervisor' ? item.comment : item.commentSupervisor} </Table.Cell>

                  {role === 'supervisor' &&
                    <Table.Cell textAlign={'center'}>
                      <Button marginLeft='10px' size='xs' variant="surface" colorPalette='gray' rounded="full" onClick={() => openEditDialog(item)}>
                        Editar Estatus
                      </Button>

                      <Button marginLeft='10px' size='xs' variant="surface" colorPalette={item.status ? 'red' : 'green'} rounded="full" onClick={() => handleSwitchChange(item)}>
                        {item.status ? 'Rechazar' : 'Aprobar'}
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

const StateApprovals: React.FC<StateApprovalsProps> = ({ state }) => {

  const statusColors = {
    "Abierto": 'green',
    'Con diferencia': 'orange',
    'Cerrado': 'red',
    'Reabierto': 'blue'
  };
  return (
    <Status.Root >
      <Status.Indicator colorPalette={statusColors[state as keyof typeof statusColors] || 'gray'} />
      {state}
    </Status.Root>
  )
}