import { useState } from "react";
import { CustomerFilter, EmployeeFilterProps } from "@models/employee.model";
import {
  Box,
  FieldLabel,
  FieldRoot,
  useFilter,
  useListCollection,
} from "@chakra-ui/react";
import {
  ComboboxContent,
  ComboboxControl,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxRoot,
} from "./ui/combobox";

function FilterCustomer({
  customers,
  label,
  itemId,
  customerSelect,
  onSelect,
  disabled,
}: CustomerFilter) {
  const [value, setValue] = useState<string[]>([]);
  const { contains } = useFilter({ sensitivity: "base" });
  const { collection, filter } = useListCollection({
    initialItems: customers,
    filter: contains,
    limit: 30,
  });

  const handleInputChange = (e: any) => {
    setValue(e.value);
    if (e.items && e.items.length > 0) { 
      onSelect({
          label: e.items[0].label,
          value: e.items[0].value,
        });
    }
  };

  return (
    <Box>
      <FieldRoot>
        {label && <FieldLabel>Cliente</FieldLabel>}
        <ComboboxRoot
          size={"sm"}
          openOnClick
          collection={collection}
          onInputValueChange={(e) => filter(e.inputValue)}
          value={value}
          onValueChange={handleInputChange}
          w={"100%"}
          disabled={disabled}
        >
          <ComboboxControl clearable={label}>
            <ComboboxInput
              placeholder={customerSelect || "Seleccione un cliente"}
              
            />
          </ComboboxControl>
          <ComboboxContent>
            <ComboboxEmpty px={4} py={2}>
              No se encontraron clientes
            </ComboboxEmpty>
            {collection.items.map((item) => (
              <ComboboxItem item={item} key={item.value}>
                {item.label}
              </ComboboxItem>
            ))}
          </ComboboxContent>
        </ComboboxRoot>
      </FieldRoot>
    </Box>
  );
}

export default FilterCustomer;
