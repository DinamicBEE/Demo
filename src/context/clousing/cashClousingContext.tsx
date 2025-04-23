import { ReactNode, createContext, useContext, useState, useMemo, useCallback, useRef } from 'react';
import { getCashClousing } from '@services/clousingService';
import { CashContext, CashContextType, CashModel } from '@models/cash.model';

const cashClousingContext = createContext<CashContextType>({} as CashContextType);

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

    const getCashData = useCallback(async (clousingId: number, idCurrency: number) => {
        setCashLoading(true);

        if(cashRef.current[clousingId]) {
            setCashLoading(false);
            return cashRef.current[clousingId];
        }
    
        try {
            const response = await getCashClousing(clousingId, idCurrency);

            if (!response.success) {
                setCashLoading(false);
                return {} as CashModel;
            }

            const updateCash: CashContext = {
                ...cashRef.current,
                [clousingId]: response.data
            }
            updateCashData(updateCash)

            return response.data as CashModel;
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
            return {} as CashModel;
        } finally {
            setCashLoading(false);
        }
    },[cashClousing])

    const setCashData = useCallback((cashLine: CashModel, clousingId: number) => {// employeeId: number,

        const updateCash = {
            ...cashRef.current,
            [clousingId]: cashLine
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