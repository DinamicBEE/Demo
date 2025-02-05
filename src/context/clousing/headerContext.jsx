import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { getHeaders } from '@services/clousingService';

const headersContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useHeaders = () => useContext(headersContext)

export function HeadersProvider({ children }) {
  const [header, setHeader] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const getHeader = useCallback(async (clousingId, employeeId) => {
    setLoading(true);
    console.log(header[employeeId]);
    if(header[employeeId]) {
      setLoading(false);
      return header[employeeId];
    }

    try {
      const response = await getHeaders(clousingId, employeeId);
      setHeader((prev) => ({
        ...prev,
        [employeeId]: response,
      }));
      return response;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  },[header])

  const value = useMemo(
    () => ({
      header,
      loading,
      error,
      getHeader,
    }),
    [header, loading, error, getHeader]
  );

  return (
    <headersContext.Provider value={value}>
      {children}
    </headersContext.Provider>
  );
}