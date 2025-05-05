import { ReactNode, useRef } from 'react';
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { getTDCClousing, getTDCDetails } from '@services/clousingService';
import { BankLineModel, TDCModel, TDCContext, TDCContextType, TDCDetailsContext } from '@models/tdc.model';

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

    const getTDCData = useCallback( async(clousingId:number, idCurrency: number)=>{
        setTDCLoading(true);

        if(tdcRef.current[clousingId]) {
            setTDCLoading(false);
            return tdcRef.current[clousingId];
        }

        try {

            const data: TDCModel = await getTDCClousing(clousingId, idCurrency);
console.log('data', data);

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

    const getDetails = useCallback( async(clousingId:number, lineId:number | null)=>{
        setDetailsLoading(true);

        if (lineId === null) return Promise.resolve({ id: 0, bankName: '', total: 0, details: [] } as BankDetails);

        if(tdcDetailsRef.current[clousingId]?.[lineId]) {
            setDetailsLoading(false);
            return tdcDetailsRef.current[clousingId]?.[lineId];
        }

        setDetailsLoading(false);
        


      /*   try {

            const data: BankDetails = await getTDCDetails(clousingId, lineId)

            const currentClousingData = tdcDetailsRef.current[clousingId] || {};

            const updateDetails = {
                ...tdcDetailsRef.current,
                [clousingId]:{
                    ...(typeof currentClousingData === 'object' ? currentClousingData : {}),
                    [lineId]: data
                }
            }

            updateTDCDetails(updateDetails)
            
            return data;
            
        } catch (error) {
            
            setDetailsError(error instanceof Error ? error.message : String(error));
            
            throw error;

        } finally {

            setDetailsLoading(false);

        }
 */
    },[tdcDetails]);

    const setDetails = useCallback( async(details: BankLineModel, clousingId: number, lineId: number) => {

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
            getDetails,
            setDetails
        }),
        [tdc, tdcDetails, tdcLoading, detailsLoading, error, detailsError, 
            getTDCData, setTDCData, getDetails, setDetails]
    );

    return (
        <tdcContext.Provider value={value}>
            {children}
        </tdcContext.Provider>
    );
};