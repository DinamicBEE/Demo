import { useEffect, useRef, useState } from "react";
import { CustomerFilter, EmployeeFilterProps } from "@models/employee.model";
import { Box, createListCollection, ListCollection } from "@chakra-ui/react";
import {
  SelectLabel,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  SelectContent,
  SelectItem,
} from "@components/ui/select";
import { ValueChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/select/namespace";

function FilterCustomer({
  customers,
  label,
  itemId,
  customerSelect,
  onSelect,
  disabled,
}: CustomerFilter) {
  //

  const [searchQuery, setSearchQuery] = useState<string>("Selecciona cliente");
  const [filteredCustomer, setFilteredCustomer] = useState<ListCollection>(
    createListCollection({ items: [] })
  );
  const searchRef = useRef<string>("");

  useEffect(() => {
    console.log("customers", customers.map((customer) => customer));

    
    const employeeCollection = createListCollection({
      items: customers.map((customer) => ({
        label: `${customer.label}`,
        value: customer.value,
      })),
    });
    console.log("employeeCollection", employeeCollection);
    
    setFilteredCustomer(employeeCollection);
  }, [customers]);

  function handleSearch(event: string) {
    let query: string = "";
    if (event.toLowerCase() === "backspace") {
      query = searchRef.current.slice(0, -1);
    } else if (event.length == 1) {
      query = searchRef.current + event.toLowerCase();
    } else {
      query = searchRef.current;
    }
    setSearchQuery(query);
    searchRef.current = query;

    const filtered = customers.filter((customer) =>
      customer.label.toLowerCase().includes(query)
    );

    const employeeCollection = createListCollection({
      items: filtered.map((customer) => ({
        label: customer.label,
        value: customer.value,
      })),
    });

    setFilteredCustomer(employeeCollection);
  }

  function handleSelect(event: ValueChangeDetails<any>) {
    console.log("event", event);
    
    const selectedId = Number(event.value[0]);

    const customerSelect = customers.find(
      (customer) => customer.value === selectedId
    );

    if (customerSelect && itemId === undefined) {
      onSelect(customerSelect);
    } else if (customerSelect && itemId != undefined) {
      onSelect(customerSelect, itemId);
    }
  }

  return (
    <Box>
      <SelectRoot
        collection={filteredCustomer}
        onKeyUp={(e) => handleSearch(e.key)}
        onValueChange={(event) => handleSelect(event)}
        disabled={disabled || false}
      >
        {label && <SelectLabel>Cliente</SelectLabel>}
        <SelectTrigger>
          <SelectValueText placeholder={customerSelect || searchQuery} />
        </SelectTrigger>

        <SelectContent style={{ maxHeight: "200px", overflowY: "auto" }}>
          {filteredCustomer.items.map((movie) => (
            <SelectItem item={movie} key={movie.value}>
              {movie.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </Box>
  );
}

export default FilterCustomer;
