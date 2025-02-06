import { ReactNode, useRef } from 'react';
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { getHeaders } from '@services/clousingService';
import { HeaderContextType } from '@models/common.clousing.model'
import { CLOUSING_KEY } from '@models/constants.model';

const headersContext = createContext<HeaderContextType | undefined>(undefined);

export const useHeaders = () => useContext(headersContext)

export function HeadersProvider({ children }: { children: ReactNode }) {
  const [header, setHeader] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const headerRef = useRef(header);
  
  const updateHeaderState = (newHeader: any) => {
    setHeader(newHeader);
    headerRef.current = newHeader;
  };
  
  const getHeader = async (clousingId:number, employeeId:number) => {
    setLoading(true);
    
    if(headerRef.current[clousingId]?.[employeeId]) {
      setLoading(false);
      return headerRef.current[clousingId][employeeId];
    }

    try {
      const data = await getHeaders(clousingId, employeeId);
      
      const updatedHeader  = {
        ...headerRef.current,
        [clousingId]: {
          ...(headerRef.current[clousingId] || {}),
          [employeeId]: data},
      }
      
      updateHeaderState(updatedHeader);

      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }

  }

  const updateTotal = (newTotal: number, clousingId: number, employeeId:number, clousingType: CLOUSING_KEY)=>{
    console.log(newTotal)
    const currentHeader = headerRef.current;
    const currentClousing = currentHeader[clousingId]?.[employeeId]?.closures[clousingType] || {};
    console.log(currentClousing)

    const lastCashTotal = currentClousing.totalPOS || 0;
    const lastCashDifference = currentClousing.difference || 0;
    const lastCashPhysicalTotal = currentClousing.totalPhysical || 0;

    const lastTotalPOS = currentHeader[clousingId]?.[employeeId]?.totalPOS
    const lastDifference = (currentHeader[clousingId]?.[employeeId]?.difference || 0) - Math.abs(lastCashDifference);
    const lastTotalClousing = (currentHeader[clousingId]?.[employeeId]?.totalClousing || 0) - lastCashPhysicalTotal;

    const newDifference = lastCashTotal - newTotal
    const newTotalClousing = lastTotalClousing + newTotal;

    console.log(lastDifference)
    console.log(newDifference)
    
    const updatedHeader = {
      ...currentHeader,
      [clousingId]: {
        ...(currentHeader[clousingId] || {}),
        [employeeId]: {
          ...(currentHeader[clousingId]?.[employeeId] || {}),
          closures: {
            ...(currentHeader[clousingId]?.[employeeId]?.closures || {}),
            [clousingType]:{
              totalPhysical: newTotal,
              difference: Math.abs(newDifference),
              totalPOS: lastCashTotal,
            }
          },
          difference: Math.abs(lastTotalPOS - newTotalClousing),
          totalClousing: newTotalClousing,

        }
      }
    }

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