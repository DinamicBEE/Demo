import { Group, Input, InputAddon } from "@chakra-ui/react";
import { Skeleton } from "@components/ui/skeleton";
import { NumericFormat } from 'react-number-format';

function CurrencyInput({ name, value, loading }) {
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

function EditableCurrencyInput({ name, value, loading, onChange }) {
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
                        onChange(value);
                    }}
                />
            </Skeleton>    
        </Group>
    );
}

function TableInput({value, id, onChange}){
    return(
        <NumericFormat
        customInput={Input}
        thousandSeparator=","
        decimalSeparator="."
        prefix="$" 
        textAlign="end"
        decimalScale={2} fixedDecimalScale
        value={value  || 0}
        onChange={(event) => {
            onChange(id, event.target.value)}
        }
      />
    );
}

export {CurrencyInput, EditableCurrencyInput, TableInput};