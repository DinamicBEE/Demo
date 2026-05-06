import { useEffect, useState } from "react";
import { Box, Button, HStack, useFilter, useListCollection } from "@chakra-ui/react";
import { ComboboxContent, ComboboxControl, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxRoot, ComboboxLabel } from "@components/ui/combobox";
import { ComboBoxCustomProps, selectOption } from "@models/common.model";


function ComboBoxCustom(  {multiple, options, label, onValueChange, selectedValues, disableCondition}: ComboBoxCustomProps  ){

    const [value, setValue] = useState<string[]>([]);
    const { contains } = useFilter({ sensitivity: "base" });
    
    const { collection, filter, reset } = useListCollection({
        initialItems: options,
        filter: contains,
    });

    useEffect(() => {
        reset();
        collection.setItems(options);
    }, [options]);

    useEffect(()=>{
        setValue(selectedValues);
    },[selectedValues])

    const handleValueChange = (e: any) => {
        if(multiple && e.value.length > 2){
            const lastValue = e.value.at(-1).toString();
            const arrayWithoutLast = e.value.slice(0, -1)
            const index = arrayWithoutLast.indexOf(lastValue);
            if (index > -1) {
                arrayWithoutLast.splice(index, 1);
                onValueChange(arrayWithoutLast);
                setValue(arrayWithoutLast);
                return;
            }
        }
        
        onValueChange(e.value);
        setValue(e.value);
    };

    const isItemSelected = (item: selectOption) => {
        return value.some(selected => Number(selected) === item.value);
    };

    const handleSelectAll = () => {
    
        if (value.length === collection.items.length) {
            onValueChange([]);
            setValue([]);
        } else {
            onValueChange(collection.items.map(item => item.value.toString()));
            setValue(collection.items.map(item => item.value.toString()));
        }
    };

    return (
        <ComboboxRoot
            multiple={multiple}
            selectionBehavior="preserve"
            openOnClick
            collection={collection}
            onInputValueChange={(e) => filter(e.inputValue)}
            value={value}
            onValueChange={handleValueChange}
            width="100%"
            disabled={disableCondition || collection.items.length === 0}
            onOpenChange={(e) => { if (e.open) filter(""); } }
        >
            <ComboboxLabel>{label}</ComboboxLabel>
            <ComboboxControl clearable>
                <ComboboxInput
                    placeholder={
                        value.length === 0 ? "Seleccione un opción" : 
                        value.length === 1 ? collection.items.find(item => item.value === Number(value[0]))?.label :
                        `${value.length} seleccionados`
                    }
                />
            </ComboboxControl>
            <ComboboxContent>
                {multiple && (
                    <Box p={2}>
                        <HStack mb={2} justify="space-between" gap="4">
                                <Button
                                    size="sm"
                                    colorPalette={value.length === collection.items.length ? 'meraWarning' : 'meraPrimary'}
                                    variant="surface"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectAll();
                                    }}
                                >
                                    { value.length === collection.items.length ?
                                        "Borrar selección"
                                        :
                                        "Seleccionar todos"
                                    }
                                </Button>
                        </HStack>
                    </Box>
                )}
                {collection.items.length > 0 ?
                    (collection.items.map((item) => (
                        <ComboboxItem item={item} key={item.value}
                            bg={isItemSelected(item) ? 'success.100' : 'transparent'}
                            _hover={{ bg: 'success.100' }}
                        >
                            {item.label}
                        </ComboboxItem>
                    ))) : (
                        <ComboboxEmpty px={4} py={2}>
                            {"No se encontraron " + label }
                        </ComboboxEmpty>
                    )
                }
            </ComboboxContent>

        </ComboboxRoot>
    )
}

export default ComboBoxCustom;