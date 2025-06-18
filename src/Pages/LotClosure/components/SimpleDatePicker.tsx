import React, { useState, useEffect, forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import { es } from "date-fns/locale/es";
import { Input } from '@chakra-ui/react';

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
    focusRingColor={"green.400"}
    placeholder="Selecciona una fecha"
    autoComplete="off"
  />
);
customDateInput.displayName = "DateInput";

const CustomInput = forwardRef(customDateInput);

const SimpleDatePicker: React.FC<DatePickerProps> = ({ onDateChange, initialDate }) => {
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
        onChange={(date: Date | null) => setSelectedDate(date)}
        isClearable={true}
        dateFormat="yyyy-MM-dd"
        placeholderText="Selecciona una fecha"
        customInput={<CustomInput />}
        className="react-datapicker__input-text"
        locale={es}
      />
  );
};

export default SimpleDatePicker;