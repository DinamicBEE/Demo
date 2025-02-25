import { ReactNode, useRef } from 'react';
import { createContext, useContext, useState } from 'react';
import { getHeaders } from '@services/clousingService';
import { HeaderContext, HeaderContextType, HeaderData } from '@models/common.clousing.model'
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
  };
  
  const getHeader = async (clousingId:number) => {
    setLoading(true);
    
    if(headerRef.current[clousingId]) {
      setLoading(false);
      return headerRef.current[clousingId];
    }

    try {
      const data = await getHeaders(clousingId);
      
      const updatedHeader  = {
        ...headerRef.current,
        [clousingId]: data,
      }
      
      updateHeaderState(updatedHeader);

      return data;
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
      
      return {} as HeaderData

    } finally {
      setLoading(false);
    }

  }

  const updateTotal = (newTotal: number, clousingId: number, clousingType: CLOUSING_KEY)=>{
    
    const currentHeader = headerRef.current;
    const currentClousing = currentHeader[clousingId]?.closures[clousingType] || {};

    const lastCashTotal = currentClousing.totalPOS || 0;
    const lastCashPhysicalTotal = currentClousing.totalPhysical || 0;

    const lastTotalPOS = (currentHeader[clousingId]?.totalPOS || 0);
    const lastTotalClousing = (currentHeader[clousingId]?.totalClousing || 0) - lastCashPhysicalTotal;

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
            difference: Math.abs(newDifference),
            totalPOS: lastCashTotal,
          },
        },
        difference: Math.abs(lastTotalPOS - newTotalClousing),
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