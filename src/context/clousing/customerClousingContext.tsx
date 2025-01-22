import { ReactNode } from 'react';
import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { getCustomerClousing } from '@services/clousingService';
import { CustomerContextType } from '@models/customer.model';


const customerContext = createContext<CustomerContextType | undefined>(undefined);

export const useCustomerContext = () => useContext(customerContext);


export function CustomerClousingProvider({ children }: { children: ReactNode }) {
    const [customer, setCustomer] = useState<any>({});
    const [customerLoading, setCustomerLoading] = useState(false);
    const [error, setError] = useState("");

    const getCustomerData = useCallback( async(clousingId:number, employeeId:number) => {
        setCustomerLoading(true);

        if(customer[employeeId]){
            setCustomerLoading(false);
            return customer[employeeId]
        }

        try {
            
            const data = await getCustomerClousing(clousingId, employeeId);
            
            setCustomer((prevCustomer: any) => ({
                ...prevCustomer,
                [employeeId]: data,
            }));
            
            return data;

        } catch (error) {
            
            setError(error instanceof Error ? error.message : String(error));
            
            throw error;

        } finally {
            setCustomerLoading(false);
        }

    }, [customer]);

    const value = useMemo(
        () => ({
            customer,
            customerLoading,
            error,
            getCustomerData 
        }), 
        [customer, customerLoading, error, getCustomerData]
    );

    return (
        <customerContext.Provider value={value}>
            {children}
        </customerContext.Provider>
    );
};