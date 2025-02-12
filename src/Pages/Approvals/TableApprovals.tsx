import React, { useEffect } from "react";
import { Status, Table } from "@chakra-ui/react";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { useApi } from "@hooks/useApi";
import { approvalsServices } from "@services/approvalsServices";
import { Approval } from "@models/approvals.model";


export const TableApprovals: React.FC = () => {

  const { approvalsList, fectApprovals, addOrUpdateApprovalList, dataApproval } = useApprovalsList();
  const { data: fecthData, error } = useApi(approvalsServices.getListApprovals);

  //este se ejecuta cuando cargan los datos desde la peticion por primera vez.
  useEffect(() => {
    if (fecthData && approvalsList.length === 0) fectApprovals(fecthData);
  }, [fecthData, error]);

  //este se ejecuta cuando se agrega un cambio o se actualiza algun registro
  useEffect(() => {
    if (dataApproval.id) addOrUpdateApprovalList(dataApproval);
  }, [dataApproval]);

  const statusColors = {
    "Abierto": 'green',
    'Con diferencia': 'orange',
    'Cerrado': 'red',
    'Reabierto': 'blue'
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
              <Table.ColumnHeader textAlign={'center'}>Comentario del Supervisor</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              approvalsList.map((item: Approval) => (
                <Table.Row key={item.id}>

                  <Table.Cell textAlign={'center'}> {item.id} </Table.Cell>
                  <Table.Cell textAlign={'center'}> {item.date} </Table.Cell>
                  <Table.Cell textAlign={'center'}>

                    <Status.Root >
                      <Status.Indicator colorPalette={statusColors[item!.state as keyof typeof statusColors] || 'gray'} />
                      {item.state}
                    </Status.Root>

                  </Table.Cell>
                  <Table.Cell textAlign={'center'}> {item.typeRequest} </Table.Cell>
                  <Table.Cell textAlign={'center'}> {item.reasons} </Table.Cell>
                  <Table.Cell textAlign={'center'}> {item.comment} </Table.Cell>

                </Table.Row>
              ))
            }
          </Table.Body>

        </Table.Root>
      </Table.ScrollArea>
    </>
  );
}
