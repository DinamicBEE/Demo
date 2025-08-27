import React, { useState, useEffect, forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import { es } from "date-fns/locale/es";
import { Button, HStack, Input, NativeSelectField, NativeSelectRoot } from '@chakra-ui/react';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { getYear, getMonth } from "date-fns";
import "./DatePicker.css";
import "react-datepicker/dist/react-datepicker.css";
import { MiddlewareReturn } from '@floating-ui/core';
import { MiddlewareState } from '@floating-ui/dom';
import { zIndex } from '../../../theme/tokens/z-index';
interface DatePickerProps {
  onDateChange: (formattedDate: string) => void;
  initialDate?: Date;
}

const customDateInput = ({ value, onClick, onChange }: any, ref: any) => (
  <Input
    value={value}
    ref={ref}
    onClick={onClick}
    onChange={onChange}
    focusRing={"none"}
    placeholder="Selecciona una fecha"
    autoComplete="off"
  />
);
customDateInput.displayName = "DateInput";

const CustomInput = forwardRef(customDateInput);

const SimpleDatePicker: React.FC<DatePickerProps> = ({ onDateChange, initialDate }) => {
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
  // Estado para almacenar la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate || new Date());

  // Función para formatear la fecha como YYYY-MM-DD
  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Efecto para notificar al padre cuando cambia la fecha
  useEffect(() => {
    onDateChange(formatDate(selectedDate));
  }, [selectedDate, onDateChange]);

  return (
    <ReactDatePicker
      selected={selectedDate}
      popperProps={{strategy: 'fixed'}} 
      onChange={(date: Date | null) => setSelectedDate(date)}
      isClearable={true}
      dateFormat="dd/MM/yyyy"
      placeholderText="Selecciona una fecha"
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
  );
};

export default SimpleDatePicker;