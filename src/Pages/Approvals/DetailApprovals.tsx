import React, { memo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { DataList, DialogActionTrigger, DialogTitle, List, Textarea, VStack, Text, Spinner, Flex } from "@chakra-ui/react";
import { DialogContent, DialogRoot, DialogCloseTrigger, DialogHeader, DialogFooter, DialogBody } from "@components/ui/dialog";
import { Field } from "@components/ui/field";
import { Button } from "@components/ui/button";
import { Switch } from "@components/ui/switch";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { Approval, EditRequestForm, DetailApprovalsProps } from "@models/approvals.model";
import { approvalsServices } from "@services/approvalsServices";
import { useApi } from "@hooks/useApi";
import Loading from "@components/loading";
import { HiCheck, HiX } from "react-icons/hi";
import { Toaster, toaster } from "@components/ui/toaster";


export const DetailApprovals: React.FC<DetailApprovalsProps> = memo(({ isOpen, onClose }) => {

  const { addOrUpdateApprovalList, dataApproval } = useApprovalsList();
  const { register, handleSubmit, reset, formState: { errors }, getValues, setValue } = useForm<EditRequestForm>();
  const [checked, setChecked] = useState<boolean>(false);

  const { data: fetchDataApproval, error, isLoading } = useApi(
    () => dataApproval.id ? approvalsServices.getRequestApproval(dataApproval.id) : Promise.resolve(undefined),
    {
      autoFetch: Boolean(dataApproval.id),
      dependencies: [dataApproval.id]
    }
  );

  const { refetch, isLoading: isLoadingEdit } = useApi(

    () => {

      const data = getValues();

      const dataEdit: Approval = {
        id: dataApproval.id,
        date: dataApproval.date,
        state: dataApproval.state,
        typeRequest: dataApproval.typeRequest,
        reasons: dataApproval.reasons,
        comment: dataApproval.comment,
        commentSupervisor: data.comment,
        status: (checked ? 1 : 0)
      };

      return approvalsServices.updateStatusRequest(dataEdit);
    },
    {
      autoFetch: false,
      onSuccess: (data) => {

        const updatedDataEdit: Approval = {
          ...dataApproval,
          commentSupervisor: data.commentSupervisor,
          status: data.status
        };

        toaster.create({
          title: `Se actualizo los datos correctamente`,
          type: 'success',
         
        })

        setTimeout(() => {
          addOrUpdateApprovalList(updatedDataEdit);
          reset();
          onClose();
        }, 1000);

      },
      onError: (error) => {
        console.log(error);
      }
    }

  );

  const onSubmitForm: SubmitHandler<EditRequestForm> = async () => refetch();

  return (
    <>

      {isLoading ? <Loading /> :

        <VStack alignItems='start'>
          <DialogRoot scrollBehavior="inside" size="lg" open={isOpen} onOpenChange={() => onClose()} closeOnEscape={false} closeOnInteractOutside={false}>

            <DialogContent>

              <form onSubmit={handleSubmit(onSubmitForm)}>

                <DialogCloseTrigger />

                <DialogHeader>
                  <DialogTitle> Editar estatus de solicitud de Ajuste de Caja / Lote Cerrado </DialogTitle>
                </DialogHeader>


                <DialogBody pb='8'>

                  <DataList.Root orientation='horizontal'>

                    <DataList.Item>
                      <DataList.ItemLabel>Fecha</DataList.ItemLabel>
                      <DataList.ItemValue>{dataApproval.date}</DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.ItemLabel>Estado</DataList.ItemLabel>
                      <DataList.ItemValue>{dataApproval.state}</DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.ItemLabel>Tipo de Solicitud</DataList.ItemLabel>
                      <DataList.ItemValue>{dataApproval.typeRequest}</DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.ItemLabel>Motivo de Solicitud</DataList.ItemLabel>
                      <DataList.ItemValue>{dataApproval.reasons}</DataList.ItemValue>
                    </DataList.Item>

                    <DataList.Item>
                      <DataList.ItemLabel>Comentario</DataList.ItemLabel>
                      <DataList.ItemValue>
                        <List.Root>
                          <List.Item>{dataApproval.comment}</List.Item>
                        </List.Root>
                      </DataList.ItemValue>
                    </DataList.Item>

                  </DataList.Root>

                  <Field label='Agregar comentario' paddingTop='25px'>
                    <Textarea {...register('comment', { required: 'Este campo es requerido' })} />
                    {errors.comment && <Text color="red" textStyle='xs'>{errors.comment?.message}</Text>}
                  </Field>

                  {
                    dataApproval.status === 2 &&
                    (
                      <Flex justifyContent='start' paddingTop='20px'>
                        <Switch size='lg' colorPalette='green'
                          thumbLabel={{ on: <HiCheck color="green" />, off: <HiX color="red" /> }}
                          checked={checked} onCheckedChange={(e) => setChecked(e.checked)}>

                          {checked ? 'Aprobar' : 'Rechazar'}

                        </Switch>
                      </Flex>
                    )
                  }

                </DialogBody>


                <DialogFooter>

                  <DialogActionTrigger asChild>
                    <Button rounded='full' size='sm' onClick={() => reset()}>Cancelar</Button>
                  </DialogActionTrigger>


                  <Button type="submit" colorPalette="green" size='sm' rounded='full'>
                    {
                      isLoadingEdit ? <Spinner size='md' /> : 'Editar'
                    }
                  </Button>

                  <Toaster />

                </DialogFooter>

              </form>

            </DialogContent>
          </DialogRoot>
        </VStack >

      }
    </>
  );

});