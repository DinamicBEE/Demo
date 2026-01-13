import { useEffect, useState, useMemo } from "react";
import { Employee, EmployeeFilterProps } from "@models/employee.model";
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

function FilterEmployee({
  employees,
  label,
  itemId,
  onSelect,
  disabled,
  employeeToEdit,
}: EmployeeFilterProps) {
  const [value, setValue] = useState<string[]>([]);

  const employeeOptions = useMemo(() => {    
    return employees.map((employee) => ({
      label: employee.name,
      value: employee.id.toString(),
    }));
  }, [employees]);

  const { contains } = useFilter({ sensitivity: "base" });

  const { collection, filter } = useListCollection({
    initialItems: employeeOptions,
    filter: contains,
    limit: 200,
  });

  useEffect(() => {
    collection.setItems(employeeOptions);
  }, [employees]);

  useEffect(() => {
    if (employeeToEdit?.id) {
      setValue([employeeToEdit.id.toString()]);
    } else {
      setValue([]);
    }
  }, [employeeToEdit]);

  const handleValueChange = (e: any) => {
    setValue(e.value);
    if (e.items && e.items.length > 0) {
      const employeeSelect = employees.find(
        (employee) => employee.id === Number(e.value[0])
      );
      onSelect(
        employeeSelect ? employeeSelect : ({ id: 0, name: "" } as Employee)
      );
    }
  };

  return (
    <Box>
      <FieldRoot>
        {label && <FieldLabel>Empleado</FieldLabel>}
        <ComboboxRoot
          size="sm"
          openOnClick
          collection={collection}
          onInputValueChange={(e) => filter(e.inputValue)}
          value={value}
          onValueChange={handleValueChange}
          width="100%"
          disabled={disabled}
          onOpenChange={(e) => {
            if (e.open) filter("");
          }}
        >
          <ComboboxControl clearable>
            <ComboboxInput
              placeholder={employeeToEdit?.name || "Seleccione un empleado"}
            />
          </ComboboxControl>

          <ComboboxContent>
            {collection.items.length > 0 ?
              (collection.items.map((item) => (
                <ComboboxItem item={item} key={item.value}>
                  {item.label}
                </ComboboxItem>
              ))) : (
                <ComboboxEmpty px={4} py={2}>
                  No se encontraron empleados
                </ComboboxEmpty>
              )}
          </ComboboxContent>
        </ComboboxRoot>
      </FieldRoot>
    </Box>
  );
}

export default FilterEmployee;
