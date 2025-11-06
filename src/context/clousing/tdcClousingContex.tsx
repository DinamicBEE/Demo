import { ReactNode, useRef } from 'react';
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { getTDCClousing } from '@services/clousingService';
import { BankLineModel, TDCModel, TDCContext, TDCContextType, TDCDetailsContext } from '@models/tdc.model';
import { getTDCByMERA } from '@services/starbucksService';

const tdcContext = createContext<TDCContextType>({} as TDCContextType);

export const useTDCContext = () => useContext(tdcContext);

export function TDCClousingProvider({ children }: { children: ReactNode }) {
    const [tdc, setTDC] = useState<TDCContext>({});
    const [tdcDetails, setTDCDetails] = useState<TDCDetailsContext>({});
    const [tdcLoading, setTDCLoading] = useState<boolean>(false);
    const [detailsLoading, setDetailsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [detailsError, setDetailsError] = useState<string>("");
    const tdcRef = useRef<TDCContext>(tdc);
    const tdcDetailsRef = useRef<TDCDetailsContext>(tdcDetails)

    const updateTDCData = (newTDCData: TDCContext) => {
        setTDC(newTDCData);
        tdcRef.current = newTDCData;
    }

    const updateTDCDetails = (newDetails: TDCDetailsContext) => {
        setTDCDetails(newDetails);
        tdcDetailsRef.current = newDetails;
    }

    const getTDCData = useCallback( async(clousingId:number, idCurrency: number, isStarbucks: boolean)=>{
        setTDCLoading(true);

        if(tdcRef.current[clousingId]) {
            setTDCLoading(false);
            return tdcRef.current[clousingId];
        }

        try {

            let data: TDCModel;
            if(isStarbucks){
                const preDataMera = await getTDCClousing(clousingId, idCurrency);
                const preDataStarbucks = await getTDCByMERA(clousingId);
                data = {
                    ...preDataStarbucks,
                    total: preDataMera.total
                }
                console.log(data);

            } else {
                data = await getTDCClousing(clousingId, idCurrency);

            }

            const updateTDC: TDCContext = {
                ...tdcRef.current,
                [clousingId]: data
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

    const setDetails = useCallback( async(details: BankLineModel, clousingId: number, lineId: number | string) => {

        const currentLines = tdcDetailsRef.current[clousingId] || {};

        const updateDetails: TDCDetailsContext = {
            ...tdcDetailsRef.current,
            [clousingId]:{
                ...currentLines,
                [lineId]: details
            }
        }

        updateTDCDetails(updateDetails);
        
    }, []);


    const setTDCData = useCallback( async(tdc: TDCModel, clousingId: number)=>{

        const currentClousingData = tdcRef.current[clousingId] || {};

        const updateTDC = {
            ...tdcRef.current,
            [clousingId]:  tdc
        };

        updateTDCData(updateTDC);

    }, []);

    const value = useMemo(
        ()=>({
            tdc,
            tdcDetails,
            tdcLoading,
            detailsLoading,
            error,
            detailsError,
            getTDCData,
            setTDCData,
            tdcRef,
            setDetails
        }),
        [tdc, tdcDetails, tdcLoading, detailsLoading, error, detailsError, 
            getTDCData, setTDCData, setDetails, tdcRef]
    );

    return (
        <tdcContext.Provider value={value}>
            {children}
        </tdcContext.Provider>
    );
};