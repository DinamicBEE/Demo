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
    // limit: 30,
  });

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
        >
          <ComboboxControl clearable>
            <ComboboxInput
              placeholder={employeeToEdit?.name || "Seleccione un empleado"}
            />
          </ComboboxControl>

          <ComboboxContent>
            <ComboboxEmpty px={4} py={2}>
              No se encontraron empleados
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

export default FilterEmployee;
