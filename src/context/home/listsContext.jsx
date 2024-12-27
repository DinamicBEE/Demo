import { createContext, useContext, useState } from 'react';

const listContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useList = () => useContext(listContext)

export function ListProvider({ children }){
  const [subsidiary, setSubsidiary] = useState(null);
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getData = async (getFunction, setter) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFunction();
      setter(data);
    } catch (err) {
      setError('Error al cargar los datos.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

    return(
        <listContext.Provider
            value={{
                subsidiary,
                setSubsidiary,
                store,
                setStore,
                isLoading,
                error,
                getData,
            }}
        >
            {children}
        </listContext.Provider>
    );
}