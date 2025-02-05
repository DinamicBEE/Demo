import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { getCashClousing } from '@services/clousingService';

const cashClousingContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCashClousing = () => useContext(cashClousingContext);

export function CashClousingProvider({ children }) {
    const [cashClousing, setCashClousing] = useState({});
    const [cashLoading, setCashLoading] = useState(false);
    const [error, setError] = useState(null);
    
    
    const getCashData = useCallback(async (clousingId, employeeId) => {
        setCashLoading(true);
        //console.log(cashClousing[employeeId]);
        if(cashClousing[employeeId]) {
            setCashLoading(false);
            return cashClousing[employeeId];
        }
    
        try {
            const response = await getCashClousing(clousingId, employeeId);
            //console.log(response);
            setCashClousing((prev) => ({
                ...prev,
                [employeeId]: response,
            }));
            return response;
        } catch (err) {
            setError(err);
        } finally {
            setCashLoading(false);
        }
    },[cashClousing])
    
    const value = useMemo(
        () => ({
        cashClousing,
        cashLoading,
        error,
        getCashData,
        }),
        [cashClousing, cashLoading, error, getCashData]
    );
    
    return (
        <cashClousingContext.Provider value={value}>
            {children}
        </cashClousingContext.Provider>
    );
}