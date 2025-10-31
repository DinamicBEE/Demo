import { HStack, Table } from "@chakra-ui/react"
import { SortableHeaderProps } from "@models/starbucks.model";

export const SortableHeader = ({
  columnKey,
  label,
  handleSort,
  getSortIcon,
  textAlign = "center"
}: SortableHeaderProps) => {
  console.log(columnKey, label);
  
  return (
    <Table.ColumnHeader 
      textAlign={textAlign} 
      onClick={() => handleSort(columnKey)} 
      _hover={{textDecoration: "underline"}} 
      cursor="pointer"
    >
      <HStack justify={textAlign}>
        {label} {getSortIcon(columnKey)}
      </HStack>
    </Table.ColumnHeader>
  );
};
