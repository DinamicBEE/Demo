import { ListCollection } from "@chakra-ui/react";
import { Box, Button, HStack, Text } from "@chakra-ui/react";
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from "@components/ui/select";
import { SelectHandlerParams } from "@models/common.clousing.model";
import { selectOption } from "@models/common.model";

export const renderMultiSelectWithControls = (
  collection: ListCollection<selectOption>,
  onValueChange: (event: { items: selectOption[] }) => void,
  label: string,
  placeholder: string,
  selectedItems: selectOption[]
) => {
  const isItemSelected = (item: selectOption) => {
    return selectedItems.some(selected => selected.value === item.value);
  };

  const handleSelectAll = () => {
    onValueChange({ items: [...collection.items] });
  };

  return (
    <SelectRoot
      multiple={true}
      collection={collection}
      value={selectedItems.map(item => item.value.toString())}
      onValueChange={onValueChange}
    >
      <SelectLabel fontFamily="heading">{label}</SelectLabel>
      <SelectTrigger>
        <SelectValueText placeholder={placeholder} />
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
                handleSelectAll()
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
            <SelectItem item={item} key={item.value} 
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

  const isAdding = !newItems.some(newItem => 
    currentSelected.some(selected => selected.value === newItem.value)
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
    updatedSelection = currentSelected.filter(
      item => !newItems.some(newItem => newItem.value === item.value)
    );
  }

  setSelectedOptions(updatedSelection);
  setSelectedIds?.(updatedSelection.map(item => item.value));
};