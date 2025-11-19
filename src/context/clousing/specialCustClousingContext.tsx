import { ReactNode, createContext, useContext, useState, useMemo, useCallback, useRef } from 'react';
import { getSpecialCustomerClousing } from '@services/clousingService';
import { specialCustContextType, SpecialCustomerContext, SpecialCustomerLines, SpecialCustomerModel } from '@models/specialCustome.model';
import { ResponseModel } from '@models/common.clousing.model';

const specialCustContext = createContext<specialCustContextType>({} as specialCustContextType);

export const useSpecialCustContext = () => useContext(specialCustContext);

export function SpecialcustomerProvider({ children }: { children: ReactNode }) {
    const [specialCust, setSpecialCust] = useState<SpecialCustomerContext>({});
    const [specialCustLoading, setSpecialCustLoading] = useState<boolean>(false);
    const specialCustRef = useRef<SpecialCustomerContext>(specialCust);

    const updateSpecialCustData = (newCashData: SpecialCustomerContext) => {
        setSpecialCust(newCashData);
        specialCustRef.current = newCashData;
    };

    const getSpecialCustData = useCallback(async (clousingId: number, idCurrency: number)=>{
        setSpecialCustLoading(true);

        if(specialCustRef.current[clousingId]){
            setSpecialCustLoading(false);
            const response: ResponseModel = {
                success: true,
                data: specialCustRef.current[clousingId]
            }
            return response;
        }

        try {
            const response = await getSpecialCustomerClousing(clousingId, idCurrency);

            if (!response.success) {
                setSpecialCustLoading(false);
                return response as ResponseModel;
            }

            const updateSpecialCust = {
                ...specialCustRef.current,
                [clousingId]: response.data
    
            }

            updateSpecialCustData(updateSpecialCust)

            return response as ResponseModel;
            
        } catch (error) {
            return error as ResponseModel
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
            getSpecialCustData,
            setSpecialCustData, 
            specialCustRef
        }),[specialCust, specialCustLoading, getSpecialCustData, setSpecialCustData, specialCustRef]
    );

    return (
        <specialCustContext.Provider value={value}>
            {children}
        </specialCustContext.Provider>
    );
}