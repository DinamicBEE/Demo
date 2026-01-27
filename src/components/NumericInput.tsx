import { Group, HStack, Input, InputAddon, Skeleton } from "@chakra-ui/react";
import { CurrencyInputProps, TableInputProps } from "@models/common.model";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { NumericFormat } from 'react-number-format';

function CurrencyInput({ name, value, loading }: CurrencyInputProps) {
    return (
        <Group>
            <InputAddon>{name}</InputAddon>
            <Skeleton loading={loading} width={"100%"}>
                <NumericFormat
                    customInput={Input}
                    thousandSeparator=","
                    decimalSeparator="."
                    prefix="$ "
                    textAlign="end"
                    decimalScale={2}
                    fixedDecimalScale
                    value={value || 0}
                    placeholder={name}
                    readOnly
                />
            </Skeleton>
        </Group>
    );
};

function EditableCurrencyInput({ name, value, loading, onChange, disabled }: CurrencyInputProps) {
    return (
        <Group>
            <InputAddon>{name}</InputAddon>
            <Skeleton loading={loading} width={"100%"}>
                <NumericFormat
                    disabled={disabled || false}
                    customInput={Input}
                    thousandSeparator=","
                    decimalSeparator="."
                    prefix="$ "
                    textAlign="end"
                    decimalScale={2}
                    fixedDecimalScale
                    value={value || 0}
                    placeholder={name}
                    onValueChange={(values) => {
                        const { value } = values;
                        if (onChange) {
                            onChange(value);
                        }
                    }}
                />
            </Skeleton>
        </Group>
    );
}

// function TableInput({ value, id, currency, keyValue, onChange, disabled }: TableInputProps) {
//     return (
//         <NumericFormat
//             disabled={disabled || false}
//             customInput={Input}
//             thousandSeparator=","
//             decimalSeparator="."
//             prefix={currency ? "$ " : ""}
//             textAlign="end"
//             decimalScale={currency ? 2 : 0} fixedDecimalScale
//             value={value || 0}
//             onValueChange={(event) => {
//                 if (onChange) {
//                     const eventValue = event.value;
//                     onChange(id, eventValue, keyValue);
//                 }
//             }
//             }
//             isAllowed={(values) => {
//                 const { floatValue } = values;
//                 return floatValue === undefined || floatValue >= 0;
//             }}
//         />
//     );
// }
const TableInput = memo(function TableInput({ 
  value, 
  id, 
  currency, 
  keyValue, 
  onChange, 
  disabled 
}: TableInputProps) {

    const [localValue, setLocalValue] = useState(value?.toString() || '0');
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalValue(value?.toString() || '0');
  }, [value]);
  
//   const handleChange = (event: any) => {
//     if (onChange && event.value !== undefined) {
//       onChange(id, event.value, keyValue);
//     }
//   };

  const debouncedOnChange = useCallback((newValue: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (onChange) {
        onChange(id, newValue, keyValue);
      }
    }, 100);
  }, [id, keyValue, onChange]);

  const handleLocalChange = (event: any) => {
    const newValue = event.value || '0';
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  };

    useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <NumericFormat
      disabled={disabled || false}
      customInput={Input}
      thousandSeparator=","
      decimalSeparator="."
      prefix={currency ? "$ " : ""}
      textAlign="end"
      decimalScale={currency ? 2 : 0}
      fixedDecimalScale
      value={localValue}
      onValueChange={handleLocalChange}
      // Evita re-render innecesarios
    //   isAllowed={(values) => {
    //     const { floatValue } = values;
    //     return floatValue === undefined || floatValue >= 0;
    //   }}
    />
  );
});

function CurrencyInputNumber({
    name,
    value,
    onChange,
    currency = false,
    allowDecimals = true,
    disabled = false,
}: CurrencyInputProps & {
    onChange?: (floatValue: number | undefined) => void;
    allowDecimals?: boolean;
    disabled?: boolean;
}) {

    return (
        <NumericFormat 
            disabled={disabled}
            customInput={Input}
            thousandSeparator=","
            decimalSeparator="."
            prefix={currency ? "$" : ""}
            textAlign="start"
            value={value || ""}
            placeholder={name}
            allowNegative={false} // Evita valores negativos
            decimalScale={allowDecimals ? 2 : 0} // Controla la cantidad de decimales
            fixedDecimalScale={allowDecimals} // Fija la cantidad de decimales solo si están permitidos
            onValueChange={(values) => {
                if (onChange) {
                    onChange(values.floatValue); // Asegura que se pase un número
                }
            }}
        />
    );
}

export { CurrencyInput, EditableCurrencyInput, TableInput, CurrencyInputNumber };