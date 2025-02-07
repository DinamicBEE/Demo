import { createContext, useCallback, useContext, useState, useMemo, ReactNode } from 'react';
import { ListContextType, StoreModel, SubsidiaryModal } from '@models/common.model';
import { getStores } from '@services/catalogService';


const listContext = createContext<ListContextType>({} as ListContextType);

// eslint-disable-next-line react-refresh/only-export-components
export const useList = () => useContext(listContext)

export function ListProvider({ children }: {children: ReactNode}){
  const [subsidiaries, setSubsidiaries] = useState<SubsidiaryModal[]>([]);
  const [stores, setStores] = useState<StoreModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const getData = useCallback(async (getFunction: any, setter: any) => {
    const controller = new AbortController();
    setIsLoading(true);
    setError('');
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

  const getSubsidiariesData = useCallback(()=>{},[subsidiaries])

  const getStoresData = useCallback( async()=>{

    if(stores){
      return stores
    }

    try {

      const storesData = await getStores();

      setStores(storesData)

      return storesData;
      
    } catch (error) {
      
      setError(error instanceof Error ? error.message : String(error));
            
      throw error;
    
    }

  },[stores])

  const value = useMemo(
    () => ({
      isLoading,
      error,
      getData,
      //getSubsidiariesData,
      getStoresData
    }),
    [isLoading, error, getData, getStoresData]// getSubsidiariesData,
  );

  return(
      <listContext.Provider value={value}>
          {children}
      </listContext.Provider>
  );
}