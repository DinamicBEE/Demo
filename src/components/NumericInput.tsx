import { Group, Input, InputAddon } from "@chakra-ui/react";
import { Skeleton } from "@components/ui/skeleton";
import { CurrencyInputProps, TableInputProps } from "@models/common.model";
import { NumericFormat } from 'react-number-format';

function CurrencyInput({ name, value, loading }: CurrencyInputProps) {
    return (
        <Group>
            <InputAddon>{name}</InputAddon>
            <Skeleton loading={loading}>
                <NumericFormat
                    customInput={Input}
                    thousandSeparator=","
                    decimalSeparator="."
                    prefix="$"
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

function EditableCurrencyInput({ name, value, loading, onChange }: CurrencyInputProps) {
    return (
        <Group>
            <InputAddon>{name}</InputAddon>
            <Skeleton loading={loading}>
                <NumericFormat
                    customInput={Input}
                    thousandSeparator=","
                    decimalSeparator="."
                    prefix="$"
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

function TableInput({value, id, currency, keyValue, onChange}: TableInputProps){
    return(
        <NumericFormat
        customInput={Input}
        thousandSeparator=","
        decimalSeparator="."
        prefix={currency ? "$": ""} 
        textAlign="end"
        decimalScale={currency ? 2 : 0} fixedDecimalScale
        value={value  || 0}
        onChange={(event) => {
            if (onChange) {
                const eventValue = event.target.value;
                onChange(id, eventValue, keyValue);
            }}
        }
      />
    );
}

export {CurrencyInput, EditableCurrencyInput, TableInput};