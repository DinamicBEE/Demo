import { ReactNode, createContext, useContext, useState, useMemo, useCallback, useRef } from 'react';
import { getSpecialCustomerClousing } from '@services/clousingService';
import { specialCustContextType, SpecialCustomerContext, SpecialCustomerLines, SpecialCustomerModel } from '@models/specialCustome.model';

const specialCustContext = createContext<specialCustContextType>({} as specialCustContextType);

export const useSpecialCustContext = () => useContext(specialCustContext);

export function SpecialcustomerProvider({ children }: { children: ReactNode }) {
    const [specialCust, setSpecialCust] = useState<SpecialCustomerContext>({});
    const [specialCustLoading, setSpecialCustLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const specialCustRef = useRef<SpecialCustomerContext>(specialCust);

    const updateSpecialCustData = (newCashData: SpecialCustomerContext) => {
        setSpecialCust(newCashData);
        specialCustRef.current = newCashData;
    };

    const getSpecialCustData = useCallback(async (clousingId: number, idCurrency: number)=>{
        setSpecialCustLoading(true);

        if(specialCustRef.current[clousingId]){
            setSpecialCustLoading(false);
            return specialCustRef.current[clousingId];
        }

        try {
            const response = await getSpecialCustomerClousing(clousingId, idCurrency);

            if (!response.success) {
                setSpecialCustLoading(false);
                return response.data;
            }

            const updateSpecialCust = {
                ...specialCustRef.current,
                [clousingId]: response.data
    
            }

            updateSpecialCustData(updateSpecialCust)

            return response.data as SpecialCustomerModel;
            
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
            return {} as SpecialCustomerModel
        } finally {
            setSpecialCustLoading(false);
        }

    }, [specialCust]);

    const setSpecialCustData = useCallback(async (specialCustLine:SpecialCustomerModel, clousingId: number)=>{

        const updateSpecialCustomer = {
            ...specialCustRef.current,
            [clousingId]: specialCustLine
        };
        
        updateSpecialCustData(updateSpecialCustomer);
        
    },[]);

    const value = useMemo(
        ()=>({
            specialCust,
            specialCustLoading,
            error,
            getSpecialCustData,
            setSpecialCustData   
        }),[specialCust, specialCustLoading, error, getSpecialCustData, setSpecialCustData]
    );

    return (
        <specialCustContext.Provider value={value}>
            {children}
        </specialCustContext.Provider>
    );
}