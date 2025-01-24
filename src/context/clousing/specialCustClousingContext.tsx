import { ReactNode, createContext, useContext, useState, useMemo, useCallback, useRef } from 'react';
import { getSpecialCustomerClousing } from '@services/clousingService';
import { specialCustContextType, SpecialCustomerContext, SpecialCustomerLines } from '@models/specialCustome.model';

const specialCustContext = createContext<specialCustContextType | undefined>(undefined);

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

    const getSpecialCustData = useCallback(async (clousingId: number, employeeId: number)=>{
        setSpecialCustLoading(true);

        if(specialCustRef.current[clousingId]){
            setSpecialCustLoading(false);
            return specialCustRef.current[clousingId][employeeId];
        }

        try {
            const response = await getSpecialCustomerClousing(clousingId, employeeId);

            const currentClousingData = specialCustRef.current[clousingId] || {};

            const updateSpecialCust = {
                ...specialCustRef.current,
                [clousingId]: {
                    ...(typeof currentClousingData === 'object' ? currentClousingData : {}),
                    [employeeId]: response
                }
            }

            updateSpecialCustData(updateSpecialCust)

            return response;
            
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
        } finally {
            setSpecialCustLoading(false);
        }

    }, [specialCust]);

    const setSpecialCustData = useCallback(async (specialCustLine:SpecialCustomerLines[], employeeId: number, clousingId: number)=>{

        const currentClousingData = specialCustRef.current[clousingId] || {};

        const updateSpecialCustomer = {
            ...specialCustRef.current,
            [clousingId]: {
                ...currentClousingData,
                [employeeId]: specialCustLine
            }
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