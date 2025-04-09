import React, { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { NativeSelectField, NativeSelectRoot, Separator, Stack, Text, Textarea, useDisclosure } from "@chakra-ui/react";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogActionTrigger } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { RegisterApprovalsProps, RequestOpeningForm } from "@models/approvals.model";
import { Field } from "@components/ui/field";
import { approvalsServices } from "@services/approvalsServices";
import { useApi } from "@hooks/useApi";
import { Toaster, toaster } from "@components/ui/toaster";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { getStores, getSubsidiaries } from "@services/catalogService";
// import { useApprovalsList } from "@context/approvals/approvalsListContext";

export const RegisterApprovals: React.FC<RegisterApprovalsProps> = memo(({ isOpen, onClose }) => {

  const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm<RequestOpeningForm>();
  const { open, onOpen: onOpenConfir, onClose: onCloseConfir } = useDisclosure();
  const { data: subsidiariesList } = useApi(getSubsidiaries);
  const { data: reasonsList } = useApi(approvalsServices.getReasonsList);

  //hook encardado de traer las subsidiarias
  const { data: consumerCentersList, refetch: fetchConsumerCenters } = useApi((id: number) => getStores(id), {
    autoFetch: false,
  });

  //hook para obtener el listado de cajas por centro de consumo
  const { data: closingList, refetch: fetchClousingList } = useApi((id: number) => approvalsServices.getClosingList(id), {
    autoFetch: false
  });

  //hook encargado de realizar el guardado de la informacion
  const { refetch, isLoading } = useApi(
    () => {
      const formData = getValues();
      return approvalsServices.saveDataRequest(formData);
    },
    {
      autoFetch: false,
      onSuccess: (data) => {

        if (data == 'create') {
          toaster.create({
            title: `Se guardaron los datos correctamente`,
            type: 'success',
          });

          setTimeout(() => {
            // addOrUpdateApprovalList(data);
            reset();
            onClose();
          }, 1000);
        }


      },
      onError: (data) => {
        console.log(data)
      },
    }
  );

  const onSubmitForm = () => onOpenConfir();

  const handleConfirm = () => refetch();

  const handleGetConsumerCenter = (data: React.ChangeEvent<HTMLSelectElement>) => {

    const idSubsidary: number = Number(data.target.value);

    fetchConsumerCenters(idSubsidary); // disparas la petición
  };

  const handleGetCashClousing = (data: React.ChangeEvent<HTMLSelectElement>) => {

    const idConsumerCenter: number = Number(data.target.value);

    fetchClousingList(idConsumerCenter);
  }

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

                {/* Listado de Subsidiarias. */}
                <Field label="Subsidiarias">
                  <NativeSelectRoot size="md">
                    <NativeSelectField placeholder="Seleccione una opcion" onChange={(event) => handleGetConsumerCenter(event)}>
                      {
                        subsidiariesList &&
                        subsidiariesList.map((item: any) => (<option key={item.id} value={item.id}>{item.name}</option>))
                      }
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Field>

                {/* Lista de Centros de Consumo  */}
                <Field label="Centros de Consumo">
                  <NativeSelectRoot size="md">
                    <NativeSelectField placeholder="Seleccione una opción" onChange={(event) => handleGetCashClousing(event)}>
                      {
                        consumerCentersList &&
                        consumerCentersList.map((item: any) => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))
                      }
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Field>


                {
                  closingList && closingList.length != 0 &&
                  (
                    <>
                      <Separator />

                      {/* Listado de cierres de lotes y cajas */}
                      <Field label="Lista de cierre de cajas / cierre de lotes*">
                        <NativeSelectRoot size="md">
                          <NativeSelectField placeholder="Seleccione una opcion" {...register('idCash', { required: 'Este campo es requerido' })}>
                            {
                              closingList != undefined &&
                              closingList.map((item: any) => (<option key={item.id} value={item.id}>{item.date}</option>))
                            }
                          </NativeSelectField>
                        </NativeSelectRoot>

                        {errors.idCash && <Text color="red" textStyle='xs'>{errors.idCash?.message}</Text>}
                      </Field>

                      {/* Listado motivos */}
                      <Field label="Motivo*">
                        <NativeSelectRoot size="md">
                          <NativeSelectField placeholder="Seleccione una opcion" {...register('reason', { required: 'Este campo es requerido' })}>
                            {
                              reasonsList != undefined &&
                              reasonsList.items.map((item: any) => (<option key={item.id} value={item.id}>{item.reason}</option>))
                            }
                          </NativeSelectField>
                        </NativeSelectRoot>
                        {errors.reason && <Text color="red" textStyle='xs'>{errors.reason?.message}</Text>}
                      </Field>

                      <Field label="Comentario*">
                        <Textarea variant="outline" {...register('comment', { required: 'Este campo es requerido' })} />
                        {errors.reason && <Text color="red" textStyle='xs'>{errors.reason?.message}</Text>}
                      </Field>
                    </>
                  )
                }

              </Stack>

            </DialogBody>

            <DialogFooter>

              <DialogActionTrigger asChild>
                <Button colorPalette="meraError" onClick={() => reset()} disabled={isLoading}>Cancelar</Button>
              </DialogActionTrigger>

              <Button type="submit" colorPalette="meraPrimary" loading={isLoading}>
                Guardar
              </Button>

            </DialogFooter>

          </form>

        </DialogContent>

      </DialogRoot>
    </>
  );

});