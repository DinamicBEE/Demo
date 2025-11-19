import React, { memo, useEffect, useState } from "react";
import {
  createListCollection,
  ListCollection,
  Separator,
  Text,
  Textarea,
  useDisclosure,
  Field,
} from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@components/ui/select";
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogActionTrigger,
  DialogCloseTrigger,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import { Toaster, toaster } from "@components/ui/toaster";
import { ConfirmDialog } from "./components/ConfirmDialog";
import {
  RegisterApprovalsProps,
  RequestOpeningForm,
} from "@models/approvals.model";
import { approvalsServices } from "@services/approvalsServices";
import { getStores, getSubsidiaries, getZones } from "@services/catalogService";
import { useApprovalsList } from "@context/approvals/approvalsListContext";
import { useApi } from "@hooks/useApi";
import SimpleDatePicker from "../LotClosure/components/SimpleDatePicker";
import { selectOption } from "@models/common.model";
import { fetchAndSetData } from "../../utils/selectManagement";
import { ApprovalsReasons } from "@models/common.const";
import { toast } from "@utils/Toast";

export const RegisterApprovals: React.FC<RegisterApprovalsProps> = memo(
  ({ isOpen, onClose }) => {
    const [hasCancelled, setHasCancelled] = useState(false);
    const {
      open,
      onOpen: onOpenConfir,
      onClose: onCloseConfir,
    } = useDisclosure();
    const { triggerRefresh } = useApprovalsList();

    const [type, setType] = useState<number>(0);
    const [idCDC, setIdCDC] = useState<number>(0);
    const [idClousing, setIdClousing] = useState<number>(0);
    const [reason, setReason] = useState<number>(0);
    const [date, setDate] = useState<string>("");
    const [textareaValue, setTextareaValue] = useState<string>("");
    const [initialDate, setIntialDate] = useState<Date | undefined>(undefined);

    const [subsidiaries, setSubsidiaries] = useState<
      ListCollection<selectOption>
    >(createListCollection<selectOption>({ items: [] }));
    const [zones, setZones] = useState<ListCollection<selectOption>>(
      createListCollection<selectOption>({ items: [] })
    );
    const [cdc, setCDC] = useState<ListCollection<selectOption>>(
      createListCollection<selectOption>({ items: [] })
    );
    const [closingList, setClosingList] = useState<
      ListCollection<selectOption>
    >(createListCollection<selectOption>({ items: [] }));
    const [reasonsListFilter, setReasonsListFilter] = useState<
      ListCollection<selectOption>
    >(createListCollection<selectOption>({ items: [] }));

    const parseDateStringToLocalDate = (dateString: string): Date => {
      const [year, month, day] = dateString.split("-").map(Number);
      return new Date(year, month - 1, day);
    };

    useEffect(() => {
        if (date) {
          const localDate = parseDateStringToLocalDate(date);
          setIntialDate(localDate);
        }
      
      }, [date])

    useEffect(() => {
      async function fetchData() {
        await fetchAndSetData(getSubsidiaries, setSubsidiaries);
      }

      fetchData();
    }, []);

    //hook encargado de realizar el guardado de la informacion
    const { refetch, isLoading } = useApi(
      () => {
        const formData: RequestOpeningForm = {
          id: idClousing.toString(),
          reason: reason,
          comment: textareaValue,
        };
        return approvalsServices.saveDataRequest(formData);
      },
      {
        autoFetch: false,
        onSuccess: (data) => {
          if (data == "create") {
            onClose();
            handleCancel(false);
            triggerRefresh();

            toaster.create({
              title: `Se guardaron los datos correctamente`,
              type: "success",
            });
          }
        },
        onError: (data) => {
          handleCancel(false);
          onClose();
          toaster.create({
            title: `No se guardaron los datos correctamente`,
            type: "error",
          });
        },
      }
    );

    useEffect(() => {
      async function fetchClousingList() {
        if (idCDC !== 0 && date.length > 0 && type !== 0) {
          await fetchAndSetData(
            () => approvalsServices.getClosingList(idCDC, date, type),
            setClosingList
          );

          if (closingList.items.length === 0)
            toast("No hay cierres de caja/lotes para la fecha, cdc o tipo seleccionados", "warning");

          await fetchAndSetData(
            () => approvalsServices.getReasonsList(type),
            setReasonsListFilter
          );

          if (reasonsListFilter.items.length === 0)
            toast("No hay motivos para el tipo de reapertura seleccionado", "warning");
        }
      }
      fetchClousingList();
    }, [idCDC, date, type]);

    const onSubmitForm = () => onOpenConfir();

    const handleConfirm = () => refetch();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setTextareaValue(e.target.value);
    };

    const handleCancel = (flag: boolean) => {
      setHasCancelled(flag);
      setType(0);
      setIdCDC(0);
      setIdClousing(0);
      setReason(0);
      setDate("");
      setTextareaValue("");
    };

    const handleSubChange = (item: selectOption) => {
      fetchAndSetData(
        () => getZones([item.value]),
        setZones
      );
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

        <DialogRoot
          scrollBehavior="inside"
          size="lg"
          open={isOpen}
          onOpenChange={() => {
            setHasCancelled(false);
            onClose();
          }}
          closeOnEscape={false}
          closeOnInteractOutside={false}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Registro Solicitud de Ajuste de Caja / Lote Cerrado
              </DialogTitle>
            </DialogHeader>
            <DialogBody pb="4">

              {/* Selección de subsidiaria */}

              <SelectRoot
                collection={subsidiaries}
                onValueChange={(event) => {
                  const selectedSub = event.items.map((item: selectOption) => ({
                    value: item.value,
                    label: item.label,
                  }));
                  setZones(createListCollection<selectOption>({ items: [] }));
                  setCDC(createListCollection<selectOption>({ items: [] }));
                  setIdCDC(0);
                  setClosingList(createListCollection<selectOption>({ items: [] }));
                  setIdClousing(0);
                  fetchAndSetData(
                    () => getZones([selectedSub[0].value]),
                    setZones
                  );
                }}
              >
                <SelectLabel fontFamily="heading">Subsidiarias</SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder="Seleccione una opcion" />
                </SelectTrigger>
                <SelectContent>
                  {subsidiaries.items.length > 0 &&
                    subsidiaries.items.map((item: selectOption) => (
                      <SelectItem item={item} key={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </SelectRoot>

              {/* Selección de zona */}

              <SelectRoot
                collection={zones}
                onValueChange={(event) => {
                  const selectedZone = event.items.map(
                    (item: selectOption) => ({
                      value: item.value,
                      label: item.label,
                    })
                  );
                  setCDC(createListCollection<selectOption>({ items: [] }));
                  setIdCDC(0);
                  setClosingList(createListCollection<selectOption>({ items: [] }));
                  setIdClousing(0);
                  fetchAndSetData(
                    () => getStores(selectedZone[0].value),
                    setCDC
                  );
                }}
              >
                <SelectLabel fontFamily="heading">Zonas</SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder="Seleccione una opcion" />
                </SelectTrigger>
                <SelectContent>
                  {zones.items.length > 0 &&
                    zones.items.map((item: selectOption) => (
                      <SelectItem item={item} key={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </SelectRoot>

              {/* Selección de CDC */}

              <SelectRoot
                
                collection={cdc}
                onValueChange={(event) => {
                  setIdCDC(event.items[0].value);
                }}
              >
                <SelectLabel fontFamily="heading">
                  Centros de Consumo
                </SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder="Seleccione una opcion" />
                </SelectTrigger>
                <SelectContent>
                  {cdc.items.length > 0 &&
                    cdc.items.map((item: selectOption) => (
                      <SelectItem item={item} key={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </SelectRoot>

              {/* Selección de tipo de reapertura */}

              <SelectRoot
                  collection={ApprovalsReasons}
                onValueChange={(event) => {
                  setType(event.items[0].value);
                }}
              >
                <SelectLabel fontFamily="heading">
                  Tipo de reapertura
                </SelectLabel>
                <SelectTrigger>
                  <SelectValueText placeholder="Seleccione una opcion" />
                </SelectTrigger>
                <SelectContent>
                  {ApprovalsReasons.items.length > 0 &&
                    ApprovalsReasons.items.map((item: selectOption) => (
                      <SelectItem item={item} key={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </SelectRoot>

              <Field.Root>
                <Field.Label>Fecha</Field.Label>
                <SimpleDatePicker
                  onDateChange={setDate}
                  initialDate={initialDate}
                ></SimpleDatePicker>
              </Field.Root>

              {closingList &&
                closingList.items.length !== 0 &&
                !hasCancelled && (
                  <>
                    <Separator />

                    <SelectRoot
                      collection={closingList}
                      onValueChange={(event) => {
                        setIdClousing(event.items[0].value);
                      }}
                    >
                      <SelectLabel fontFamily="heading">
                        Lista de cierre de cajas / cierre de lotes
                      </SelectLabel>
                      <SelectTrigger>
                        <SelectValueText placeholder="Seleccione una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        {closingList.items.length > 0 &&
                          closingList.items.map((item: selectOption) => (
                            <SelectItem item={item} key={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </SelectRoot>

                    <SelectRoot
                      collection={reasonsListFilter}
                      onValueChange={(event) => {
                        setReason(event.items[0].value);
                      }}
                    >
                      <SelectLabel fontFamily="heading">Motivo</SelectLabel>
                      <SelectTrigger>
                        <SelectValueText placeholder="Seleccione una opcion" />
                      </SelectTrigger>
                      <SelectContent>
                        {reasonsListFilter.items.length > 0 &&
                          reasonsListFilter.items.map((item: selectOption) => (
                            <SelectItem item={item} key={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </SelectRoot>

                    <Field.Root required>
                      <Field.Label>Comentario</Field.Label>
                      <Textarea
                        variant="outline"
                        value={textareaValue}
                        onChange={handleChange}
                      />
                    </Field.Root>
                  </>
                )}
            </DialogBody>

            <DialogFooter>
              <DialogActionTrigger asChild>
                <Button
                  colorPalette="meraError"
                  onClick={() => handleCancel(true)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </DialogActionTrigger>

              {closingList &&
                closingList.items.length !== 0 &&
                !hasCancelled && (
                  <Button
                    colorPalette="meraPrimary"
                    loading={isLoading}
                    disabled={isLoading}
                    onClick={() => onSubmitForm()}
                  >
                    Guardar
                  </Button>
                )}
            </DialogFooter>
            <DialogCloseTrigger />
          </DialogContent>
        </DialogRoot>
      </>
    );
  }
);
