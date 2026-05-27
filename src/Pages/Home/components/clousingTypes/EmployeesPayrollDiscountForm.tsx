import {
  Box,
  createListCollection,
  FieldLabel,
  FieldRoot,
  HStack,
  Input,
  NumberInputControl,
  NumberInputInput,
  NumberInputRoot,
  VStack,
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
  DialogCloseTrigger,
  DialogFooter,
} from "@components/ui/dialog";
import {
  EmployeePayrollDiscountProps,
  PdfRequestNSDto,
} from "@models/employee.model";
import SimpleDatePicker from "../../../LotClosure/components/SimpleDatePicker";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@components/ui/button";
import { getPDF } from "@services/clousingService";
import Loading from "@components/Loading";
import { Toaster, toaster } from "@components/ui/toaster";

const defaultPdfData: Partial<PdfRequestNSDto> = {
  pdf: true,
  lastname: "",
  entityid: "",
  title: "",
  department: "",
};
const quincena = createListCollection({
  items: [
    { value: "PRIMERA", label: "Primera" },
    { value: "SEGUNDA", label: "Segunda" },
  ],
});

function EmployeesPayrollDiscountForm({
  line,
  isOpen,
  onClose,
  subsidiaryId,
}: EmployeePayrollDiscountProps) {
  const [data, setData] = useState<PdfRequestNSDto>({} as PdfRequestNSDto);
  const [loading, setLoading] = useState(false);
  const [creationDate, setCreationDate] = useState<string>("");
  const [totalQuincenas, setTotalQuincenas] = useState("1");
  const [mes, setMes] = useState("1");
  const [anio, setAnio] = useState("2025");
  const [importeDescuento, setImporteDescuento] = useState("0");
  const [montoAdeudo, setMontoAdeudo] = useState("0");
  const [quincenaSelected, setQuincenaSelected] = useState("PRIMERA");

  // Fecha actual en formato local yyyy-mm-dd
  const getDefaultDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Convierte "yyyy-mm-dd" a Date local
  const parseLocalDate = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  // Construye los datos base para el PDF
  const buildBasePdfData = useCallback((): PdfRequestNSDto => {
    const date = creationDate ? parseLocalDate(creationDate) : new Date();
    return {
      ...data,
      idCxcEmployee: Number(line.id),
      firstname: line.employeeName || "",
      lastname: "",
      subsidiary: subsidiaryId.toString(),
      internalid: line.employeeId?.toString(),
      motivos: line.reason || "",
      delAnio: anio,
      delMes: mes,
      apartirQuincena: quincenaSelected,
      importeDescuento: Number(importeDescuento),
      montoAdeudo: Number(montoAdeudo),
      numQuincenas: Number(totalQuincenas) || 1,
      dia: String(date.getDate()),
      mes: String(date.getMonth() + 1),
      anio: String(date.getFullYear()),
      pdf: true,
    } as PdfRequestNSDto;
  }, [
    line,
    subsidiaryId,
    creationDate,
    anio,
    mes,
    importeDescuento,
    montoAdeudo,
    totalQuincenas,
    quincenaSelected,
    data,
  ]);

  // Fusiona datos backend > actuales > defaults
  const mergePdfData = useCallback(
    (
      backendData: Partial<PdfRequestNSDto>,
      currentData: PdfRequestNSDto
    ): PdfRequestNSDto => ({
      ...defaultPdfData,
      ...currentData,
      ...backendData,
      idCxcEmployee: Number(line.id),
      firstname: line.employeeName || "",
      lastname: "",
      subsidiary: subsidiaryId.toString(),
      internalid: line.employeeId?.toString(),
      motivos: line.reason || "",
      pdf: true,
    }),
    [line, subsidiaryId]
  );

  // Reset total de estados
  const resetStates = useCallback(() => {
    setCreationDate(getDefaultDate());
    setTotalQuincenas("1");
    setMes("1");
    setAnio(new Date().getFullYear().toString());
    setMontoAdeudo(line.amount?.toString() || "0");
    setImporteDescuento("0");
    setQuincenaSelected("PRIMERA");
    setData({} as PdfRequestNSDto);
  }, [line.amount]);

  // Actualiza estados del formulario con datos del backend
  const updateFormStates = (pdfData: PdfRequestNSDto) => {
    if (pdfData.anio && pdfData.mes && pdfData.dia) {
      const formattedDate = `${pdfData.anio}-${pdfData.mes.padStart(2, "0")}-${pdfData.dia.padStart(2, "0")}`;
      setCreationDate(formattedDate);
    } else {
      setCreationDate(getDefaultDate());
    }

    setQuincenaSelected(pdfData.apartirQuincena || "PRIMERA");
    setAnio(pdfData.delAnio || new Date().getFullYear().toString());
    setMes(pdfData.delMes || "1");
    setTotalQuincenas(pdfData.numQuincenas?.toString() || "1");
    setMontoAdeudo(pdfData.montoAdeudo?.toString() || "0");
    const total = Number(pdfData.numQuincenas) || 1;
    const adeudo = Number(pdfData.montoAdeudo) || 0;
    const descuento = total > 0 ? adeudo / total : 0;
    setImporteDescuento(descuento.toFixed(2));
  };

  // Cargar datos al abrir el diálogo
  useEffect(() => {
    if (!line || !isOpen) return;

    const fetchPDFData = async () => {
      setLoading(true);
      try {
        const response = await getPDF({
          idCxcEmployee: Number(line.id),
          pdf: false,
        });
        const baseData = buildBasePdfData();
        const backendData = response?.pdfRequestNSDto;

        const mergedData = backendData
          ? mergePdfData(backendData, baseData)
          : { ...baseData, montoAdeudo: Number(line.amount) || 0 };

        setData(mergedData);
        updateFormStates(mergedData);
      } catch (error) {
        console.error("Error al cargar PDF data:", error);
        toaster.create({
          title: "Error al cargar información",
          description: "No fue posible obtener los datos del empleado.",
          type: "error",
          duration: 4000,
        });
        resetStates();
      } finally {
        setLoading(false);
      }
    };

    fetchPDFData();
  }, [line, isOpen]);

  // Limpiar estados al cerrar
  useEffect(() => {
    if (!isOpen) resetStates();
  }, [isOpen, resetStates]);

  // Recalcular importeDescuento cada vez que cambian monto o quincenas
  useEffect(() => {
    const total = Number(totalQuincenas) || 1;
    const adeudo = Number(montoAdeudo) || 0;
    const descuento = total > 0 ? adeudo / total : 0;
    setImporteDescuento(descuento.toFixed(2));
  }, [montoAdeudo, totalQuincenas]);

  // Guardar y generar PDF
  const handleSave = async () => {
    try {
      if (Number(montoAdeudo) <= 0) {
        toaster.create({
          title: "Monto inválido",
          description: "El monto del adeudo debe ser mayor a 0.",
          type: "error",
          duration: 4000,
        });
        return;
      }

      setLoading(true);
      const finalData = buildBasePdfData();
      const response = await getPDF(finalData);
      if (response && response.b64) {
        toaster.create({
          title: "PDF generado correctamente",
          description: "Se ha generado el acuse de descuento.",
          type: "success",
          duration: 4000,
        });
        onClose();
      }
    } catch (error) {
      console.error("Error al generar PDF:", error);
      toaster.create({
        title: "Error al generar PDF",
        description:
          "Ocurrió un problema al generar el acuse. Intente nuevamente.",
        type: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const initialParsedDate = useMemo(() => {
    return creationDate ? parseLocalDate(creationDate) : new Date();
  }, [creationDate]);

  return (
    <>
      <DialogRoot
        open={isOpen}
        closeOnEscape={false}
        closeOnInteractOutside={false}
        scrollBehavior="inside"
        onOpenChange={onClose}
      >
        <DialogContent>
          <DialogHeader bg="#7ca1ee" color="white" style={{ borderRadius: '6px 6px 0px 0px' }}>
            <DialogTitle fontWeight="medium" fontSize="xl">Generación de formato de descuento de nómina</DialogTitle>
            <DialogCloseTrigger onClick={() => onClose()} color="#166534" />
          </DialogHeader>

          <DialogBody>
            <VStack gap="6">
              {/* Campos fijos */}
              <FieldRoot w="100%">
                <FieldLabel>Nombre del Empleado</FieldLabel>
                <Input disabled value={line.employeeName || "-"} />
              </FieldRoot>

              <FieldRoot w="100%">
                <FieldLabel>Motivo</FieldLabel>
                <Input disabled value={line.reason || "-"} />
              </FieldRoot>

              <FieldRoot w="100%">
                <FieldLabel>Fecha de creación</FieldLabel>
                <SimpleDatePicker
                  initialDate={initialParsedDate}
                  onDateChange={setCreationDate}
                />
              </FieldRoot>

              {/* Monto y descuento */}
              <HStack w="100%" justifyContent="space-between">
                <FieldRoot w="100%">
                  <FieldLabel>Monto del adeudo</FieldLabel>
                  <NumberInputRoot
                    w="100%"
                    value={montoAdeudo}
                    onValueChange={(e) => setMontoAdeudo(e.value)}
                    disabled={loading}
                  >
                    <NumberInputControl />
                    <NumberInputInput />
                  </NumberInputRoot>
                </FieldRoot>

                <FieldRoot w="100%">
                  <FieldLabel>Descuento por quincena</FieldLabel>
                  <NumberInputRoot w="100%" value={importeDescuento} disabled>
                    <NumberInputControl />
                    <NumberInputInput />
                  </NumberInputRoot>
                </FieldRoot>
              </HStack>

              {/* Quincenas */}
              <HStack w="100%" justifyContent="space-between">
                <FieldRoot w="100%">
                  <FieldLabel>Total de quincenas</FieldLabel>
                  <NumberInputRoot
                    w="100%"
                    min={1}
                    max={24}
                    value={totalQuincenas}
                    onValueChange={(e) => setTotalQuincenas(e.value)}
                    disabled={loading}
                  >
                    <NumberInputControl />
                    <NumberInputInput />
                  </NumberInputRoot>
                </FieldRoot>

                <SelectRoot
                  w="100%"
                  collection={quincena}
                  value={[quincenaSelected]}
                  onValueChange={(e) => setQuincenaSelected(e.value[0])}
                  disabled={loading}
                >
                  <SelectLabel>Desde la quincena</SelectLabel>
                  <SelectTrigger>
                    <SelectValueText placeholder="Seleccione una quincena" />
                  </SelectTrigger>
                  <SelectContent>
                    {quincena.items.map((item) => (
                      <SelectItem key={item.value} item={item}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </HStack>

              {/* Mes / Año */}
              <HStack w="100%" justifyContent="space-between">
                <FieldRoot w="100%">
                  <FieldLabel>Mes de inicio de aplicación</FieldLabel>
                  <NumberInputRoot
                    w="100%"
                    min={1}
                    max={12}
                    value={mes}
                    onValueChange={(e) => setMes(e.value)}
                    disabled={loading}
                  >
                    <NumberInputControl />
                    <NumberInputInput />
                  </NumberInputRoot>
                </FieldRoot>

                <FieldRoot w="100%">
                  <FieldLabel>Año de inicio de aplicación</FieldLabel>
                  <NumberInputRoot
                    w="100%"
                    min={2025}
                    max={2030}
                    value={anio}
                    onValueChange={(e) => setAnio(e.value)}
                    disabled={loading}
                  >
                    <NumberInputControl />
                    <NumberInputInput />
                  </NumberInputRoot>
                </FieldRoot>
              </HStack>
            </VStack>
          </DialogBody>

          <DialogFooter >
            <Button
              colorPalette="meraError"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              colorPalette="meraPrimary"
              onClick={handleSave}
              loading={loading}
              disabled={loading}
            >
              Generar formato
            </Button>
          </DialogFooter>

        </DialogContent>

      </DialogRoot>
      <Toaster />
      {loading && (
        <Box position="fixed" top="50%" left="50%" zIndex={900000}>
          <Loading />
        </Box>
      )}
    </>
  );
}

export default EmployeesPayrollDiscountForm;
