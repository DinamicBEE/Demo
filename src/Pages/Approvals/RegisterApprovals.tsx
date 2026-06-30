import React, { memo, useEffect, useState } from "react";
import { Textarea, useDisclosure, Field, Box, Grid, GridItem } from "@chakra-ui/react";
import { DialogRoot, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogActionTrigger, DialogCloseTrigger } from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { toaster, Toaster } from "@components/ui/toaster";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { Approval, RegisterApprovalsProps, RequestOpeningForm } from "@models/approvals.model";
import { saveDataRequest, getClosingList, getReasonsList } from "@services/approvalsServices";
import { useApprovalContext } from "@context/approvals/approvalsListContext";
import SimpleDatePicker from "../LotClosure/components/SimpleDatePicker";
import { selectOption } from "@models/common.model";
import { toast } from "@utils/Toast";
import ComboBoxCustom from "@components/ComboBoxCustom";
import { ApprovalsReasons } from "@models/const/approvals.const";
import "./Approvals.css"
import { useAuth } from "@context/AuthContext";

export const RegisterApprovals: React.FC<RegisterApprovalsProps> = memo(({ isOpen, onClose }) => {
    const { open, onOpen, onClose: onCloseConfir } = useDisclosure();
    const { getSubsidiaries, getZoneList, getCDCs, newElementApprovalsList } = useApprovalContext();

    const [date, setDate] = useState<string>("");
    const [textareaValue, setTextareaValue] = useState<string>("");
    const [initialDate, setIntialDate] = useState<Date | undefined>(undefined);
    
    const [loading, setLoading] = useState<boolean>(false);
    
    const [subsidiaries, setSubsidiaries] = useState<selectOption[]>([]);
    const [zones, setZones] = useState<selectOption[]>([]);
    const [cdc, setCDC] = useState<selectOption[]>([]);
    const [closingList, setClosingList] = useState<selectOption[]>([]);
    const [reasonsListFilter, setReasonsListFilter] =  useState<selectOption[]>([]);
    
    const [subSelected, setSubSelected] = useState<string[]>([]);
    const [zonesSelected, setZonesSelected] = useState<string[]>([]);
    const [cdcSelected, setCDCSelected] = useState<string[]>([]);
    const [type, setType] = useState<string[]>([]);
    const [idClousing, setIdClousing] = useState<string[]>([]);
    const [reason, setReason] = useState<string[]>([]);
    const { setCount } = useAuth();
    
    const parseDateStringToLocalDate = (dateString: string): Date => {
      const [year, month, day] = dateString.split("-").map(Number);
      return new Date(year, month - 1, day);
    };

    useEffect(() => {
        if (date) {
          const localDate = parseDateStringToLocalDate(date);
          setIntialDate(localDate);
        }
      
      }, [date]);

    useEffect(() => {
      async function fetchData() {
          const subsidiariesData = await getSubsidiaries();
          setSubsidiaries(subsidiariesData);
      }

      fetchData();
    }, []);

    useEffect(() => { 
      async function fetchCDC() {
          if(zonesSelected.length === 0) setCDCSelected([]);
          const cdcData = await getCDCs(zonesSelected.map(Number));
          setCDC(cdcData);
      }

      fetchCDC();

    },[zonesSelected]);

    useEffect(() => { 
      async function fetchZones() {
          if (subSelected.length === 0) setZonesSelected([]);
          const zoneData = await getZoneList(subSelected.map(Number));
          setZones(zoneData);
      }

      fetchZones();

    },[subSelected]);

    useEffect(() => {
      async function fetchClousingList() {
        if (!Number.isNaN(Number(cdcSelected[0])) && date.length > 0 && !Number.isNaN(Number(type[0]))) {
          const response = await getClosingList(Number(cdcSelected[0]), date, Number(type[0]))

          if(response.length > 0) {

            setClosingList(response);

            const reasonResponse = await getReasonsList(Number(type[0]))

            if(reasonResponse.length > 0){
              setReasonsListFilter(reasonResponse)
            } else {
              toast("No hay motivos para el tipo de reapertura seleccionado", "warning");
            }

          } else {
            toast("No hay cierres de caja/lotes para la fecha, cdc o tipo seleccionados", "warning");
          }

        }
      }
      fetchClousingList();
    }, [cdcSelected, date, type]);

    const handleConfirm = async () => {
      setLoading(true);

      const formData: RequestOpeningForm = {
        id: idClousing[0],
        reason: Number(reason[0]),
        comment: textareaValue,
      };
      const newElement: Approval = {
        idRequest: 99999,
        comment: textareaValue,
        status: 3,
        zone: zones.find((zone) => zone.value === Number(zonesSelected[0]))?.label || "",
        cdc: cdc.find((item) => item.value === Number(cdcSelected[0]))?.label || "",
        closingEmployee: subsidiaries.find((sub) => sub.value === Number(subSelected[0]))?.label || "",
        employee: "Administrador",
        date: new Date().toISOString(),
        dateCdc: date,
        idCashBatch: Number(idClousing[0]),
        state: "Pendiente",
        typeRequest: ApprovalsReasons.find((item) => item.value === Number(type[0]))?.label || "",
        reason: reasonsListFilter.find((item) => item.value === Number(reason[0]))?.label || "",
      }

      const response = await saveDataRequest(formData);

      if(response){
        newElementApprovalsList(newElement)
        setCount((prev) => prev + 1);
        toaster.create({ title: `Se guardaron los datos correctamente`, type: "success", });
        onClose();
        onCloseConfir();
        handleCancel();
      } else {
          toaster.create({ title: `No se guardaron los datos correctamente`, type: "error", });
      }
      setLoading(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTextareaValue(e.target.value);
    };

    const handleCancel = () => {
      setType([]);
      setSubSelected([]);
      setZonesSelected([])
      setCDCSelected([]);
      setIdClousing([]);
      setReason([]);
      setDate("");
      setTextareaValue("");
      onClose();
    };

    return (
      <>
        <Toaster />

        <ConfirmDialog
          isOpen={open}
          onClose={onCloseConfir}
          onConfirm={handleConfirm}
          message="¿Estás seguro de que deseas crear una nueva Solcitud?"
          title="Registrar nuevo Solicitud de reapertura de caja/lote."
          loading={loading}
        />

        <DialogRoot
          scrollBehavior="inside"
          size="lg"
          open={isOpen}
          closeOnEscape={false}
          closeOnInteractOutside={false}
        >
          <DialogContent>
            <DialogHeader bg="#bbf7d0" color="#166534" style={{ borderRadius: '8px 8px 0px 0px' }}>
              <DialogTitle fontWeight="medium" fontSize="xl">
                Registro Solicitud de Ajuste de Caja / Lote Cerrado
              </DialogTitle>
              <DialogCloseTrigger onClick={() => handleCancel() } color="#166534" />
            </DialogHeader>
            <DialogBody pb="4">

              <Grid
                  templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                  gap={4}
                  mb={4}
                  w="100%"
                  alignItems="end"
              >

                <ComboBoxCustom multiple={false} options={subsidiaries} label="Subsidiarias" onValueChange={setSubSelected} selectedValues={subSelected} disableCondition={false}></ComboBoxCustom>
                
                <ComboBoxCustom multiple={false} options={zones} label="Zonas" onValueChange={setZonesSelected} selectedValues={zonesSelected} disableCondition={false}></ComboBoxCustom>
                
                <ComboBoxCustom multiple={false} options={cdc} label="Centros de consumo" onValueChange={setCDCSelected} selectedValues={cdcSelected} disableCondition={false}></ComboBoxCustom>

                <ComboBoxCustom multiple={false} options={ApprovalsReasons} label="Tipo de reapertura" onValueChange={setType} selectedValues={type} disableCondition={false}></ComboBoxCustom>
             
                <GridItem colSpan={2}>
                  <Field.Root>
                    <Field.Label>Fecha</Field.Label>
                    <SimpleDatePicker
                      onDateChange={setDate}
                      initialDate={initialDate}
                    ></SimpleDatePicker>
                  </Field.Root>
                </GridItem>

                <GridItem colSpan={2} display="flex" justifyContent="center" >
                  <div className="separator" />
                </GridItem>

                <GridItem colSpan={2}>
                  <ComboBoxCustom multiple={false} options={closingList} label="Lista de cierre de cajas / cierre de lotes" onValueChange={setIdClousing} selectedValues={idClousing} disableCondition={false}></ComboBoxCustom>
                </GridItem>
                
                <GridItem colSpan={2}>
                  <ComboBoxCustom multiple={false} options={reasonsListFilter} label="Motivo" onValueChange={setReason} selectedValues={reason} disableCondition={false}></ComboBoxCustom>
                </GridItem>
                
                <GridItem colSpan={2}>
                  <Field.Root required>
                    <Field.Label>Comentario</Field.Label>
                    <Textarea
                      variant="outline"
                      value={textareaValue}
                      onChange={handleChange}
                    />
                  </Field.Root>
                </GridItem>

              </Grid>

            </DialogBody>

            <DialogFooter display={"flex"} gap={6} justifyContent="space-evenly">
              <DialogActionTrigger>
                <Box display={"flex"} gap={6} justifyContent="space-evenly">
                  <Button size="md" w={150} colorPalette="meraError" onClick={() => handleCancel()}
                    disabled={loading}> Cancelar </Button>

                  <Button size="md" w={150} colorPalette="meraPrimary" loading={loading} disabled={loading || idClousing.length === 0}
                    onClick={() => onOpen()} > Guardar </Button>
                </Box>
              </DialogActionTrigger>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </>
    );
  }
);