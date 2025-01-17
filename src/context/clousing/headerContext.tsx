import { ReactNode, useRef } from 'react';
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { getHeaders } from '@services/clousingService';
import { HeaderContextType } from '@models/common.clousing.model'
import { CLOUSING_KEY } from '@models/constants.model';

const headersContext = createContext<HeaderContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useHeaders = () => useContext(headersContext)

export function HeadersProvider({ children }: { children: ReactNode }) {
  const [header, setHeader] = useState<any>({});
  const headerRef = useRef(header);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  
  const updateHeaderState = (newHeader: any) => {
    setHeader(newHeader);
    headerRef.current = newHeader;
  };
  
  const getHeader = useCallback(async (clousingId:number, employeeId:number) => {
    setLoading(true);
    console.log(headerRef.current[employeeId]);
    if(headerRef.current[employeeId]) {
      setLoading(false);
      return headerRef.current[employeeId];
    }

    try {
      const response = await getHeaders(clousingId, employeeId);

      const updatedHeader  = {
        ...headerRef.current,
        [employeeId]: response,
      }
      updateHeaderState(updatedHeader);

      return response;
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }

    

  },[header])

  const updateTotal = useCallback((newtotal: number, newDifference: number, employeeId:number, clousingType: CLOUSING_KEY)=>{

    console.log(headerRef.current);
    console.log(headerRef);
    headerRef.current[employeeId].totalClousing -= headerRef.current[employeeId].closures[clousingType].totalPhysical;
    headerRef.current[employeeId].difference -= headerRef.current[employeeId].closures[clousingType].difference;

    headerRef.current[employeeId].closures[clousingType].totalPhysical = newtotal;
    headerRef.current[employeeId].closures[clousingType].difference = newDifference;

    headerRef.current[employeeId].totalClousing += newtotal;
    headerRef.current[employeeId].difference += newDifference;

    const updatedHeader  = {
      ...headerRef.current,
      [employeeId]: headerRef.current[employeeId],
    }

    updateHeaderState(updatedHeader);

  },[])

  const value = useMemo(
    () => ({
      header,
      updateTotal,
      loading,
      error,
      getHeader
    }),
    [header, loading, error, getHeader, updateTotal ]
  );

  return (
    <headersContext.Provider value={value}>
      {children}
    </headersContext.Provider>
  );
}