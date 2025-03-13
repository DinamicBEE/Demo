import { useEffect, useRef, useState } from "react";
import { EmployeeFilterProps } from "@models/employee.model";
import { Box, createListCollection, ListCollection } from "@chakra-ui/react";
import {
	SelectLabel,
	SelectRoot,
	SelectTrigger,
	SelectValueText,
	SelectContent, SelectItem,
  } from "@components/ui/select"
import { ValueChangeDetails } from "node_modules/@chakra-ui/react/dist/types/components/select/namespace";

function FilterEmployee({ employees, label, itemId, employeeSelect, onSelect, disabled }: EmployeeFilterProps) {//
	const [searchQuery, setSearchQuery] = useState<string>('Selecciona empleado');
	const [filteredEmpleados, setFilteredEmpleados] = useState<ListCollection>(createListCollection({ items: [] }));
	const searchRef = useRef<string>('');

	console.log(disabled)

	useEffect(() => {
		const employeeCollection = createListCollection({
			items: employees.map(employee => ({
				label: employee.name + ' ' + employee.lastName,
				value: employee.id
			})
			)
		})

		setFilteredEmpleados(employeeCollection)

	}, [employees])

	function handleSearch(event: string) {

		let query: string = '';
		if (event.toLowerCase() === 'backspace') {
			query = searchRef.current.slice(0, -1);
		} else if (event.length == 1) {
			query = searchRef.current + event.toLowerCase();
		} else {
			query = searchRef.current;
		}
		setSearchQuery(query);
		searchRef.current = query

		const filtered = employees.filter(
			(employee) =>
				employee.name.toLowerCase().includes(query) ||
				employee.lastName.toLowerCase().includes(query)
		);

		const employeeCollection = createListCollection({
			items: filtered.map(employee => ({
				label: employee.name + ' ' + employee.lastName,
				value: employee.id
			})
			)
		})

		setFilteredEmpleados(employeeCollection)

	}

	function handleSelect(event: ValueChangeDetails<any>) {
		const selectedId = Number(event.value[0]);

		const employeeSelect = employees.find((employee) => employee.id === selectedId);

		if (employeeSelect && itemId === undefined) {
			onSelect(employeeSelect);
		} else if (employeeSelect && itemId != undefined) {
			onSelect(employeeSelect, itemId);
		}

	}

	return (
		<Box>
			<SelectRoot collection={filteredEmpleados} onKeyUp={(e) => handleSearch(e.key)}
				onValueChange={(event) => handleSelect(event)} disabled={disabled || false}>

				{label && <SelectLabel>Empleado</SelectLabel>}
				<SelectTrigger>
					<SelectValueText placeholder={employeeSelect || searchQuery} />
				</SelectTrigger>

				<SelectContent style={{ maxHeight: "200px", overflowY: "auto" }}>
					{filteredEmpleados.items.map((movie) => (
						<SelectItem item={movie} key={movie.value} >
							{movie.label}
						</SelectItem>
					))}
				</SelectContent>

			</SelectRoot>
		</Box>
	);
}

export default FilterEmployee;