import { ReactNode, useRef } from 'react';
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { getPrepaidClousing } from '@services/clousingService';
import { PrepaidContext, PrepaidContextType } from '@models/prepaid.model';

const prepaidContext = createContext<PrepaidContextType | undefined>(undefined);

export const usePrepaidContext = () => useContext(prepaidContext);

export function PrepaidClousingProvider({ children }: { children: ReactNode }) {
    const [prepaid, setPrepaid] = useState<PrepaidContext>({});
    const [prepaidLoading, setPrepaidLoading] = useState(false);
    const [error, setError] = useState("");
    const prepaidRef = useRef<PrepaidContext>(prepaid);

    const updatePrepaidData = (newPrepaidData: PrepaidContext) => {
        setPrepaid(newPrepaidData);
        prepaidRef.current = newPrepaidData;
    }

    const getPrepaidData = useCallback( async(clousingId:number, employeeId:number)=>{
        setPrepaidLoading(true);

        console.log(clousingId)
        
        if(prepaidRef.current[clousingId]?.[employeeId]) {
            setPrepaidLoading(false);
            return prepaidRef.current[clousingId]?.[employeeId];
        }

        try {
            const data = await getPrepaidClousing(clousingId, employeeId);

            const currentClousingData = prepaidRef.current[clousingId] || {};

            const updatePrepaid = {
                ...prepaidRef.current,
                [clousingId]: {
                    ...(typeof currentClousingData === 'object' ? currentClousingData : {}),
                    [employeeId]: data
                }

            }

            updatePrepaidData(updatePrepaid);

            return data;
            
        } catch (error) {

            setError(error instanceof Error ? error.message : String(error));
            
            throw error;
            
        } finally {

            setPrepaidLoading(false);

        }

    },[prepaid]);

    const value = useMemo(
        ()=>({
            prepaid,
            prepaidLoading,
            error,
            getPrepaidData
        }),
        [prepaid, prepaidLoading, error, getPrepaidData]
    );

    return (
        <prepaidContext.Provider value={value}>
            {children}
        </prepaidContext.Provider>
    );
}