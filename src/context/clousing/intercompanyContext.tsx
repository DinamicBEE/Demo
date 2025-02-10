import { ReactNode, createContext, useContext, useState, useMemo, useCallback, useRef } from 'react';
import { IntercompanyContext, IntercompanyContextType, IntercompanyLine, IntercompanyModel } from '@models/intercompany.model';
import { getIntercompanyClousing } from '@services/clousingService';
import { TotalModel } from '@models/common.clousing.model';

const intercompanyContext = createContext<IntercompanyContextType>({} as IntercompanyContextType);

export const useIntercompanyContext = () => useContext(intercompanyContext);

export function IntercompanyClousingProvider({children}: {children: ReactNode}) {
    const [intercompany, setIntercompany] = useState<IntercompanyContext>({})
    const [error, setError] = useState<string>("");

    const getIntercompanyData = useCallback( async(clousingId:number, employeeId:number)=>{

        if(intercompany[clousingId]?.[employeeId]){
            return intercompany[clousingId]?.[employeeId];
        }

        try {

            const data: IntercompanyModel = await getIntercompanyClousing(clousingId, employeeId);

            const updateIntercompany: IntercompanyContext = {
              ...intercompany,
              [clousingId]: {
                [employeeId]: data,
              },
            };

            setIntercompany(updateIntercompany);

            return data;

        } catch (error) {

            setError(error instanceof Error ? error.message : String(error));
            
            throw error;
            
        }

    },[intercompany]);

    const setIntercompanyData = useCallback( (intercompanyData: IntercompanyModel, clousingId:number, employeeId:number)=>{

        const currentRegister = intercompany[clousingId]?.[employeeId];

        const updateLines = intercompanyData.lines;

        const newTotalPhysical = updateLines?.reduce(
          (acc: number, curr: IntercompanyLine) => acc + curr.physicalAmount,
          0
        );

        const newDifference =
          (currentRegister.total?.totalPOS || 0) - (newTotalPhysical || 0);

        const newTotal: TotalModel = {
          totalPOS: currentRegister.total?.totalPOS || 0,
          totalPhysical: newTotalPhysical || 0,
          difference: newDifference,
        };

        const updateData: IntercompanyContext = {
            ...intercompany,
            [clousingId]: {
                ...intercompany[clousingId],
                [employeeId]:{
                    ... currentRegister,
                    lines: updateLines,
                    total: newTotal
                }
            }
        }
        
        setIntercompany(updateData);

    },[intercompany])

    const value = useMemo(
        ()=>({
            intercompany,
            error,
            getIntercompanyData,
            setIntercompanyData
        }), 
        [intercompany, error, getIntercompanyData, setIntercompanyData]
    );

    return (
        <intercompanyContext.Provider value={value}>
            {children}
        </intercompanyContext.Provider>
    );

}