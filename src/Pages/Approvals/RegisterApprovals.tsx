import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Temporal } from "@js-temporal/polyfill";
import { createListCollection, NativeSelectField, NativeSelectRoot, Stack, Textarea } from "@chakra-ui/react";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogCloseTrigger, DialogActionTrigger } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Approval, RequestOpening } from "@models/approvals.model";
import { Field } from "@components/ui/field";
import { useApprovalsList } from "@context/approvals/approvalsListContext";

interface RegisterApprovalsProps {
  isOpen: any;
  onClose: any;
}

export const RegisterApprovals: React.FC<RegisterApprovalsProps> = ({ isOpen, onClose }) => {

  const { register, handleSubmit, formState: { errors } } = useForm<RequestOpening>();
  const { addOrUpdateApprovalList } = useApprovalsList()

  const onSubmitForm: SubmitHandler<RequestOpening> = (data: RequestOpening) => {

    const responseOpening: Approval = {
      id: getRandomExcluding(),
      date: formatDate(),
      state: 'Abierto',
      typeRequest: '',
      reasons: data.reason,
      comment: data.comment
    };

    addOrUpdateApprovalList(responseOpening);
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
                      {closingList.items.map((item) => (<option key={item.value} value={item.value}>{item.label}</option>))}
                    </NativeSelectField>
                  </NativeSelectRoot>

                  {errors.name && <small className="text-red-600">{errors.name?.message}</small>}
                </Field>

                <Field label="Motivo*">

                  <NativeSelectRoot size="md">
                    <NativeSelectField placeholder="Seleccione una opcion" {...register('reason', { required: 'Este campo es requerido' })}>
                      {reasons.items.map((item) => (<option key={item.value} value={item.value}>{item.label}</option>))}
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
                <Button variant="outline">Cancel</Button>
              </DialogActionTrigger>

              <Button type="submit">Save</Button>

            </DialogFooter>

          </form>

        </DialogContent>
      </DialogRoot>
    </>
  )
}

const closingList = createListCollection({
  items: [
    { label: "Corte caja 10/02/25 12:00 am", value: "Corte caja 10/02/25 12:00 am" },
    { label: "Corte lote 12/02/25 10:00 am", value: "Corte lote 12/02/25 10:00 am" },
    { label: "Corte caja 11/02/25 11:00 am", value: "Corte caja 11/02/25 11:00 am" },
    { label: "Corte caja 14/02/25 1:00 pm", value: "Corte caja 14/02/25 1:00 pm" },
  ],
})

const reasons = createListCollection({
  items: [
    { label: "Diferencia/ajustes en algún importe", value: "Diferencia/ajustes en algún importe" },
    { label: "Ajustes en cupones", value: "Ajustes en cupones" },
    { label: "Forma de pago", value: "Forma de pago" },
    { label: "Diferencia en última actualización", value: "Diferencia en última actualización" },
  ],
});

const getRandomExcluding = ()  => {
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