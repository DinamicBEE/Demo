import { forwardRef } from "react";
import ReactDatePicker from "react-datepicker";
import {
  Button,
  HStack,
  Input,
  NativeSelectField,
  NativeSelectRoot,
} from "@chakra-ui/react";
import "./DatePicker.css";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import { getYear, getMonth } from "date-fns";
import { DatePickerProps } from "@models/lotClosure.model";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const customDateInput = ({ value, onClick, onChange }: any, ref: any) => (
  <Input
    value={value}
    ref={ref}
    onClick={onClick}
    onChange={onChange}
    placeholder="Selecciona un rango de fechas"
    autoComplete="off"
    focusRingColor= "#e4e4e7"
    borderWidth={"1px"}
    w={"100%"}
  />
);
customDateInput.displayName = "DateInput";

const CustomInput = forwardRef(customDateInput);


const DatePicker = ({ endDate, startDate, onChange }: DatePickerProps) => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const years = Array.from(
    { length: new Date().getFullYear() - 1990 + 1 },
    (_, i) => 1990 + i
  );
  return (
    <>
      <ReactDatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
        isClearable={true}
        dateFormat="dd/MM/yyyy"
        customInput={<CustomInput />}
        locale={es}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          changeYear,
          changeMonth,
        }) => (
          <HStack>
            <Button
              size="xs"
              variant="plain"
              onClick={decreaseMonth}
              color={"white"}
            >
              <MdChevronLeft/>
            </Button>

            <NativeSelectRoot size={"xs"} variant={"plain"}>
              <NativeSelectField
                color={'white'}
                fontWeight={"bold"}
                value={getYear(date)}
                onChange={({ target: { value } }) => changeYear(Number(value))}
              >
                {years.map((option) => (
                  <option key={option} value={option} style={{color: "black", fontWeight: "normal"}}>
                    {option}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>

            <NativeSelectRoot size={"xs"} variant={"plain"}>
              <NativeSelectField
                color={'white'}
                fontWeight={"bold"}
                value={months[getMonth(date)]}
                onChange={({ target: { value } }) =>
                  changeMonth(months.indexOf(value))
                }
              >
                {months.map((option) => (
                  <option key={option} value={option} style={{color: "black", fontWeight: "normal"}}>
                    {option}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>

            <Button
              size="xs"
              color={"white"}
              variant="plain"
              onClick={increaseMonth}
            >
              <MdChevronRight/>
            </Button>
          </HStack>
        )}
      />
    </>
  );
};

export default DatePicker;
