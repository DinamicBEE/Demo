import { useState, useMemo } from 'react';
import { FiChevronUp, FiChevronDown } from "react-icons/fi";



interface SortableItem {
  [key: string]: any;
}

interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc';
}

function useSortableTable<T extends SortableItem>(data: T[]) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableItems = [...data];

    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key!];
        const bValue = b[sortConfig.key!];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: 'base' })
            : bValue.localeCompare(aValue, undefined, { numeric: true, sensitivity: 'base' });
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }
        return 0;
      });
    }    
    return sortableItems;
  }, [data, sortConfig]);

  const getSortIcon = (key: string) => {
      if (sortConfig.key !== key) {
        return null;
      }
      return sortConfig.direction === 'asc' ? <FiChevronUp /> : <FiChevronDown />;
    };

  
  return { sortedData, sortConfig, handleSort, getSortIcon };
}

export default useSortableTable;