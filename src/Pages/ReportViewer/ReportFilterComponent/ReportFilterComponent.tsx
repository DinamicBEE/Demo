import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
registerLocale("es", es);
import {
  Box,
  VStack,
  HStack,
  Field,
  SelectValueChangeDetails,
  createListCollection,
  Button,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import {
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@components/ui/select";
import { RiFilterLine } from "react-icons/ri";
import { Checkbox } from "@components/ui/checkbox";
import "./ReportFilter.css";
import { generateReportCSV } from "@services/reportService";
import { useReportContext } from "@context/reports/reportsContext";


export const ReportFilterComponent = () => {
  const { report, setReport, respaldo, resetRows } = useReportContext();
  const { rows, headers } = report;
  const [cdcSelected, setCdcSelected] = useState({ label: "", value: 0 });
  const [empSelected, setEmpSelected] = useState({ label: "", value: 0 });
  const [confirmedChecked, setConfirmedChecked] = useState(false);
  const [diferenceChecked, setDiferenceChecked] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);


  useEffect(() => {
    if (cdcSelected == undefined) { setCdcSelected({ label: "", value: 0 }) }
    if (empSelected == undefined) { setEmpSelected({ label: "", value: 0}) }
 
  }, [cdcSelected, empSelected]);
  

  const handleSelectChange = (e: SelectValueChangeDetails, id: string) => {
    let selection;
    switch (id) {
      case "cdc":
        selection = cdc.items
          .filter((item) => Number(e.value[0]) === item.value)
          .map((item) => {
            return {
              value: item.value,
              label: item.label,
            };
          });
        setCdcSelected(selection[0]);
        break;

      case "emp":
        selection = employees.items
          .filter((item) => Number(e.value[0]) === item.value)
          .map((item) => {
            return {
              value: item.value,
              label: item.label,
            };
          });
        setEmpSelected(selection[0]);
        break;

      default:
        break;
    }
  };

  const handleChange = (range: [Date | null, Date | null]) => {
    const [startDate, endDate] = range;
    setStartDate(startDate);
    setEndDate(endDate);
    console.log(range);
  };

  const applyFilters = async () => {
    let filteredRows = [...respaldo];
    setConfirmLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 5000)); 
    if (cdcSelected.label !== "") {
      
      filteredRows = filteredRows.filter((row) => 
        row.data.some((item) => item.code === "cdc" && item.value.toString() === cdcSelected.label));
    }

    if (empSelected.label !== "") {
      console.log("entramos empSelected");
      console.log(empSelected.label);

      filteredRows = filteredRows.filter((row) => row.approved.name === empSelected.label);
    }

    if (startDate !== null && endDate !== null) {
      filteredRows = filteredRows.filter((row) => {
        const rowDateStr = row.data.find((item) => item.code === "date")?.value.toString();
        if (!rowDateStr) return false;
    
        const dateParts = rowDateStr.split("/");
        const year = parseInt(dateParts[2], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const day = parseInt(dateParts[0], 10);
    
        // Crear rowDate en UTC
        const rowDate = new Date(Date.UTC(year, month, day));
    
        // Asegurar que startDate y endDate también están en UTC
        const startDateUTC = new Date(Date.UTC(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()));
        const endDateUTC = new Date(Date.UTC(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()));
    
        console.log(rowDateStr, rowDate, startDateUTC, endDateUTC);
    
        return rowDate >= startDateUTC && rowDate <= endDateUTC;
    });
    }

    if (diferenceChecked) {
      
      filteredRows = filteredRows.filter((row) => {
        const nsTotal = row.data.find(d => d.code === "ns_total")?.value;
        const posTotal = row.data.find(d => d.code === "pos_total")?.value;
        return nsTotal !== posTotal;
      });
    }

    if (confirmedChecked === true) {
      console.log("entramos confirmedChecked");

      filteredRows = filteredRows.filter((row) => row.confirmed === false);
    }
    
    setReport({headers: headers, rows: filteredRows});
    setConfirmLoading(false);
    console.log(filteredRows);
    
  };

    const getConfirmationButton = () => {
      if (!confirmLoading) {
        return <Button className="primary-button-filter" onClick={ () => applyFilters()}>
      Buscar <RiFilterLine />
      </Button>
  
      } else {
        return <Button 
        className="primary-button-filter"
        disabled={true}
        >
          Buscando... <Spinner size="sm" />
        </Button>
      }
    }

  const resetFilters = () => {
    setCdcSelected({ label: "", value: 0 });
    setEmpSelected({ label: "", value: 0 });
    setConfirmedChecked(false);
    setDiferenceChecked(false);
    setStartDate(null);
    setEndDate(null);
    resetRows();

  }

  return (
    <>
      <Box p={6} bg="white">
        <VStack align="flex-start">
          <p>Filtros</p>
          <Flex
            align="stretch"
            justify="space-between"
            w="100%"
            direction="row"
            gap="10px"
          >
            <SelectRoot
              width="100%"
              collection={cdc}
              // value={cdcSelected}
              onValueChange={(e) => handleSelectChange(e, "cdc")}
            >
              <SelectLabel>Centro de Consumo</SelectLabel>
              <SelectTrigger clearable>
                <SelectValueText placeholder="Selecciona CDC" />
              </SelectTrigger>
              <SelectContent>
                {cdc.items.map((c) => (
                  <SelectItem item={c} key={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>

            <SelectRoot
              collection={employees}
              // value={cdcSelected}
              onValueChange={(e) => handleSelectChange(e, "emp")}
            >
              <SelectLabel>Empleado</SelectLabel>
              <SelectTrigger clearable>
                <SelectValueText placeholder="Selecciona Empleado" />
              </SelectTrigger>
              <SelectContent>
                {employees.items.map((c) => (
                  <SelectItem item={c} key={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </SelectRoot>

            <Field.Root w="100%">
              <Field.Label>Seleccione rango de fechas</Field.Label>
              <DatePicker
                selected={startDate}
                onChange={(ev) => handleChange(ev)}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                locale="es"
                className="calendar"
              />
            </Field.Root>
            {getConfirmationButton()}
          </Flex>
          <HStack
            gap="6"
            w="100%"
          >
            <Field.Root flexDirection="row" w="20%">
              <Field.Label>Diferencia</Field.Label>
              <Checkbox
                checked={diferenceChecked}
                onCheckedChange={() => setDiferenceChecked(!diferenceChecked)}
              />
            </Field.Root>

            <Field.Root flexDirection="row"  w="20%">
              <Field.Label >No Confirmados</Field.Label>
              <Checkbox
                checked={confirmedChecked}
                onCheckedChange={() => setConfirmedChecked(!confirmedChecked)}
              />
            </Field.Root>

            <Button justifySelf="end" onClick={resetFilters}> Borrar filtro </Button>

          </HStack>
          <Box width="100%" textAlign="center">
            <Button className="secondary-button-filter" onClick={() => generateReportCSV(rows)} >
              Exportar a Excel
            </Button>
          </Box>
        </VStack>
      </Box>
    </>
  );
};

const cdc = createListCollection({
  items: [
    {
      value: 1,
      label: "Starbucks",
    },
    {
      value: 2,
      label: "Domino's",
    },
    {
      value: 3,
      label: "Pizza Hut",
    },
    {
      value: 4,
      label: "Burguer King",
    },
    {
      value: 5,
      label: "VIPS",
    },
  ],
});

const employees = createListCollection({
  items: [
    {
      value: 1,
      label: "Meraway",
    },
    {
      value: 2,
      label: "Carmela Brings",
    },
    {
      value: 3,
      label: "Juan Perez",
    },
    {
      value: 4,
      label: "Janet Weaver",
    },
  ],
});
