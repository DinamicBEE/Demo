import React, { memo } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Temporal } from "@js-temporal/polyfill";
import { NativeSelectField, NativeSelectRoot, Stack, Textarea } from "@chakra-ui/react";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogActionTrigger } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Approval, RegisterApprovalsProps, RequestOpeningForm } from "@models/approvals.model";
import { Field } from "@components/ui/field";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { approvalsServices } from "@services/approvalsServices";
import { useApi } from "@hooks/useApi";


export const RegisterApprovals: React.FC<RegisterApprovalsProps> = memo(
  ({ isOpen, onClose }) => {

    const { register, handleSubmit, reset, formState: { errors } } = useForm<RequestOpeningForm>();
    const { addOrUpdateApprovalList } = useApprovalsList();
    const { data: closingList } = useApi(approvalsServices.getClosingList);
    const { data: reasonsList } = useApi(approvalsServices.getReasonsList);

    const onSubmitForm: SubmitHandler<RequestOpeningForm> = (data: RequestOpeningForm) => {

      const responseOpening: Approval = {
        id: getRandomExcluding(),
        date: formatDate(),
        state: 'Abierto',
        typeRequest: '',
        reasons: data.reason,
        comment: data.comment,
        status: 2
      };

      addOrUpdateApprovalList(responseOpening);
      reset();
      onClose();
    }

    return (
      <>
        <DialogRoot scrollBehavior="inside" size="lg" open={isOpen} onOpenChange={() => onClose()} closeOnEscape={false} closeOnInteractOutside={false}>

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

                    {errors.name && <small className="text-red-600">{errors.name?.message}</small>}
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

                    {errors.reason && <small className="text-red-600">{errors.reason?.message}</small>}
                  </Field>

                  <Field label="Comentario*">
                    <Textarea variant="outline" {...register('comment', { required: 'Este campo es requerido' })} />
                    {errors.reason && <small className="text-red-600">{errors.reason?.message}</small>}
                  </Field>

                </Stack>

              </DialogBody>

              <DialogFooter>

                <DialogActionTrigger asChild>
                  <Button rounded='full' size='sm'>Cancelar</Button>
                </DialogActionTrigger>

                <Button type="submit" colorPalette="green" size='sm' rounded='full'>Guardar</Button>

              </DialogFooter>

            </form>

          </DialogContent>
        </DialogRoot>
      </>
    );

  }
)

const getRandomExcluding = () => {
  let num;
  do {
    num = Math.floor(Math.random() * 100) + 1; // Número entre 1 y 100
  } while ([1, 2, 3, 4, 5].includes(num));
  return num;
}

const formatDate = () => {
  const now = Temporal.Now.plainDateTimeISO();

  return now.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,  // Para formato AM/PM
  }); // Eliminar la coma entre fecha y hora
};