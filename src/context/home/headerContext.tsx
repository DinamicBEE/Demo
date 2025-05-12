import { ReactNode, useRef } from 'react';
import { createContext, useContext, useState } from 'react';
import { ClousingLinesModel, HeaderContext, HeaderContextType, HeaderData } from '@models/common.clousing.model'
import { CLOUSING_KEY } from '@models/constants.model';

const headersContext = createContext<HeaderContextType>({} as HeaderContextType);

export const useHeaders = () => useContext(headersContext)

export function HeadersProvider({ children }: { children: ReactNode }) {
  const [header, setHeader] = useState<HeaderContext>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const headerRef = useRef(header);

  const updateHeaderState = (newHeader: any) => {
    setHeader(newHeader);
    headerRef.current = newHeader;

    console.log("headerRef", headerRef.current);
  };

  const getHeader = (clousingData: ClousingLinesModel) => {
    setLoading(true);
console.log(clousingData);

    if (headerRef.current[clousingData.id]) {
      setLoading(false);
      return headerRef.current[clousingData.id];
    }

    try {
console.log("data", clousingData);
      const data = createObjectHeader(clousingData);
      console.log("data", data);

      const updatedHeader = { ...headerRef.current, [clousingData.id]: data, }

      updateHeaderState(updatedHeader);

      return data;

    } catch (error) {

      setError(error instanceof Error ? error.message : String(error));
      return {} as HeaderData

    } finally {
      setLoading(false);
    }

  }

  const updateTotal = (newTotal: number, clousingId: number, clousingType: CLOUSING_KEY) => {
//console.log("updateTotal", newTotal, clousingId, clousingType);
    //console.log("headerRef", headerRef.current);
    
    const currentHeader = headerRef.current;
    const currentClousing = currentHeader[clousingId]?.closures[clousingType] || {};

    const lastCashTotal = currentClousing.totalPOS || 0;
    const lastCashPhysicalTotal = currentClousing.totalPhysical || 0;

    const lastTotalPOS = (currentHeader[clousingId]?.totalPOS || 0);

    //Validar que todos los valores de totalPhysical sean diferentes de 0
    const allValues = Object.values(currentHeader[clousingId]?.closures || {}).every((value) => value.totalPhysical == 0);
    //console.log("allValues", allValues);
    const lastTotalClousing = !allValues ? 
      (currentHeader[clousingId]?.totalClousing || 0) - lastCashPhysicalTotal : 0;

    const newDifference = lastCashTotal - newTotal
    const newTotalClousing = lastTotalClousing + newTotal;

    const updatedHeader = {
      ...currentHeader,
      [clousingId]: {
        ...(currentHeader[clousingId] || {}),
        closures: {
          ...(currentHeader[clousingId]?.closures || {}),
          [clousingType]: {
            totalPhysical: newTotal,
            difference: newDifference,
            totalPOS: lastCashTotal,
          },
        },
        difference: lastTotalPOS - newTotalClousing,
        totalClousing: newTotalClousing,
      },
    };

    updateHeaderState(updatedHeader);

  }

  const value = {
    header,
    updateTotal,
    loading,
    error,
    getHeader
  }

  return (
    <headersContext.Provider value={value}>
      {children}
    </headersContext.Provider>
  );
}

function createObjectHeader(dataRow: ClousingLinesModel) {
  console.log(dataRow);
  
  const headerData: HeaderData = {
    cdc: "No seleccionada",
    location: "No seleccionado",
    subsidiary: "No seleccionado",
    date: dataRow.creationDate,
    totalPOS: dataRow.totalPOS,
    totalClousing: dataRow.totalPhysical,
    difference: dataRow.difference,
    service: dataRow.service,
    discountPOS: 1000,
    discountClousing: dataRow.discount,
    closures: {
      cash: { totalPOS: 0, totalPhysical: 0, difference: 0 },
      customer: { totalPOS: 0, totalPhysical: 0, difference: 0 },
      specialCustomer: { totalPOS: 0, totalPhysical: 0, difference: 0 },
      tdc: { totalPOS: 0, totalPhysical: 0, difference: 0 },
      employee: { totalPOS: 0, totalPhysical: 0, difference: 0 },
      prepaid: { totalPOS: 0, totalPhysical: 0, difference: 0 },
      intercompany: { totalPOS: 0, totalPhysical: 0, difference: 0 },
    },
  }

  return headerData
}