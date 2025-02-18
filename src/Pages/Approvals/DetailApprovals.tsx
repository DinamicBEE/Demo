import React, { memo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { DataList, DialogActionTrigger, DialogTitle, List, Textarea, VStack } from "@chakra-ui/react";
import { DialogContent, DialogRoot, DialogCloseTrigger, DialogHeader, DialogFooter, DialogBody } from "@components/ui/dialog";
import { Field } from "@components/ui/field";
import { Button } from "@components/ui/button";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { Approval, EditRequestForm, DetailApprovalsProps } from "@models/approvals.model";
import { approvalsServices } from "@services/approvalsServices";
import { useApi } from "@hooks/useApi";
import Loading from "@components/loading";


export const DetailApprovals: React.FC<DetailApprovalsProps> = memo(({ isOpen, onClose }) => {

  const { addOrUpdateApprovalList, dataApproval } = useApprovalsList();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditRequestForm>();

  const { data: fetchDataApproval, error, isLoading } = useApi(
    () => dataApproval.id ? approvalsServices.getRequestApproval(dataApproval.id) : Promise.resolve(undefined),
    {
      autoFetch: Boolean(dataApproval.id),
      dependencies: [dataApproval.id]
    }
  );

  const onSubmitForm: SubmitHandler<EditRequestForm> = (data: EditRequestForm) => {

    const updatedDataEdit: Approval = { ...dataApproval, commentSupervisor: data.comment };

    addOrUpdateApprovalList(updatedDataEdit);
    reset();
    onClose();
  };

  return (
    <>

      {isLoading ? <Loading /> :

        <VStack alignItems='start'>
          <DialogRoot scrollBehavior="inside" size="lg" open={isOpen} onOpenChange={() => onClose()} closeOnEscape={false} closeOnInteractOutside={false}>

            <DialogContent>

              {fetchDataApproval == undefined ?
                'No se encontro el registro'
                :
                <form onSubmit={handleSubmit(onSubmitForm)}>

                  <DialogCloseTrigger />

                  <DialogHeader>
                    <DialogTitle> Editar estatus de solicitud de Ajuste de Caja / Lote Cerrado </DialogTitle>
                  </DialogHeader>

                  <DialogBody pb='8'>

                    <DataList.Root orientation='horizontal'>

                      <DataList.Item>
                        <DataList.ItemLabel>Fecha</DataList.ItemLabel>
                        <DataList.ItemValue>{fetchDataApproval.date}</DataList.ItemValue>
                      </DataList.Item>

                      <DataList.Item>
                        <DataList.ItemLabel>Estado</DataList.ItemLabel>
                        <DataList.ItemValue>{fetchDataApproval.state}</DataList.ItemValue>
                      </DataList.Item>

                      <DataList.Item>
                        <DataList.ItemLabel>Tipo de Solicitud</DataList.ItemLabel>
                        <DataList.ItemValue>{fetchDataApproval.typeRequest}</DataList.ItemValue>
                      </DataList.Item>

                      <DataList.Item>
                        <DataList.ItemLabel>Motivo de Solicitud</DataList.ItemLabel>
                        <DataList.ItemValue>{fetchDataApproval.reasons}</DataList.ItemValue>
                      </DataList.Item>

                      <DataList.Item>
                        <DataList.ItemLabel>Comentario</DataList.ItemLabel>
                        <DataList.ItemValue>
                          <List.Root>
                            <List.Item>{fetchDataApproval.comment}</List.Item>
                          </List.Root>
                        </DataList.ItemValue>
                      </DataList.Item>

                    </DataList.Root>

                    <Field label='Agregar comentario' paddingTop='20px'>
                      <Textarea {...register('comment', { required: 'Este campo es requerido' })} />
                      {errors.comment && <small className="text-red-600">{errors.comment?.message}</small>}
                    </Field>

                  </DialogBody>

                  <DialogFooter>
                    <DialogActionTrigger asChild>
                      <Button rounded='full' size='sm'>Cancelar</Button>
                    </DialogActionTrigger>
                    <Button type="submit" colorPalette="green" size='sm' rounded='full'>Guardar</Button>
                  </DialogFooter>

                </form>
              }

            </DialogContent>
          </DialogRoot>
        </VStack>

      }
    </>
  );

});