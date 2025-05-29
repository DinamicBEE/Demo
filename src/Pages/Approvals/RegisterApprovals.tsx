import React, { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { NativeSelectField, NativeSelectRoot, Separator, Stack, Text, Textarea, useDisclosure } from "@chakra-ui/react";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogActionTrigger } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Field } from "@components/ui/field";
import { Toaster, toaster } from "@components/ui/toaster";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { RegisterApprovalsProps, RequestOpeningForm } from "@models/approvals.model";
import { approvalsServices } from "@services/approvalsServices";
import { getStores, getSubsidiaries } from "@services/catalogService";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { useApi } from "@hooks/useApi";

export const RegisterApprovals: React.FC<RegisterApprovalsProps> = memo(({ isOpen, onClose }) => {

  const [hasCancelled, setHasCancelled] = useState(false);
  const [reasonsListFilter, setReasonsListFilter] = useState([]);
  const { register, handleSubmit, reset, formState: { errors }, getValues } = useForm<RequestOpeningForm>();
  const { open, onOpen: onOpenConfir, onClose: onCloseConfir } = useDisclosure();
  const { triggerRefresh } = useApprovalsList();
  const { data: subsidiariesList } = useApi(getSubsidiaries);
  const { data: reasonsList } = useApi(approvalsServices.getReasonsList);

  const { data: consumerCentersList, refetch: fetchConsumerCenters, setData: setConsumerCenters } = useApi((id: number) => getStores(id), {
    autoFetch: false,
  });

  const { data: closingList, refetch: fetchClousingList, setData: setClosingList } = useApi((id: number) => approvalsServices.getClosingList(id), {
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

          onClose();
          reset();
          triggerRefresh();

          toaster.create({ title: `Se guardaron los datos correctamente`, type: 'success' });
        }

      },
      onError: (data) => {
        reset();
        onClose();
        toaster.create({ title: `No se guardaron los datos correctamente`, type: 'error' });
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

  const handleGetReasonList = (data: React.ChangeEvent<HTMLSelectElement>) => {

    const noValid = [undefined, null, ''];

    if (noValid.includes(data.target.value)) {
      setReasonsListFilter([]);
      return
    }

    const clousingId: number = Number(data.target.value);
    const closing: any = closingList.find((item: any) => item.id == clousingId);
    const typeClousing: string = closing.date.toUpperCase().includes('Corte de caja'.toUpperCase()) ? 'CASH_CLOSURE' : 'LOTE';
    const filteredReasons: any = reasonsList.items.filter((item: any) => item.type === typeClousing);

    setReasonsListFilter(filteredReasons);
  }

  const handleCancel = () => {
    reset();
    setHasCancelled(true);
    setClosingList(undefined);
    setConsumerCenters(undefined);
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
        loading={isLoading}
      />

      <DialogRoot scrollBehavior="inside" size="lg" open={isOpen} onOpenChange={() => {
        setHasCancelled(false);
        onClose();
      }}
        closeOnEscape={false} closeOnInteractOutside={false}>

        <DialogContent>


          <DialogHeader>
            <DialogTitle>Registro Solicitud de Ajuste de Caja / Lote Cerrado</DialogTitle>
          </DialogHeader>

          <DialogBody pb="4">
            <form onSubmit={handleSubmit(onSubmitForm)}>

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
                  closingList && closingList.length !== 0 && !hasCancelled &&
                  (
                    <>
                      <Separator />

                      {/* Listado de cierres de lotes y cajas */}
                      <Field label="Lista de cierre de cajas / cierre de lotes*">
                        <NativeSelectRoot size="md">
                          <NativeSelectField placeholder="Seleccione una opcion" {...register('id', { required: 'Este campo es requerido' })}
                            onChange={(event) => handleGetReasonList(event)}>
                            {
                              closingList != undefined &&
                              closingList.map((item: any) => (<option key={item.id} value={item.id}>{item.date}</option>))
                            }
                          </NativeSelectField>
                        </NativeSelectRoot>

                        {errors.id && <Text color="red" textStyle='xs'>{errors.id?.message}</Text>}
                      </Field>

                      {/* Listado motivos */}
                      <Field label="Motivo*">
                        <NativeSelectRoot size="md">
                          <NativeSelectField placeholder="Seleccione una opcion" {...register('reason', { required: 'Este campo es requerido' })}>
                            {
                              reasonsListFilter.map((item: any) => (<option key={item.id} value={item.id}>{item.reason}</option>))
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
            </form>

          </DialogBody>

          <DialogFooter>

            <DialogActionTrigger asChild>
              <Button colorPalette="meraError" onClick={() => handleCancel()} disabled={isLoading}>Cancelar</Button>
            </DialogActionTrigger>

            {
              closingList && closingList.length !== 0 && !hasCancelled && (

                <Button colorPalette="meraPrimary" loading={isLoading} disabled={isLoading} onClick={handleSubmit(onSubmitForm)}>
                  Guardar
                </Button>

              )
            }
          </DialogFooter>


        </DialogContent>

      </DialogRoot>
    </>
  );

});