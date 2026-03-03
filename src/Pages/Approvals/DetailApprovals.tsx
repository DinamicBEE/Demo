import React, { memo, useState } from "react";
import { useForm } from "react-hook-form";
import { DialogActionTrigger, DialogTitle, Textarea, VStack, Text, useDisclosure, Blockquote, Grid, GridItem, Box } from "@chakra-ui/react";
import { DialogContent, DialogRoot, DialogCloseTrigger, DialogHeader, DialogFooter, DialogBody } from "@components/ui/dialog";
import { Field } from "@components/ui/field";
import { Button } from "@components/ui/button";
import { useApprovalContext } from "@context/approvals/approvalsListContext";
import { EditRequestForm, DetailApprovalsProps, RequestUpdateDetails  } from "@models/approvals.model";
import { updateStatusRequest } from "@services/approvalsServices";
import { IoLockOpen, IoLockClosed, IoHourglassOutline, IoCheckmarkCircle, IoCloseCircle, IoCalendarOutline, IoPersonOutline, IoStorefrontOutline, IoBusinessOutline, IoReaderOutline, IoFileTrayStackedOutline, IoCheckmarkCircleOutline, IoCloseCircleOutline } from "react-icons/io5";
import { Toaster, toaster } from "@components/ui/toaster";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { formatToDDMMYYYYstring } from "@utils/dateFormatter";
import { REQUEST_TYPE, STATE_LABELS, STATUSLABELS } from "@models/const/approvals.const";


export const DetailApprovals: React.FC<DetailApprovalsProps> = memo(({ isOpen, onClose }) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [isApproved, setIsApproved ] = useState<boolean>(false);

  const { dataApproval, triggerRefresh } = useApprovalContext();
  const { open, onOpen, onClose: onCloseConfir } = useDisclosure();
  const { register, reset, formState: { errors }, getValues } = useForm<EditRequestForm>();

  const handleEdit = async () => {
    setLoading(true);

    const data = getValues();
    const dataEdit: RequestUpdateDetails = {
      idRequest: dataApproval.idRequest,
      idCashLote: dataApproval.idCashBatch || 0,
      typeRequest: dataApproval.typeRequest,
      comment: data.comment,
      status: isApproved
    };

    const response = await updateStatusRequest(dataEdit);

    if(response) {
      toaster.create({ title: `Se actualizo los datos correctamente`, type: 'success' });
      onClose();
      reset();
      triggerRefresh();
    } else {
      toaster.create({ title: `No se actualizo los datos correctamente`, type: 'error' });
    }

    setLoading(false);

  }

  const handleSetApproved = (isApproved: boolean) => {
    setIsApproved(isApproved);
    onOpen();
  }

  return (
    <>
      <Toaster />

      <ConfirmDialog
        isOpen={open}
        onClose={onCloseConfir}
        onConfirm={handleEdit}
        message="¿Estás seguro de que deseas editar esta Solicitud?"
        title="Editar Solicitud de reapertura de caja/lote."
        loading={loading}
      />

      <VStack alignItems='start'>
        <DialogRoot scrollBehavior="inside" size="full" open={isOpen} onOpenChange={() => onClose()} closeOnEscape={false} closeOnInteractOutside={false} >
          <DialogContent>


            <DialogHeader  bg="#bbf7d0" color="#166534" style={{ borderRadius: '8px 8px 0px 0px' }}>
              <DialogTitle fontWeight="medium" fontSize="xl"> 
                {REQUEST_TYPE.find(type => type.key === dataApproval.typeRequest)?.label} solicitud {dataApproval.idRequest} 
              </DialogTitle>
              <DialogCloseTrigger color="#166534" />
            </DialogHeader>

            <DialogBody pb='8'>
              <form >

                <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                  gap={4}
                  mb={4}
                  mt="2rem"
                  w="100%"
                  alignItems="end"
                >

                  <Blockquote.Root colorPalette="green" padding="2">
                    <Blockquote.Content fontWeight="medium" fontSize="lg" display="flex" flexDirection="row" alignItems="center" gap="8px">
                      <IoBusinessOutline color="166534" />
                      {dataApproval.zone}
                    </Blockquote.Content>
                    <Blockquote.Caption>Zona</Blockquote.Caption>
                  </Blockquote.Root>

                  <Blockquote.Root colorPalette="green" padding="2">
                    <Blockquote.Content fontWeight="medium" fontSize="lg" display="flex" flexDirection="row" alignItems="center" gap="8px">
                      <IoStorefrontOutline color="166534" />
                      {dataApproval.cdc}
                    </Blockquote.Content>
                    <Blockquote.Caption>Centro de consumo</Blockquote.Caption>
                  </Blockquote.Root>

                  <Blockquote.Root colorPalette="green" padding="2">
                    <Blockquote.Content fontWeight="medium" fontSize="lg" display="flex" flexDirection="row" alignItems="center" gap="8px">
                      <IoPersonOutline color="166534" />
                      {dataApproval.closingEmployee}
                    </Blockquote.Content>
                    <Blockquote.Caption>Empleado del corte</Blockquote.Caption>
                  </Blockquote.Root>

                  <Blockquote.Root colorPalette="green" padding="2">
                    <Blockquote.Content fontWeight="medium" fontSize="lg" display="flex" flexDirection="row" alignItems="center" gap="8px">
                      <IoCalendarOutline color="#166534"/>
                      {formatToDDMMYYYYstring(dataApproval.dateCdc)}
                    </Blockquote.Content>
                    <Blockquote.Caption >Fecha del corte </Blockquote.Caption>
                  </Blockquote.Root>

                  <GridItem></GridItem>

                  <Blockquote.Root colorPalette="green" padding="2">
                    <Blockquote.Content fontWeight="medium" fontSize="lg" display="flex" flexDirection="row" alignItems="center" gap="8px">
                      {dataApproval.state === STATE_LABELS[0].key ? <IoLockOpen color="green" /> : <IoLockClosed color="red" />}
                      {STATE_LABELS.find(item => item.key === dataApproval.state)?.label }
                    </Blockquote.Content>
                    <Blockquote.Caption>Estado de solicitud</Blockquote.Caption>
                  </Blockquote.Root>

                  <Blockquote.Root colorPalette="cyan" padding="2" mt="2rem">
                    <Blockquote.Content fontWeight="medium" fontSize="lg" display="flex" flexDirection="row" alignItems="center" gap="8px">
                      <IoPersonOutline color="166534" />
                      {dataApproval.employee}
                    </Blockquote.Content>
                    <Blockquote.Caption>Empleado de solicitud</Blockquote.Caption>
                  </Blockquote.Root>

                  <Blockquote.Root colorPalette="cyan" padding="2">
                    <Blockquote.Content fontWeight="medium" fontSize="lg" display="flex" flexDirection="row" alignItems="center" gap="8px">
                      <IoCalendarOutline color="#166534"/>
                      {formatToDDMMYYYYstring(dataApproval.date)}
                    </Blockquote.Content>
                    <Blockquote.Caption>Fecha de solicitud</Blockquote.Caption>
                  </Blockquote.Root>

                  <Blockquote.Root colorPalette="cyan" padding="2">
                    <Blockquote.Content fontWeight="medium" fontSize="lg" display="flex" flexDirection="row" alignItems="center" gap="8px">
                      <IoFileTrayStackedOutline color="166534" />
                      {dataApproval.reason}
                    </Blockquote.Content>
                    <Blockquote.Caption>Motivo de Solicitud</Blockquote.Caption>
                  </Blockquote.Root>

                  <GridItem colSpan={2}>
                    <Blockquote.Root colorPalette="cyan" padding="2">
                      <Blockquote.Content fontWeight="medium" fontSize="lg" display="flex" flexDirection="row" alignItems="center" gap="8px">
                        <IoReaderOutline color="166534" />
                        {dataApproval.comment}
                      </Blockquote.Content>
                      <Blockquote.Caption>Comentarios del solicitante</Blockquote.Caption>
                    </Blockquote.Root>
                  </GridItem>

                  <Blockquote.Root colorPalette="cyan" padding="2">
                    <Blockquote.Content fontWeight="medium" fontSize="lg" display="flex" flexDirection="row" alignItems="center" gap="8px">
                      {dataApproval.status === STATUSLABELS[0].id ? <IoCloseCircle color="red" /> : dataApproval.status === STATUSLABELS[1].id ? <IoCheckmarkCircle color="green" /> : <IoHourglassOutline color="orange" />}
                      {STATUSLABELS.find((status) => status.id === dataApproval.status)?.label }
                    </Blockquote.Content>
                    <Blockquote.Caption>Estado de solicitud</Blockquote.Caption>
                  </Blockquote.Root>
                  

                </Grid>

                { dataApproval.status === 3 && (

                    <Field label='Agregar comentario' mt="2rem">
                      <Textarea {...register('comment', { required: 'Este campo es requerido' })} />
                      {errors.comment && <Text color="red" textStyle='xs'>{errors.comment?.message}</Text>}
                    </Field>
                  )
                }

              </form>
            </DialogBody>

            <DialogFooter display={"flex"} gap={6} justifyContent="space-evenly">

              { dataApproval.status === 3 && (
                  <Box display={"flex"} gap={6} justifyContent="space-evenly">
                    <Button size="md" w={150} colorPalette="meraError" loading={loading} onClick={() => handleSetApproved(false)} >Rechazar <IoCloseCircleOutline /></Button>

                    <Button size="md" w={150} colorPalette="meraPrimary" loading={loading} onClick={() => handleSetApproved(true)} >Aprobar <IoCheckmarkCircleOutline /></Button>
                  </Box>
                )
              }

              { dataApproval.status !== 3 && (
                  <DialogActionTrigger asChild>
                    <Button size="md" w={150} colorPalette="meraError" onClick={() => reset()} >Cerrar <IoCloseCircleOutline /></Button>
                  </DialogActionTrigger>
                )
              }

            </DialogFooter>

          </DialogContent>
        </DialogRoot>
      </VStack >
    </>
  );

});