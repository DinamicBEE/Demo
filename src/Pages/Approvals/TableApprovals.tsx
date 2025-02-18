import React, { memo, useEffect } from "react";
import { Table } from "@chakra-ui/react";
import { useApi } from "@hooks/useApi";
import { approvalsServices } from "@services/approvalsServices";
import { Approval, TableApprovalsProps } from "@models/approvals.model";
import { useApprovalsRolUser } from "@context/approvals/approvalsRolUserContext";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { Button } from "@components/ui/button";
import Loading from "@components/loading";


export const TableApprovals: React.FC<TableApprovalsProps> = memo(
  ({ openEditDialog }) => {

    const { role } = useApprovalsRolUser()
    const { approvalsList, fectApprovals, addOrUpdateApprovalList, dataApproval } = useApprovalsList();
    const { data: fecthData, error, isLoading } = useApi(approvalsServices.getListApprovals);

    const statusLabels: Record<number, string> = {
      0: "Rechazado",
      1: "Aprobado",
      2: "En espera",
    };

    //este se ejecuta cuando cargan los datos desde la peticion por primera vez.
    useEffect(() => {
      if (fecthData && approvalsList.length === 0) fectApprovals(fecthData);
    }, [fecthData, error]);

    //este se ejecuta cuando se agrega un registro nuevo o se actualiza algun registro.
    useEffect(() => {
      if (dataApproval.id) addOrUpdateApprovalList(dataApproval);
    }, [dataApproval]);

    const handleSwitchChange = (data: Approval) => {
      const updatedDataEdit: Approval = { ...data, status: data.status ? 0 : 1 };
      addOrUpdateApprovalList(updatedDataEdit);
    };

    return (
      <>

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

                    <Table.Cell textAlign={'center'}>  {statusLabels[item.status]} </Table.Cell>

                    {role === 1 &&
                      <Table.Cell textAlign={'center'}>

                        <Button size='xs' variant="surface" rounded="full"
                          onClick={() => handleSwitchChange(item)}
                          colorPalette={item.status === 2 ? "grey" : item.status === 0 ? "green" : "red"}>
                          
                          {item.status === 2 ? "Procesar" : item.status === 0 ? "Aprobar" : "Rechazar"}

                        </Button>

                        <Button marginLeft='10px' size='xs' variant="surface" colorPalette='gray' rounded="full" onClick={() => openEditDialog(item)}>
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
