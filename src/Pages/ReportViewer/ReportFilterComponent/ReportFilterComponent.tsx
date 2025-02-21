import { useState } from "react";
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
import { CheckedChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/checkbox/namespace";


export const ReportFilterComponent = () => {
  const { report, setReport, respaldo, resetRows } = useReportContext();
  const { rows, headers } = report;
  const [cdcSelected, setCdcSelected] = useState({ label: "", value: 0 });
  const [empSelected, setEmpSelected] = useState({ label: "", value: 0 });
  const [confirmedChecked, setConfirmedChecked] = useState(false);
  const [diferenceChecked, setDiferenceChecked] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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

  const applyFilters = () => {
    let filteredRows = [...respaldo];

    if (cdcSelected.label !== "") {
      console.log("entramos cdcSelected");
      
      filteredRows = filteredRows.filter((row) => 
        row.data.some((item) => item.code === "cdc" && item.value.toString() === cdcSelected.label));
    }

    if (empSelected.label !== "") {
      console.log("entramos empSelected");
      console.log(empSelected.label);

      filteredRows = filteredRows.filter((row) => row.approved.name === empSelected.label);
    }

    if (startDate !== null && endDate !== null) {
      console.log("entramos date");

      filteredRows = filteredRows.filter((row) => {
        const rowDateStr = row.data.find((item) => item.code === "date")?.value.toString();
        const rowDate = rowDateStr ? new Date(rowDateStr.split("/").reverse().join("-")) : null;
        return rowDate && rowDate >= startDate && rowDate <= endDate;
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
    console.log(filteredRows);
    
  };

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

            <Button className="primary-button-filter" onClick={ () => applyFilters()}>
              Buscar <RiFilterLine />
            </Button>
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
