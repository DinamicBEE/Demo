import { createContext, useCallback, useContext, useState, useMemo, ReactNode } from 'react';
import { ListContextType, StoreModel, SubsidiaryModal } from '@models/common.model';
import { getStores, getSubsidiaries } from '@services/catalogService';


const listContext = createContext<ListContextType>({} as ListContextType);

export const useList = () => useContext(listContext)

export function ListProvider({ children }: {children: ReactNode}){
  const [subsidiaries, setSubsidiaries] = useState<SubsidiaryModal[]>([]);
  const [stores, setStores] = useState<StoreModel[]>([]);
  const [error, setError] = useState<string>('');

  const getSubsidiariesData = useCallback( async()=>{
    
    if(subsidiaries.length>1){
      return subsidiaries;
    }

    try {

      const subsidiariesData = await getSubsidiaries();

      setSubsidiaries(subsidiariesData);
      return subsidiariesData;
      
    } catch (error) {

      setError(error instanceof Error ? error.message : String(error));
            
      throw error;
      
    }

  },[subsidiaries])

  const getStoresData = useCallback( async(subId = 0)=>{
    // console.log("entramos listConstext");

      // if(stores.length>1){
      //   return stores;
      // }

    try {
      
      const storesData = await getStores(subId!);

      setStores(storesData)

      return storesData;
      
    } catch (error) {
      
      setError(error instanceof Error ? error.message : String(error));
            
      throw error;
    
    }

  },[stores])

  const value = useMemo(
    () => ({
      error,
      getSubsidiariesData,
      getStoresData,
      subsidiaries,
      stores
    }),
    [error, getSubsidiariesData, getStoresData, subsidiaries, stores]
  );

  return(
      <listContext.Provider value={value}>
          {children}
      </listContext.Provider>
  );
}