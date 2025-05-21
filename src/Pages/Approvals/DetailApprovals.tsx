import React, { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { DataList, DialogActionTrigger, DialogTitle, List, Textarea, VStack, Text, Spinner, Flex, useDisclosure } from "@chakra-ui/react";
import { DialogContent, DialogRoot, DialogCloseTrigger, DialogHeader, DialogFooter, DialogBody } from "@components/ui/dialog";
import { Field } from "@components/ui/field";
import { Button } from "@components/ui/button";
import { Switch } from "@components/ui/switch";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { EditRequestForm, DetailApprovalsProps, RequestUpdateDetails } from "@models/approvals.model";
import { approvalsServices } from "@services/approvalsServices";
import { useApi } from "@hooks/useApi";
import { HiCheck, HiX } from "react-icons/hi";
import { Toaster, toaster } from "@components/ui/toaster";
import { ConfirmDialog } from "./components/ConfirmDialog";


export const DetailApprovals: React.FC<DetailApprovalsProps> = memo(({ isOpen, onClose }) => {

  const stateLabel: Record<string, string> = { 'Open': "Abierta", 'Close': "Cerrado" };
  const typeRequestLabel: Record<string, string> = { "CASH_CLOSURE": 'Corte de Caja', 'LOTE': 'Corte de Lote' };

  const [checked, setChecked] = useState<boolean>(false);

  const { dataApproval, triggerRefresh } = useApprovalsList();
  const { open, onOpen: onOpenConfirm, onClose: onCloseConfir } = useDisclosure();
  const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm<EditRequestForm>();

  const { refetch, isLoading: isLoadingEdit } = useApi(
    () => {

      const data = getValues();
      const dataEdit: RequestUpdateDetails = {
        idRequest: dataApproval.idRequest,
        idCashLote: dataApproval.idCashBatch || 0,
        typeRequest: dataApproval.typeRequest,
        comment: data.comment, // comentario del supervisor.
        status: (checked ? true : false)
      };

      return approvalsServices.updateStatusRequest(dataEdit);
    },
    {
      autoFetch: false,
      onSuccess: (data) => {
      
        onClose();
        reset();
        triggerRefresh();

        toaster.create({ title: `Se actualizo los datos correctamente`, type: 'success' });

      },
      onError: (error) => {
      
        reset();
        onClose();

       
        toaster.create({ title: `No se actualizo los datos correctamente`, type: 'error' });
      }
    }
  );

  const onSubmitForm = () => onOpenConfirm();

  const handleConfirm = () => refetch();

  return (
    <>
      <Toaster />

      <ConfirmDialog
        isOpen={open}
        onClose={onCloseConfir}
        onConfirm={handleConfirm}
        message="¿Estás seguro de que deseas editar esta Solicitud?"
        title="Editar Solicitud de reapertura de caja/lote."
        loading={isLoadingEdit}
      />

      <VStack alignItems='start'>
        <DialogRoot scrollBehavior="inside" size="lg" open={isOpen} onOpenChange={() => onClose()} closeOnEscape={false} closeOnInteractOutside={false}>
          <DialogContent>

            <DialogCloseTrigger />

            <DialogHeader>
              <DialogTitle> Editar estatus de solicitud de Ajuste de Caja / Lote Cerrado </DialogTitle>
            </DialogHeader>

            <DialogBody pb='8'>
              <form >
                <DataList.Root orientation='horizontal'>
                  <DataList.Item>
                    <DataList.ItemLabel>Fecha</DataList.ItemLabel>
                    <DataList.ItemValue>{dataApproval.date}</DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>Estado</DataList.ItemLabel>
                    <DataList.ItemValue>{stateLabel[dataApproval.state]}</DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>Tipo de Solicitud</DataList.ItemLabel>
                    <DataList.ItemValue>{typeRequestLabel[dataApproval.typeRequest]}</DataList.ItemValue>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.ItemLabel>Motivo de Solicitud</DataList.ItemLabel>
                    <DataList.ItemValue>{dataApproval.reason}</DataList.ItemValue>
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
                  dataApproval.status === 3 &&
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
              </form>
            </DialogBody>

            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button colorPalette="meraError" onClick={() => reset()} >Cancelar</Button>
              </DialogActionTrigger>

              <Button colorPalette="meraPrimary" loading={isLoadingEdit} onClick={handleSubmit(onSubmitForm)}>
                Guardar
              </Button>
            </DialogFooter>

          </DialogContent>
        </DialogRoot>
      </VStack >
    </>
  );

});