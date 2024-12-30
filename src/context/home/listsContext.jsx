import { createContext, useCallback, useContext, useState, useMemo } from 'react';


const listContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useList = () => useContext(listContext)

export function ListProvider({ children }){
  const [subsidiary, setSubsidiary] = useState(null);
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getData = useCallback(async (getFunction, setter) => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFunction({signal: controller.signal});
      setter(data);
    } catch (err) {
      setError('Error al cargar los datos.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  },[]);

  const value = useMemo(
    () => ({
      subsidiary,
      setSubsidiary,
      store,
      setStore,
      isLoading,
      error,
      getData,
    }),
    [subsidiary, store, isLoading, error, getData]
  );

  return(
      <listContext.Provider value={value}>
          {children}
      </listContext.Provider>
  );
}