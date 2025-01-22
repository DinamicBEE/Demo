import { ReactNode, createContext, useContext, useState, useMemo, useCallback, useRef } from 'react';
import { getCashClousing } from '@services/clousingService';
import { CashContext, CashContextType } from '@models/cash.model';

const cashClousingContext = createContext<CashContextType | undefined>(undefined);

export const useCashClousing = () => useContext(cashClousingContext);

export function CashClousingProvider({ children }: { children: ReactNode }) {
    const [cashClousing, setCashClousing] = useState<CashContext>({});
    const [cashLoading, setCashLoading] = useState(false);
    const [error, setError] = useState("");
    const cashRef = useRef<CashContext>(cashClousing);    
    
    const updateCashData = (newCashData: CashContext) => {
        setCashClousing(newCashData);
        cashRef.current = newCashData
    }

    const getCashData = useCallback(async (clousingId: number, employeeId: number) => {
        setCashLoading(true);

        if(cashRef.current[clousingId]) {
            setCashLoading(false);
            return cashRef.current[clousingId][employeeId];
        }
    
        try {
            const response = await getCashClousing(clousingId, employeeId);

            const currentClousingData = cashRef.current[clousingId] || {};

            const updateCash = {
                ...cashRef.current,
                [clousingId]: {
                    ...(typeof currentClousingData === 'object' ? currentClousingData : {}),
                    [employeeId]: response
                }
            }
            updateCashData(updateCash)

            return response;
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
        } finally {
            setCashLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[cashClousing])

    const setCashData = useCallback((cashLine: any, employeeId: number, clousingId: number) => {

        const currentClousingData = cashRef.current[clousingId] || {};

        const updateCash = {
            ...cashRef.current,
            [clousingId]: {
                ...currentClousingData,
                [employeeId]: cashLine
            }
        }

        updateCashData(updateCash)

    }, []);
    
    const value = useMemo(
        () => ({
        cashClousing,
        cashLoading,
        error,
        getCashData,
        setCashData
        }),
        [cashClousing, cashLoading, error, getCashData, setCashData]
    );
    
    return (
        <cashClousingContext.Provider value={value}>
            {children}
        </cashClousingContext.Provider>
    );
}