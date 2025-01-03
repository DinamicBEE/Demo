import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { getGeneralInfo } from '@services/homeService';

const clousingContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useClousing = () => useContext(clousingContext)

export function ClousingProvider({ children }) {
  const [header, setHeader] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const getInfo = useCallback(async (subsidiary, store) => {
    try {
      const response = await getGeneralInfo(subsidiary, store);
      setHeader(response.header);
      setData(response.employees);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  },[])

  const value = useMemo(
    () => ({
      header,
      data,
      loading,
      error,
      getInfo,
    }),
    [header, data, loading, error, getInfo]
  );

  return (
    <clousingContext.Provider value={value}>
      {children}
    </clousingContext.Provider>
  );
}