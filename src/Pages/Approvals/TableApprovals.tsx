import React, { memo, useEffect } from "react";
import { Badge, Table } from "@chakra-ui/react";
import { useApi } from "@hooks/useApi";
import { approvalsServices } from "@services/approvalsServices";
import { Approval, TableApprovalsProps } from "@models/approvals.model";
import { useApprovalsRolUser } from "@context/approvals/approvalsRolUserContext";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { Button } from "@components/ui/button";
import Loading from "@components/Loading";


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

    const handleSwitchChange = (data: Approval, status: number) => {
      const updatedDataEdit: Approval = { ...data, status: status };
      addOrUpdateApprovalList(updatedDataEdit);
    };

    return (
      <>

        {isLoading && <Loading />}

        <Table.ScrollArea rounded='md' paddingTop={'20px'} paddingBottom={'20px'}>
          <Table.Root variant="outline">

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
                      <Badge colorPalette={item.status === 2 ? "meraInfo" : item.status === 0 ? "meraError" : "meraSecondary"}>
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
                                onClick={() => handleSwitchChange(item, 1)}>
                                Aprobar
                              </Button>

                              <Button size='xs' colorPalette='red' variant="surface" rounded="full"
                                onClick={() => handleSwitchChange(item, 0)}>
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
