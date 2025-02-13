import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { HiCheck, HiX } from "react-icons/hi";
import { Badge, DataList, DialogActionTrigger, DialogTitle, Flex, List, Textarea, VStack } from "@chakra-ui/react";
import { DialogContent, DialogRoot, DialogCloseTrigger, DialogHeader, DialogFooter, DialogBody } from "@components/ui/dialog";
import { Field } from "@components/ui/field";
import { Switch } from "@components/ui/switch";
import { Button } from "@components/ui/button";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { Approval, EditRequestForm } from "@models/approvals.model";


interface EditStatusApprovalsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditStatusApprovals: React.FC<EditStatusApprovalsProps> = ({ isOpen, onClose }) => {

  const { dataApproval, addOrUpdateApprovalList } = useApprovalsList();
  const { register, handleSubmit, formState: { errors } } = useForm<EditRequestForm>();
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => setChecked(dataApproval.status), [dataApproval]);

  const onSubmitForm: SubmitHandler<EditRequestForm> = (data: EditRequestForm) => {
    const dataEdit: Approval = {
      id: dataApproval.id,
      date: dataApproval.date,
      state: dataApproval.state,
      typeRequest: dataApproval.typeRequest,
      reasons: dataApproval.reasons,
      comment: dataApproval.comment,
      commentSupervisor: data.comment,
      status: checked
    }

    addOrUpdateApprovalList(dataEdit)
  }

  return (
    <>
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
                    <DataList.ItemLabel>Estatus Actual</DataList.ItemLabel>
                    <DataList.ItemValue>
                      {dataApproval.status ? <Badge colorPalette="green">Aprovado</Badge> : <Badge colorPalette="red">Rechazado</Badge>}
                    </DataList.ItemValue>
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

                <Field label='Agregar comentario' paddingTop='20px'>
                  <Textarea {...register('comment', { required: 'Este campo es requerido' })} />
                  {errors.comment && <small className="text-red-600">{errors.comment?.message}</small>}
                </Field>

                <Flex justifyContent='start' paddingTop='20px'>
                  <Switch size='lg' colorPalette='green'
                    thumbLabel={{ on: <HiCheck color="green" />, off: <HiX color="red" /> }}
                    checked={checked} onCheckedChange={(e) => setChecked(e.checked)}>

                    {checked ? 'Aprobar' : 'Rechazar'}

                  </Switch>
                </Flex>

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
      </VStack>
    </>
  )
}