import { createContext, useContext, useState, useMemo, useCallback, useRef } from 'react';
import { getCashClousing } from '@services/clousingService';

const cashClousingContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCashClousing = () => useContext(cashClousingContext);

export function CashClousingProvider({ children }) {
    const [cashClousing, setCashClousing] = useState({});
    const [cashLoading, setCashLoading] = useState(false);
    const [error, setError] = useState(null);
    const cashRef = useRef(cashClousing);    
    
    const updateCashData = (newCashData) => {
        setCashClousing(newCashData);
        cashRef.current = newCashData
    }

    const getCashData = useCallback(async (clousingId, employeeId) => {
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
                    ...currentClousingData,
                    [employeeId]: response
                }
            }
            updateCashData(updateCash)

            return response;
        } catch (err) {
            setError(err);
        } finally {
            setCashLoading(false);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[cashClousing])

    const setCashData = useCallback((cashLine, employeeId, clousingId) => {

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