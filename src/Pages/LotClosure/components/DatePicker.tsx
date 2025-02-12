import { forwardRef, useState } from "react";
import ReactDatePicker from "react-datepicker";
import {
  Button,
  createListCollection,
  HStack,
  Input,
  NativeSelectField,
  NativeSelectRoot,
} from "@chakra-ui/react";
import "./DatePicker.css";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { getYear, getMonth } from "date-fns";


const customDateInput = ({ value, onClick, onChange }: any, ref: any) => (
  <Input
    value={value}
    ref={ref}
    onClick={onClick}
    onChange={onChange}
    placeholder="Selecciona un rango de fechas"
  />
);
customDateInput.displayName = "DateInput";

const CustomInput = forwardRef(customDateInput);

interface Props {
  isClearable?: boolean;
  onChange: (dates: [Date | null, Date | null]) => void;
  endDate: Date | null;
  startDate: Date | null;
  showPopperArrow?: boolean;
}

const DatePicker = ({ endDate, startDate, onChange }: Props) => {
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
        customInput={<CustomInput />}
        className="react-datapicker__input-text"
        locale={es}
        renderCustomHeader={({
          date,
          decreaseMonth,
          increaseMonth,
          changeYear,
          changeMonth,
        }) => (
          <HStack>
            <Button size="xs" variant="plain" onClick={decreaseMonth}>
              <FaArrowLeft />
            </Button>

            <NativeSelectRoot size={"xs"} variant={"plain"}>
              <NativeSelectField
                value={getYear(date)}
                onChange={({ target: { value } }) => changeYear(Number(value))}
              >
                {years.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>

            <NativeSelectRoot size={"xs"} variant={"plain"}>
              <NativeSelectField
                value={months[getMonth(date)]}
                onChange={({ target: { value } }) =>
                  changeMonth(months.indexOf(value))
                }
              >
                {months.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </NativeSelectField>
            </NativeSelectRoot>

            <Button size="xs" variant="plain" onClick={increaseMonth}>
              <FaArrowRight />
            </Button>
          </HStack>
        )}
      />
    </>
  );
};

export default DatePicker;
