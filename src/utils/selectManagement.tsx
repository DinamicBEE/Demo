import { createListCollection, ListCollection } from "@chakra-ui/react";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "@components/ui/select";
import { SelectHandlerParams } from "@models/common.clousing.model";
import { selectOption } from "@models/common.model";
import { useEffect, useState } from "react";

export const renderMultiSelectWithControls = (
  collection: ListCollection<selectOption>,
  onValueChange: (event: { items: selectOption[] }) => void,
  label: string,
  placeholder: string,
  selectedItems: selectOption[],
  disableCondition: boolean
) => {
  const [value, setValue] = useState<number[]>([])


  const isItemSelected = (item: selectOption) => {
    return selectedItems.some(selected => selected.value === item.value);
  };

  const handleSelectAll = () => {
    
    if (selectedItems.length === collection.items.length) {
      onValueChange({ items: [] });
      setValue([]);
    } else {
      onValueChange({ items: [...collection.items] });
      setValue(collection.items.map(item => item.value));
    }
  };

  useEffect(() => {
    setValue(selectedItems.map(item => item.value));
  }, [selectedItems]);

  const handleChange = (e: any) => {
    onValueChange(e);
    setValue(e.value);
  }


  return (
    <SelectRoot
      multiple={true}
      closeOnSelect={false}
      collection={collection}
      onValueChange={handleChange}
      value={value}
      disabled={disableCondition && collection.items.length === 0}
    >
      <SelectLabel fontFamily="heading">{label}</SelectLabel>
      <SelectTrigger>
        <SelectValueText placeholder={placeholder}
        />
      </SelectTrigger>
      <SelectContent>
        <Box p={2}>
          <HStack mb={2} justify="space-between" gap="4">
            <Button
              size="sm"
              colorPalette={selectedItems.length === collection.items.length ? 'meraWarning' : 'meraPrimary'}
              variant="surface"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectAll();
              }}
            >
              {selectedItems.length === collection.items.length ?
              "Borrar selección"
              :
              "Seleccionar todos"
              }
            </Button>

          </HStack>
        </Box>
        {collection.items.length > 0 &&
          collection.items.map((item: selectOption) => (
            <SelectItem item={item} key={item.value.toString()} 
              bg={isItemSelected(item) ? 'success.100' : 'transparent'}
              _hover={{ bg: 'success.100' }}>
              <HStack>
                <Text>{item.label}</Text>
              </HStack>
            </SelectItem>
          ))}
      </SelectContent>
    </SelectRoot>
  );
};

export const handleMultiSelectChange = <T extends { value: number }>({
  newItems,
  currentSelected,
  setSelectedOptions,
  setSelectedIds
}: SelectHandlerParams<T>) => {

  

  if (newItems.length === 0) {
    setSelectedOptions([]);
    setSelectedIds?.([]);

    return;
    
  }

  const isAdding = newItems.some(newItem => 
    !currentSelected.some(selected => selected.value === newItem.value)
  );
  
  let updatedSelection: T[];

  if (isAdding) {
    updatedSelection = [...currentSelected, ...newItems].reduce(
      (acc: T[], current) => {
        if (!acc.some(item => item.value === current.value)) {
          acc.push(current);
        }
        return acc;
      }, []
    );
  } else {
    updatedSelection = newItems
   /*  updatedSelection = currentSelected.filter(
      item => !newItems.some(newItem => newItem.value == item.value)
    ); */
  }

    setSelectedOptions(updatedSelection);
    if (setSelectedIds) {
      setSelectedIds(updatedSelection.map(item => item.value));
    }
  
};

export const mapToSelectOptions = <T extends { id: number; name: string }>(
  items: T[]
): selectOption[] => items.map((item) => ({
    value: item.id,
    label: item.name,
}));

export const fetchAndSetData = async <T extends { id: number; name: string }>(
  fetchFn: () => Promise<T[]>,
  setter: (data: ReturnType<typeof createListCollection<selectOption>>) => void
) => {
  const data = await fetchFn();
  const options = createListCollection<selectOption>({
    items: mapToSelectOptions(data),
  });
  setter(options);
};