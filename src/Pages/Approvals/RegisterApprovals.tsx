import React, { memo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { NativeSelectField, NativeSelectRoot, Spinner, Stack, Text, Textarea, useDisclosure } from "@chakra-ui/react";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogActionTrigger } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { RegisterApprovalsProps, RequestOpeningForm } from "@models/approvals.model";
import { Field } from "@components/ui/field";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { approvalsServices } from "@services/approvalsServices";
import { useApi } from "@hooks/useApi";
import { Toaster, toaster } from "@components/ui/toaster";
import { ConfirmDialog } from "./components/ConfirmDialog";

export const RegisterApprovals: React.FC<RegisterApprovalsProps> = memo(
  ({ isOpen, onClose }) => {

    const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm<RequestOpeningForm>();
    const { addOrUpdateApprovalList } = useApprovalsList();
    const { data: closingList } = useApi(approvalsServices.getClosingList);
    const { data: reasonsList } = useApi(approvalsServices.getReasonsList);
    const { open, onOpen: onOpenConfir, onClose: onCloseConfir } = useDisclosure();

    const { refetch, isLoading } = useApi(
      () => {
        const formData = getValues();
        return approvalsServices.saveDataRequest(formData);
      },
      {
        autoFetch: false,
        onSuccess: (data) => {

          toaster.create({
            title: `Se guardaron los datos correctamente`,
            type: 'success',
          });

          setTimeout(() => {
            addOrUpdateApprovalList(data);
            reset();
            onClose();
          }, 1000);
        },
        onError: (data) => {
          console.log(data)
        },
      }
    );

    const onSubmitForm = () => onOpenConfir();
    
    const handleConfirm = () => refetch();
    
    return (
      <>
        <Toaster />

        <ConfirmDialog
          isOpen={open}
          onClose={onCloseConfir}
          onConfirm={handleConfirm}
          message="¿Estás seguro de que deseas crear una nueva Solcitud?"
          title="Registrar nuevo Solicitud de reapertura de caja/lote."
        />

        <DialogRoot scrollBehavior="inside" size="lg" open={isOpen} onOpenChange={() => onClose()}
          closeOnEscape={false} closeOnInteractOutside={false}>

          <DialogContent>

            <form onSubmit={handleSubmit(onSubmitForm)}>

              <DialogHeader>
                <DialogTitle>Registro Solicitud de Ajuste de Caja / Lote Cerrado</DialogTitle>
              </DialogHeader>

              <DialogBody pb="4">

                <Stack gap="4">

                  <Field label="Lista de cierre de cajas / cierre de lotes*">

                    <NativeSelectRoot size="md">
                      <NativeSelectField placeholder="Seleccione una opcion" {...register('name', { required: 'Este campo es requerido' })}>
                        {
                          closingList != undefined &&
                          closingList.items.map((item: any) => (<option key={item.value} value={item.value}>{item.label}</option>))
                        }
                      </NativeSelectField>
                    </NativeSelectRoot>

                    {errors.name && <Text color="red" textStyle='xs'>{errors.name?.message}</Text>}
                  </Field>

                  <Field label="Motivo*">

                    <NativeSelectRoot size="md">
                      <NativeSelectField placeholder="Seleccione una opcion" {...register('reason', { required: 'Este campo es requerido' })}>
                        {
                          reasonsList != undefined &&
                          reasonsList.items.map((item: any) => (<option key={item.value} value={item.value}>{item.label}</option>))
                        }
                      </NativeSelectField>
                    </NativeSelectRoot>

                    {errors.reason && <Text color="red" textStyle='xs'>{errors.reason?.message}</Text>}
                  </Field>

                  <Field label="Comentario*">
                    <Textarea variant="outline" {...register('comment', { required: 'Este campo es requerido' })} />
                    {errors.reason && <Text color="red" textStyle='xs'>{errors.reason?.message}</Text>}
                  </Field>

                </Stack>

              </DialogBody>

              <DialogFooter>

                <DialogActionTrigger asChild>
                  <Button rounded='full' size='sm' onClick={() => reset()} disabled={isLoading}>Cancelar</Button>
                </DialogActionTrigger>

                <Button type="submit" colorPalette="green" size='sm' rounded='full' loading={isLoading}>
                  Guardar
                </Button>

              </DialogFooter>

            </form>

          </DialogContent>

        </DialogRoot>
      </>
    );

  }
)

