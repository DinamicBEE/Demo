import { ReactNode, useRef } from 'react';
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { getTDCClousing } from '@services/clousingService';
import { TDCContext, TDCContextType } from '@models/tdc.model';

const tdcContext = createContext<TDCContextType | undefined>(undefined);

export const useTDCContext = () => useContext(tdcContext);

export function TDCClousingProvider({ children }: { children: ReactNode }) {
    const [tdc, setTDC] = useState<TDCContext>({});
    const [tdcLoading, setTDCLoading] = useState(false);
    const [error, setError] = useState("");
    const tdcRef = useRef<TDCContext>(tdc);

    const updateTDCData = (newTDCData: TDCContext) => {
        setTDC(newTDCData);
        tdcRef.current = newTDCData;
    }

    const getTDCData = useCallback( async(clousingId:number, employeeId:number)=>{
        setTDCLoading(true);
        
        console.log(tdcLoading)

        if(tdcRef.current[clousingId]?.[employeeId]) {
            setTDCLoading(false);
            return tdcRef.current[clousingId]?.[employeeId];
        }

        try {

            const data = await getTDCClousing(clousingId, employeeId);

            const currentClousingData = tdcRef.current[clousingId] || {};

            const updateTDC = {
                ...tdcRef.current,
                [clousingId]:{
                    ...(typeof currentClousingData === 'object' ? currentClousingData : {}),
                    [employeeId]: data
                }
            }
            
            updateTDCData(updateTDC);
            
            return data;
            
        } catch (error) {
            
            setError(error instanceof Error ? error.message : String(error));
            
            throw error;

        } finally {

            setTDCLoading(false);

        }

    },[tdc]);

    const value = useMemo(
        ()=>({
            tdc,
            tdcLoading,
            error,
            getTDCData,
        }),
        [tdc, tdcLoading, error, getTDCData,]
    );

    return (
        <tdcContext.Provider value={value}>
            {children}
        </tdcContext.Provider>
    );
};