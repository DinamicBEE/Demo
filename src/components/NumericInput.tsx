import { Group, HStack, Input, InputAddon, Skeleton } from "@chakra-ui/react";
import { CurrencyInputProps, TableInputProps } from "@models/common.model";
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

function TableInput({ value, id, currency, keyValue, onChange, disabled }: TableInputProps) {
    return (
        <NumericFormat
            disabled={disabled || false}
            customInput={Input}
            thousandSeparator=","
            decimalSeparator="."
            prefix={currency ? "$ " : ""}
            textAlign="end"
            decimalScale={currency ? 2 : 0} fixedDecimalScale
            value={value || 0}
            onValueChange={(event) => {
                if (onChange) {
                    const eventValue = event.value;
                    onChange(id, eventValue, keyValue);
                }
            }
            }
        />
    );
}

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